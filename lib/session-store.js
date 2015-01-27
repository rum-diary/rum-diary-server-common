/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * A MongoDB backed sessionStore for express. `create` must be called
 * with the database before use. `create` returns a promise that
 * will fulfill when ready.
 */

'use strict';

var Promise = require('bluebird');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

module.exports = function (db) {
  // use the existing mongoose connection.
  return db.connect().then(function (connection) {
    var sessionStore = new MongoStore({
      mongooseConnection: connection,
      collection: 'sessions'
    });

    return sessionStore;
  });
};
