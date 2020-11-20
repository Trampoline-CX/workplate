import { rmdirSync } from 'fs'
import { CaporalLogger } from '../../types'
import { exec } from '../../utils/exec'
import { CreateArgs } from '.'

/**
 * Clone the target repository and return its path.
 */
export const cloneRepository = (args: CreateArgs, logger: CaporalLogger): string => {
  const cloneDirectory = './' + args.appName

  logger.info('Cloning repository...')
  try {
    exec('git', ['clone', args.repository, cloneDirectory, '--depth', '1'])
  } catch (e) {
    rmdirSync(cloneDirectory, { recursive: true }) // Delete temporary directory in case cloning fails
    throw e
  }

  logger.log('Repository cloned!')

  return cloneDirectory
}
