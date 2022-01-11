import { openUrl } from './utils/openUrl'
import { getRemoteOrigin } from './utils/git'
import {
  COM_OPEN_REPO,
  COM_CHANGE_THEME,
  COM_CHANGE_LOCALE,
  COM_OPEN_TERMINAL,
  COM_RELOAD,
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
    })
  )
}

// uninstall
export function deactivate() {}
