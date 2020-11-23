import { ExecFileOptions, execFileSync } from 'child_process'

/**
 * Execute a Shell command and returns a Promise, which never rejects. The error is returned in the Promise result.
 */
export const exec = (
  command: string,
  args: string[] = [],
  options: ExecFileOptions = {},
): string => {
  // We use execFile to be able to pass command arguments in an array to prevent command injection.
  return execFileSync(command, args, { encoding: 'utf-8', stdio: 'pipe', ...options })
}
