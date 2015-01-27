/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

var http = require('http');

exports.start = function (app, logger, config) {
  var port = config.get('port');

  http.createServer(app).listen(port, function() {
    console.log('http listening on port', port);
    logger.info('http listening on port', port);
  });
};

