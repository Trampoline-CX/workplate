import chalk from 'chalk'
import path from 'path'
import { CaporalLogger } from '../../types'
import { exec } from '../../utils/exec'
import { CreateOptions } from '.'
import { rmdirSync } from 'fs'

export const keepRelevantFiles = (
  repoPath: string,
  options: CreateOptions,
  logger: CaporalLogger,
): void => {
  // Delete .git/
  rmdirSync(path.join(repoPath, '.git'), { recursive: true })

  // Keep only certain templates, if --template option is provided
  if (typeof options.workspace === 'string' && options.workspace.length > 0) {
    _keepRelevantWorkspaces(repoPath, options.workspace, logger)
  }
}

const _keepRelevantWorkspaces = (
  repoPath: string,
  workspaceName: string,
  logger: CaporalLogger,
): void => {
  logger.debug('Getting list of workspaces in repo.')
  const workspacesInfo = exec('yarn', ['workspaces', 'info', '--json'], { cwd: repoPath })
  logger.debug('Workspaces list JSON', workspacesInfo)

  const parsedInfo: WorkspacesInfo = JSON.parse(workspacesInfo)
  const workspacesToKeep: WorkspacesInfo = {}

  _recursiveGetDependencies(parsedInfo, workspaceName, workspacesToKeep)
  logger.debug('Workspaces to keep', workspacesInfo)

  const workspacesToRemove = Object.fromEntries(
    Object.entries(parsedInfo).filter(x => !workspacesToKeep[x[0]]),
  )
  logger.debug('Workspaces to remove', workspacesToRemove)

  for (const obj of Object.values(workspacesToRemove)) {
    if (obj) {
      rmdirSync(path.join(repoPath, obj.location), { recursive: true })
    }
  }
  logger.debug('Deleted unneeded repositories')
}

const _recursiveGetDependencies = (
  all: WorkspacesInfo,
  workspaceName: string,
  outWorkspaces: WorkspacesInfo,
): void => {
  const info = all[workspaceName]

  if (info) {
    // If there is a cyclic dependency, just return to prevent infinite recursion
    if (outWorkspaces[workspaceName]) {
      return
    }

    outWorkspaces[workspaceName] = info

    // Recursively get dependencies of dependent packages
    for (const workspace of info.workspaceDependencies) {
      _recursiveGetDependencies(all, workspace, outWorkspaces)
    }
  } else {
    throw new Error(
      `No workspace in repository with name ${chalk.cyan(
        workspaceName,
      )}. Possible names are: ${Object.keys(all)
        .map(x => chalk.cyan(x))
        .join(', ')}`,
    )
  }
}

interface YarnWorkspaceInfo {
  location: string
  workspaceDependencies: string[]
  mismatchedWorkspaceDependencies: string[]
}

type WorkspacesInfo = Record<string, YarnWorkspaceInfo>
