import { CaporalLogger } from '../../types'
import { cloneRepository } from './clone-repository'
import { rmdirSync } from 'fs'
import { keepRelevantFiles } from './keep-relevant-files'
import { initGit } from './init-git'
import chalk from 'chalk'

export interface CreateArgs {
  appName: string
  repository: string
}

export interface CreateOptions {
  workspace?: string
}

export const create = (args: CreateArgs, options: CreateOptions, logger: CaporalLogger): void => {
  const repoPath = cloneRepository(args, logger)
  try {
    keepRelevantFiles(repoPath, options, logger)
    initGit(repoPath, logger)
    logger.info(`Done! Execute ${chalk.cyan('cd ' + repoPath)} to enter in directory.`)
  } catch (e) {
    // Delete repo folder following error
    rmdirSync(repoPath, { recursive: true })
    throw e
  }
}
