import * as vscode from 'vscode'

import { createWebviewContent } from './createWebviewContent'

export const createLoadingWebviewContent = (
  webview: vscode.Webview,
  extensionUri: vscode.Uri
) => {
  return createWebviewContent(
    webview,
    extensionUri,
    `<div style="padding:0;position: relative;width:100%;height:calc(100vh - 26px);" id="container">
  <vscode-progress-ring style="position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);"></vscode-progress-ring>
</div>`
  )
}
