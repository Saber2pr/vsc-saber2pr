import { appendParams, isActiveThemeKind } from './webview/utils'
import { createIFrameWebviewContent } from './webview/createIFrameWebviewContent'
import axios from 'axios'
import * as vscode from 'vscode'
import { init, localize } from 'vscode-nls-i18n'

import {
  COM_CHANGE_LOCALE,
  COM_CHANGE_THEME,
  COM_GIT_PUSH_CHORE,
  COM_OPEN_FILE_WINDOW,
  COM_OPEN_IFrame,
  COM_OPEN_REPO,
  COM_OPEN_TERMINAL,
  COM_OPEN_URL_BLOG,
  COM_OPEN_VSC_MARKETPLACE,
  COM_RELOAD,
  COM_UPDATE_URI_EXTENSION,
  listUri,
  refreshExtensionUri,
} from './constants'
import { handleMessage } from './handleMessage'
import { COMMANDS } from './utils/commands'
import { execShell } from './utils/execShell'
import { getRemoteOrigin } from './utils/git'
import { openUrl } from './utils/openUrl'
import { createListWebviewContent } from './webview/createListWebviewContent'
import { createLoadingWebviewContent } from './webview/createLoadingWebviewContent'
import { join } from 'path'
import json from 'json5'

axios.defaults.transformResponse = [
  text => {
    return json.parse(text)
  },
]

let webviewPanel: vscode.WebviewPanel
let statusBar: vscode.StatusBarItem = null

// install
export function activate(context: vscode.ExtensionContext) {
  init(context.extensionPath)

  // statusBar init
  statusBar = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    101
  )
  statusBar.text = '$(arrow-up)'
  statusBar.tooltip = 'quick push'
  statusBar.command = COM_GIT_PUSH_CHORE
  statusBar.show()

  // webview init
  function activeIFrameWebview(title: string, src: string, reload = false) {
    src = appendParams(
      src,
      `theme=${
        isActiveThemeKind(vscode.ColorThemeKind.Light) ? 'light' : 'dark'
      }`
    )
    if (webviewPanel) {
      if (reload) {
        webviewPanel.webview.html = createIFrameWebviewContent(
          webviewPanel.webview,
          context.extensionUri,
          src
        )
      }
      webviewPanel.title = title
      webviewPanel.reveal()
    } else {
      webviewPanel = vscode.window.createWebviewPanel(
        'iframe',
        title,
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: false,
        }
      )
      webviewPanel.iconPath = vscode.Uri.file(
        join(context.extensionPath, 'assets', 'logo.png')
      )

      webviewPanel.webview.html = createIFrameWebviewContent(
        webviewPanel.webview,
        context.extensionUri,
        src
      )

      webviewPanel.onDidDispose(
        () => {
          webviewPanel = undefined
        },
        null,
        context.subscriptions
      )
    }
  }

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('extensions', {
      resolveWebviewView(webview) {
        webview.title = localize('saber2pr.title.extensions')
        webview.webview.options = {
          enableScripts: true,
        }

        // loading
        webview.webview.html = createLoadingWebviewContent(
          webview.webview,
          context.extensionUri
        )
        // render data
        axios.get(`${listUri}?t=${Date.now()}`).then(res => {
          console.log('Extension Config', res.data)
          webview.webview.html = createListWebviewContent(
            webview.webview,
            context.extensionUri,
            res.data
          )
        })

        webview.webview.onDidReceiveMessage(
          handleMessage,
          null,
          context.subscriptions
        )
      },
    }),
    vscode.commands.registerCommand(COM_OPEN_IFrame, async (data: string) => {
      const index = data.indexOf(':')
      const title = data.slice(0, index)
      const src = data.slice(index + 1)
      activeIFrameWebview(title, src, true)
    }),
    vscode.commands.registerCommand(COM_OPEN_REPO, async () => {
      const remote = await getRemoteOrigin()
      await openUrl(remote)
    }),
    vscode.commands.registerCommand(COM_OPEN_TERMINAL, () => {
      vscode.commands.executeCommand(COMMANDS.openTerminal)
    }),
    vscode.commands.registerCommand(COM_CHANGE_THEME, () => {
      vscode.commands.executeCommand(COMMANDS.changeTheme)
    }),
    vscode.commands.registerCommand(COM_CHANGE_LOCALE, () => {
      vscode.commands.executeCommand(COMMANDS.changeLocale)
    }),
    vscode.commands.registerCommand(COM_RELOAD, () => {
      vscode.commands.executeCommand(COMMANDS.reload)
    }),
    vscode.commands.registerCommand(COM_OPEN_VSC_MARKETPLACE, () => {
      openUrl('https://marketplace.visualstudio.com/manage/')
    }),
    vscode.commands.registerCommand(COM_OPEN_URL_BLOG, () => {
      vscode.commands.executeCommand(
        'simpleBrowser.show',
        'https://saber2pr.top/?plain-menu-blog#/blog/%E6%B0%B8%E6%81%92%E3%81%AE%E5%B9%BB%E6%83%B3%E4%B9%A1'
      )
    }),
    vscode.commands.registerCommand(COM_OPEN_FILE_WINDOW, (uri: vscode.Uri) => {
      execShell('code', ['-n', uri.fsPath])
    }),
    vscode.commands.registerCommand(COM_UPDATE_URI_EXTENSION, async () => {
      vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: 'Update Extension Config',
        },
        async progress => {
          try {
            progress.report({ increment: 0 })
            const res = await axios.get(refreshExtensionUri)
            console.log(res.data)
            vscode.window.showInformationMessage('Update Success')
            progress.report({ increment: 100 })
          } catch (error) {
            vscode.window.showErrorMessage('Update Fail')
          }
        }
      )
    }),
    statusBar,
    vscode.commands.registerCommand(COM_GIT_PUSH_CHORE, async () => {
      const value = await vscode.window.showInputBox({
        placeHolder: localize('saber2pr.git.push.placeholder'),
        value: 'chore: update',
        prompt: localize('saber2pr.git.push.title'),
      })
      await execShell('git', ['add', '.'], 'inherit')
      if (value) {
        if (/["']/.test(value)) {
          vscode.window.showErrorMessage('commit message not include "\' ')
          return
        }
        await execShell(
          'git',
          ['commit', '.', '--no-verify', '-i', '-m', `"${value}"`],
          'inherit'
        )
        vscode.commands.executeCommand('git.push')
      }
    })
  )
}

// uninstall
export function deactivate() {
  if (statusBar) {
    statusBar.hide()
    statusBar.dispose()
  }
  if (webviewPanel) {
    webviewPanel.dispose()
  }
  statusBar = null
  webviewPanel = null
}
