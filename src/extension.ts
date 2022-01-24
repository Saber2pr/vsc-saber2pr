import { execShell } from './utils/execShell';
import { openUrl } from './utils/openUrl'
import { getRemoteOrigin } from './utils/git'
import {
  COM_OPEN_REPO,
  COM_CHANGE_THEME,
  COM_CHANGE_LOCALE,
  COM_OPEN_TERMINAL,
  COM_RELOAD,
  COM_OPEN_VSC_MARKETPLACE,
  COM_OPEN_FILE_WINDOW,
  COM_OPEN_URL_BLOG,
} from './constants'
import { init } from 'vscode-nls-i18n'
import * as vscode from 'vscode'
import { COMMANDS } from './utils/commands'

// install
export function activate(context: vscode.ExtensionContext) {
  init(context.extensionPath)

  context.subscriptions.push(
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
      vscode.commands.executeCommand('simpleBrowser.show', 'https://saber2pr.top/#/blog/%E6%B0%B8%E6%81%92%E3%81%AE%E5%B9%BB%E6%83%B3%E4%B9%A1')
    }),
    vscode.commands.registerCommand(COM_OPEN_FILE_WINDOW, (uri: vscode.Uri) => {
      execShell('code', ['-n', uri.fsPath])
    })
  )
}

// uninstall
export function deactivate() {}
