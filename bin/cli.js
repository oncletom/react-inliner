#!/usr/bin/env node

'use strict';

var inliner = require('../index.js');
var pkg = require('../package.json');
var fs = require('fs');
var join = require('path').join;
var cwd = process.cwd();

var argv = require('yargs')
  .version(pkg.version, 'version')
  .help('help')
  .options('output', {
    alias: 'o',
    description: 'Destination filepath (default is stdout)'
  })
  .options('reactid', {
    description: 'Include or suppress the data-reactid attribute in the HTML markup.',
    default: true,
    type: 'boolean'
  })
  .usage('$0 inputFile.html -o outputFile.html')
  .example('$0 inputFile.html -o outputFile.html --no-reactid')
  .example('cat inputFile.html | $0 -o outputFile.html', 'Piping in, writing out.')
  .example('$0 inputFile.html | htmlhint', 'Reading it, piping out')
  .strict()
  .argv;

var inputStream = argv._.length ? fs.createReadStream(join(cwd, argv._[0])) : process.stdin;
var outputStream = argv.output ? fs.createWriteStream(join(cwd, argv.output)) : process.stdout;

inputStream
  .pipe(inliner({ reactId: argv.reactid }))
  .pipe(outputStream);
