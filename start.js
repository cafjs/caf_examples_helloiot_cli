#!/usr/bin/env node
var client = require('./index.js');
if (process.argv.length != 3) {
    console.log('Error: Wrong number of arguments: start.js url ' +
                ' where url is, e.g.: http://helloiot.cafjs.com/iot/<device_id>');
} else {
    var config = {url: process.argv[2]};
    client.start(config);
}
