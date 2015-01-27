/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

var path = require('path');
var intel = require('intel');
var mkdirp = require('mkdirp');

// 5 meg per log file max
var DEFAULT_MAX_SIZE_IN_BYTES = 5 * 1024 * 1024;
var DEFAULT_HANDLERS = ['console', 'file'];
var DEFAULT_LEVEL = 'DEBUG';


/**
 * Create a `intel` logger
 *
 * @function logger
 * @param {object=config} config
 * @param {String} config.file
 * target file for logs
 * @param {Number} config.maxSize
 * maximum log size, in bytes. defaults to 5MB.
 * @param {String} config.level
 * minimum level to log. defaults to `DEBUG`
 * @param {Array} config.handlers
 * list of handlers to attach
 * @returns {Object} logger
 */
module.exports = function (config) {
  var target = config.get('file');

  var targetDir = path.dirname(target);
  mkdirp.sync(targetDir);

  var intelConfig = {
    formatters: {
      'console': {
        'format': '%(levelname)s %(name)s: %(message)s',
        'colorize': true
      },
      'file': {
        'format': '[%(date)s] %(levelname)s: %(message)s',
        'colorize': false
      }
    },
    handlers: {
      'console': {
        'class': intel.handlers.Console,
        formatter: 'console'
      },
      'file': {
        'class': intel.handlers.Rotating,
        formatter: 'file',
        file: target,
        maxSize: config.get('maxSize') || DEFAULT_MAX_SIZE_IN_BYTES,
        maxFiles: 10
      }
    },
    // this will be set below.
    loggers: {}
  };

  intelConfig.loggers[target] = {
    level: config.get('level') || DEFAULT_LEVEL,
    handlers: config.get('handlers') || DEFAULT_HANDLERS,
    propagate: false,
    handleExceptions: true,
    exitOnError: false
  };

  intel.config(intelConfig);
  return intel.getLogger(target);
};
