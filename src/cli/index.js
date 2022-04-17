const chalk = require('chalk');
const cli = require('./cli');
const Interpreter = require('../interpreter');
const fetchSource = require('../fetchSource');
const { Extensions } = require('../symboltable');

// HANDLING ERROR
process.on('unhandledRejection', err => {
  console.error(`UNHANDLED ERROR`, err);
  process.exit();
});

// VERSION
if (cli.input.version) {
  cli.showVersion();
  cli.end();
}

// HELP
if (cli.input.help) {
  cli.showHelp();
  cli.end();
}

// 'help', 'version', 'debug'
if (!cli.input._[0]) {
  cli.showWelcomeMsg();
} else {
  try {
    if (!Extensions.includes(cli.input._[0].split('.')[1])) {
      console.log(cli.input._[0].split('.')[1],
        '\n' + chalk.hex('#f44336').inverse.bold(' ERROR: ') + '\n\n' +
        chalk.bold('This file type not supported.\n\nSupported file types: ') + chalk.yellow(`['v', 'ved', 'veda']`) + '\n\n'
      );
      cli.end();
    }
    const { d } = cli.input;

    if (d) console.log(chalk.hex('#9966cc').inverse.bold(' Debug Mod '), '\n');

    if (d) console.time('⌛ Total Runtime');

    const file = fetchSource(cli.input._[0], true);

    Interpreter(file.code, file.name, file.dir);

    if (d) console.timeEnd('⌛ Total Runtime');
  } catch (err) {
    console.log('\n', chalk.yellow('✖ ERROR →'), err.message, '\n');
  }
}