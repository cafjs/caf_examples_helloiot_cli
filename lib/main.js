/*!
Copyright 2013 Hewlett-Packard Development Company, L.P.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

var cli = require('caf_iot_cli');



exports.start = function(config) {

    var counter= 7000;
    var mainF = {
        interval: 2000,
        url: config.url,
        readSensorsHook: function(mapOut, cb) {
            counter = counter + 1;
            mapOut.b = counter;
            mapOut.a = counter;
            cb(null);
        },
        executeCommandHook: function(command, mapIn, mapOut, cb) {
            console.log("Got command: " + command + " with mapIn: " +
                        JSON.stringify(mapIn));
            cb(null, "Done " + command);
        },
        mainHook: function(mapIn, mapOut, cb) {
            console.log("Iteration " + (counter - 7000).toString());
            cb(null);
        },
        cb: function(err, data) {
            if (err) {
                console.log("Dying!!!: error:" + JSON.stringify(err));
            } else {
                 console.log("Got " + JSON.stringify(data));
            }
        }
    };

    var main = new cli.MainLoop(mainF);
    main.start();
    return main;
};
