import { openUrl } from './utils/openUrl'
import vscode from 'vscode'
import { COM_OPEN_IFrame } from './constants'

export interface IMessage {
  service: string
  params: string
  [k: string]: string
}

export const handleMessage = (message: IMessage) => {
  switch (message.service) {
    case 'openUrl':
      openUrl(message.params)
      break
    case 'browser':
      vscode.commands.executeCommand('simpleBrowser.show', message.params)
      break
    case COM_OPEN_IFrame:
      vscode.commands.executeCommand(COM_OPEN_IFrame, message.params)
      break
    case 'command':
      vscode.commands.executeCommand(message.params)
      break
    default:
      break
  }
}
