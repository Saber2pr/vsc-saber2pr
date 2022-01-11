import { localize } from 'vscode-nls-i18n'
import { window } from 'vscode'
import GitUrlParse from 'git-url-parse'

import { execShell } from './execShell'

export const getRemoteOrigin = async () => {
  const info = await execShell('git', ['remote', '-v'])
  if (info) {
    const url = info.match(/origin\s(\S*?)\s\(fetch\)/)?.[1]
    const gitInfo = GitUrlParse(url)
    const href = gitInfo?.href
    if (typeof href === 'string' && href.startsWith('http')) return href
    window.showErrorMessage(
      `Parse Git Remote: ${localize('saber2pr.error.need.http')}`
    )
  }
}
