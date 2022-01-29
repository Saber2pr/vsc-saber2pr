import * as vscode from 'vscode'
import { createWebviewContent } from './createWebviewContent'

export const createIFrameWebviewContent = (
  webview: vscode.Webview,
  extensionUri: vscode.Uri,
  href: string
) => {
  return createWebviewContent(
    webview,
    extensionUri,
    `<iframe src="${href}" style="border:0;width:100vw;height:100vh;" allow="clipboard-read; clipboard-write"></iframe>`,
    { bodyStyle: 'padding:0;overflow:hidden;' }
  )
}
