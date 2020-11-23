#!/usr/bin/env node
import prog from 'caporal'
import { version, description } from './package-info.json'
import { create, CreateArgs, CreateOptions } from './commands/create'
import { existsSync } from 'fs'
import chalk from 'chalk'

prog
  .name('Workplate')
  .description(description)
  .version(version)
  .command('create', 'Create an application from a template')
  .argument(
    '<appName>',
    'Name of the application to create (also the default directory name for the created app)',
    value => {
      if (!/^[A-Z0-9-_]+$/gi.test(value)) {
        throw new Error(`App name must be a name valid as a directory name.`)
      }

      if (existsSync(value)) {
        throw new Error(
          `App cannot be created because directory ${chalk.cyan(value + '/')} already exists.`,
        )
      }

      return value
    },
  )
  .argument('<repository>', 'Repository URL to clone from')
  .option('-w, --workspace <template>', 'Workspace Name to clone', prog.STRING)
  .action((args, options, logger) => {
    create(args as CreateArgs, options as CreateOptions, logger)
  })

prog.parse(process.argv)
