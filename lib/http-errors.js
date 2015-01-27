/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

/**
 * HTTP errors. List of errors:
 *  https://github.com/mercmobily/HTTPErrors
 *
 * Useful in routes to send an error as a response.
 *
 * e.g.:
 *
 * var httpErrors = require('./lib/http-errors');
 *
 * routerHandler(req, res, next) {
 *   if (! isUserAuthenticated(req)) {
 *     return httpErrors.UnauthorizedError();
 *   }
 * }
 */

var httpErrors = require('allhttperrors');

Object.keys(httpErrors).forEach(function(errorName) {
  exports[errorName] = function (message) {
    return new httpErrors[errorName](message);
  };
});

/**
 * Check if an error is of a given type
 *
 * @method is
 * @param {Error} err Error to check
 * @param {String || Error Function} errorType Type to compare to
 * @return {Boolean} true if the same type, false otw.
 */
exports.is = function (err, errorType) {
  if (typeof errorType === 'string') {
    return err instanceof httpErrors[errorType];
  }

  return err.varructor === errorType().varructor;
};
