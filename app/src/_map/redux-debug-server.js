#! /usr/bin/env node
// eslint-disable-next-line import/no-extraneous-dependencies
const remotedev = require('remotedev-server');

remotedev({ hostname: 'localhost', port: 8000 });
