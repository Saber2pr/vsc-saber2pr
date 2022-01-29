import * as vscode from 'vscode'
import { COM_OPEN_IFrame } from '../constants'

import { createWebviewContent } from './createWebviewContent'

export type List = Array<{
  'zh-cn': string
  en: string
  href: string
  command: string
}>

const getLang = () =>
  ({
    en: 'en',
    'zh-cn': 'zh-cn',
  }[vscode.env.language] || 'en')

export const renderList = (list: List) => {
  const language = getLang()

  // TODO: event proxy
  const listHtml = list.map(
    item =>
      `<vscode-button style="width:100%;height:26px;margin-top:13px;" onclick="vscode.postMessage({service: '${
        item.command ? 'command' : COM_OPEN_IFrame
      }',params:'${
        item.href ? `${item[language]}:${item.href}` : item.command
      }'})">${item[language]}</vscode-button>`
  )
  return listHtml.join('')
}

export const createListWebviewContent = (
  webview: vscode.Webview,
  extensionUri: vscode.Uri,
  list: List
) => {
  const listHtml = renderList(list)
  return createWebviewContent(
    webview,
    extensionUri,
    `<div style="padding:0 0 1em;" id="container">${listHtml}</div>`
  )
}
