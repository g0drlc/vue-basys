#!/usr/bin/env node

const chalk = require('chalk');
const yargs = require('yargs');
const {executeCommand} = require('./lib/index');

const {argv} = yargs
  .usage('$0 <command> [<app-name>]')
  .command('dev [<app-name>]', 'Start a development server', yargs => {
    yargs.positional('app-name', {type: 'string'});
  })
  .command('build [<app-name>]', 'Build the app for production', yargs => {
    yargs.positional('app-name', {type: 'string'});
  })
  .command('start [<app-name>]', 'Serve a production bundle', yargs => {
    yargs.positional('app-name', {type: 'string'});
  })
  .command('e2e [<app-name>]', 'Run end-to-end tests', yargs => {
    yargs.positional('app-name', {type: 'string'});
  })
  .command('lint', 'Lint the project code')
  .command('lint:fix', 'Lint the project code and apply fixes')
  .help();

const command = argv._[0];
try {
  if (argv._.length < 1) throw new Error('You need to provide a command');

  if (!['dev', 'build', 'start', 'e2e', 'lint', 'lint:fix'].includes(command)) {
    throw new Error('Invalid command provided');
  }
} catch (e) {
  yargs.showHelp();
  console.log(chalk.bold.red(e.message));
  process.exit(1);
}

const projectDir = process.cwd(); // BUG: is it always correct? Only if called from the project root directory?
executeCommand(projectDir, command, argv['app-name']).catch(err => {
  console.log(chalk.bold.red(err));
  process.exit(1);
});
