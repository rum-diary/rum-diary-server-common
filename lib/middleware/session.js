/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

var session = require('express-session');

module.exports = function (config) {
  var sessionStore = config.sessionStore;
  var sessionlessUrls = config.sessionlessUrls || [];
  var cookieConfig = config.config;
  var validateSession = config.validateSession;

  var sessionMiddleware = createSessionMiddleware(sessionStore, cookieConfig);

  return function middlewareProxy(req, res, next) {
    if (isUrlSessionless(sessionlessUrls, req.url)) {
      return next();
    }

    sessionMiddleware(req, res, function (err) {
      if (err) {
        return next(err);
      } else if (validateSession) {
        return validateSession(req, res, next);
      }

      next();
    });
  };
};

function createSessionMiddleware(sessionStore, config) {
  return session({
    cookie: {
      maxAge: config.get('session_duration_ms'),
      httpOnly: true,
      secure: config.get('ssl'),
    },
    name: config.get('session_cookie_name'),
    secret: config.get('session_cookie_secret'),
    store: sessionStore,
    resave: false,
    saveUninitialized: true
  });
}

function isUrlSessionless(sessionlessUrls, url) {
  return sessionlessUrls.indexOf(url) > -1;
}
