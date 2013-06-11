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
var pif = require('caf_piface');


exports.start = function(config) {

    var counter= 7000;
    config = config || {};
    config.interval = 1000;
    var pi = new pif.PiFace();
    pi.init();

    var tAdj;

    var mainF = {
        config: config,
        readSensorsHook: function(mapOut, cb) {
            counter = counter + 1;
            mapOut.counter = counter;
            mapOut.inputs = pi.read();
            mapOut.outputs = pi.readOutput();
            mapOut.pullups = pi.readPullups();
            cb(null);
        },

        /**
         * 'command' is  a string with a data structure encoded in JSON with
         * the following type:
         *
         *   Array.<{op:string, args: Array.<Object>}>
         *
         * In particular, when op is "blink", the args array
         * is a triplet with start_time (UTC in msec since 1/1/1970),
         * blink duration (msec) and pin number.
         *
         *
         */
        executeCommandHook: function(command, mapIn, mapOut, cb) {
            console.log("Got command: " + command + " with mapIn: " +
                        JSON.stringify(mapIn));
            var commandParsed = JSON.parse(command);
            var now = new Date().getTime();
            now = now + tAdj.getOffset();
            var blink = function(delay, duration, pinNum) {
                setTimeout(function() {
                               pi.write(1, pinNum);
                           }, delay);
                setTimeout(function() {
                               pi.write(0, pinNum);
                           }, delay + duration);
            };
            commandParsed.forEach(function(x) {
                                      if ((x.op === 'blink') &&
                                          (x.args.length === 3)) {
                                          var delay = x.args[0] - now;
                                          if (delay > 0) {
                                              blink(delay, x.args[1],
                                                    x.args[2]);
                                          } else {
                                              console.log(" Too late for blink"
                                                          + " " +  x.args[0]);
                                          }
                                      }
                                  });
            cb(null, "Done " + command);
        },
        mainHook: function(mapIn, mapOut, cb) {
            if ((typeof mapIn.outputs === 'number') &&
                (mapIn.outputs >= 0) && (mapIn.outputs <= 255)) {
                var mask = 1;
                for (var i = 0; i < 8; i++) {
                    if (mask & mapIn.outputs) {
                        pi.write(1, i);
                    } else {
                        pi.write(0, i);
                    }
                    mask = mask << 1;
                }
            }
            console.log("Iter:" + counter.toString() + " Output:" +
                        mapIn.outputs);
            console.log("Offset:" + tAdj.getOffset());
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
    tAdj = main.getTimeAdjuster();
    main.start();
    return main;
};
