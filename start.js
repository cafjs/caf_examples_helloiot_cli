#!/usr/bin/env node
var client = require('./index.js');
if (process.argv.length != 2) {
    console.log('Error: Wrong number of arguments: node start.js deviceId ' +
                ' baseURL, e.g.: http://helloiot.cafjs.com/');
} else {
    var config = {deviceId: process.argv[2],
                  baseURL: parseInt(process.argv[3])};
    client.start(config);
}
