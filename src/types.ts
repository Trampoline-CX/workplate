export interface CaporalLogger {
  debug(str: string | unknown): void
  debug(format: string, ...mixed: unknown[]): void
  info(str: string | unknown): void
  info(format: string, ...mixed: unknown[]): void
  log(str: string | unknown): void
  log(format: string, ...mixed: unknown[]): void
  warn(str: string | unknown): void
  warn(format: string, ...mixed: unknown[]): void
  error(str: string | unknown): void
  error(format: string, ...mixed: unknown[]): void
}
