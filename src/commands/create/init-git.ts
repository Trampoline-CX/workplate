import { exec } from '../../utils/exec'
import { CaporalLogger } from '../../types'

export const initGit = (repoPath: string, logger: CaporalLogger): void => {
  logger.debug('Initializing Git Repository...')
  exec('git', ['init'], { cwd: repoPath })
  exec('git', ['add', '*'], { cwd: repoPath })
  exec('git', ['commit', '-m', 'First commit'], { cwd: repoPath })
}
