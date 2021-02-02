const yargs = require('yargs');

const argv = yargs
    .option('port', {
        alias: 'p',
        description: 'Port to Listening',
        type: 'number',
    })
    .default('port', 6000)
    .help()
    .alias('help', 'h')
    .argv;


module.exports = argv
