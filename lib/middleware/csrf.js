/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// set up a middleware to add & check CSRF tokens on all POST requests
// except for those overridden in options.noCsrfUrls

'use strict';

var csurf = require('csurf');

module.exports = function (options) {
  options = options || {};
  var noCsrfUrls = options.noCsrfUrls || [];

  var csrfMiddleware = csurf();
  return function (req, res, next) {
    if (noCsrfUrls.indexOf(req.url) > -1) {
      return next();
    }

    csrfMiddleware(req, res, function () {
      res.locals.csrftoken = req.csrfToken();
      next();
    });
  };
};
