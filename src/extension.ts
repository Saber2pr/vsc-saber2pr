import axios from 'axios'
import json from 'json5'
import { join } from 'path'
import * as vscode from 'vscode'
import { init, localize } from 'vscode-nls-i18n'

import {
  COM_CHANGE_LOCALE,
  COM_CHANGE_THEME,
  COM_GIT_PULL,
  COM_GIT_PUSH_CHORE,
  COM_OPEN_EXTLIST_CONFIG,
  COM_OPEN_FILE_WINDOW,
  COM_OPEN_IFrame,
  COM_OPEN_REPO,
  COM_OPEN_TERMINAL,
  COM_OPEN_URL_BLOG,
  COM_OPEN_VSC_MARKETPLACE,
  COM_RELOAD,
  Plugins,
  listUri,
} from './constants'
import { handleMessage } from './handleMessage'
import { COMMANDS } from './utils/commands'
import { execShell } from './utils/execShell'
import { getArray } from './utils/getArray'
import { getCurrentBranch, getRemoteOrigin } from './utils/git'
import { openUrl } from './utils/openUrl'
import { runScript } from './utils/runner'
import { createIFrameWebviewContent } from './webview/createIFrameWebviewContent'
import { createListWebviewContent } from './webview/createListWebviewContent'
import { createLoadingWebviewContent } from './webview/createLoadingWebviewContent'
import { appendParams, isActiveThemeKind } from './webview/utils'

axios.defaults.transformResponse = [
  text => {
    return json.parse(text)
  },
]

let webviewPanel: vscode.WebviewPanel
let gitPushStatusBar: vscode.StatusBarItem = null
let gitPullStatusBar: vscode.StatusBarItem = null

// install
export function activate(context: vscode.ExtensionContext) {
  init(context.extensionPath)

  // gitPullStatusBar init
  gitPushStatusBar = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    101
  )
  gitPushStatusBar.text = '$(arrow-up)'
  gitPushStatusBar.tooltip = 'quick push'
  gitPushStatusBar.command = COM_GIT_PUSH_CHORE
  gitPushStatusBar.show()

  // gitPullStatusBar init
  gitPullStatusBar = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    102
  )
  gitPullStatusBar.text = '$(arrow-down)'
  gitPullStatusBar.tooltip = 'quick pull'
  gitPullStatusBar.command = COM_GIT_PULL
  gitPullStatusBar.show()

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
          retainContextWhenHidden: true,
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

        webview.webview.html = createListWebviewContent(
          webview.webview,
          context.extensionUri,
          Plugins
        )

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
    vscode.commands.registerCommand(COM_OPEN_EXTLIST_CONFIG, async () => {
      await openUrl(
        `https://github.com/Saber2pr/saber2pr.github.io/blob/master/static/data/vsc-saber2pr-extensions.json`
      )
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
        'https://saber2pr.top/'
      )
    }),
    vscode.commands.registerCommand(COM_OPEN_FILE_WINDOW, (uri: vscode.Uri) => {
      execShell('code', ['-n', uri.fsPath])
    }),
    gitPushStatusBar,
    gitPullStatusBar,
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
          ['commit', '.', '-i', '-m', `"${value}"`, '--no-verify'],
          'inherit'
        )
        vscode.commands.executeCommand('git.pushWithTags')
      }
    }),
    vscode.commands.registerCommand(COM_GIT_PULL, async () => {
      const branch = await getCurrentBranch()
      if (branch) {
        runScript('git-pull', 'git', ['pull', 'origin', branch], 'cli')
      }
    })
  )
}

// uninstall
export function deactivate() {
  if (gitPushStatusBar) {
    gitPushStatusBar.hide()
    gitPushStatusBar.dispose()
  }
  if (webviewPanel) {
    webviewPanel.dispose()
  }
  gitPushStatusBar = null
  webviewPanel = null
}
