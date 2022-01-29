import { appendParams, isActiveThemeKind } from './webview/utils'
import { createIFrameWebviewContent } from './webview/createIFrameWebviewContent'
import axios from 'axios'
import * as vscode from 'vscode'
import { init, localize } from 'vscode-nls-i18n'

import {
  COM_CHANGE_LOCALE,
  COM_CHANGE_THEME,
  COM_OPEN_FILE_WINDOW,
  COM_OPEN_IFrame,
  COM_OPEN_REPO,
  COM_OPEN_TERMINAL,
  COM_OPEN_URL_BLOG,
  COM_OPEN_VSC_MARKETPLACE,
  COM_RELOAD,
  listUri,
} from './constants'
import { handleMessage } from './handleMessage'
import { COMMANDS } from './utils/commands'
import { execShell } from './utils/execShell'
import { getRemoteOrigin } from './utils/git'
import { openUrl } from './utils/openUrl'
import { createListWebviewContent } from './webview/createListWebviewContent'
import { createLoadingWebviewContent } from './webview/createLoadingWebviewContent'
import { join } from 'path'

let webviewPanel: vscode.WebviewPanel

// install
export function activate(context: vscode.ExtensionContext) {
  init(context.extensionPath)

  // webview init
  function activeIFrameWebview(src: string, reload = false) {
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
      webviewPanel.reveal()
    } else {
      webviewPanel = vscode.window.createWebviewPanel(
        'iframe',
        localize('saber2pr.title.extensions'),
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
        axios
          .get(listUri, {
            params: { t: Date.now() },
          })
          .then(res => {
            console.log(res)
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
    vscode.commands.registerCommand(COM_OPEN_IFrame, async (src: string) => {
      activeIFrameWebview(src, true)
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
    })
  )
}

// uninstall
export function deactivate() {
  if (webviewPanel) {
    webviewPanel.dispose()
  }
  webviewPanel = null
}
