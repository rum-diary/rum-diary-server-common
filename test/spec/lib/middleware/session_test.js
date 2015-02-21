/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

var assert = require('chai').assert;
var session = require('../../../../lib/middleware/session');
var RequestMock = require('../../../mocks/request');
var ResponseMock = require('../../../mocks/response');
var sinon = require('sinon');

describe('lib/middleware/session', function () {
  var middleware;
  var req;
  var res;

  var sessionStore = {
    on: function () {
    }
  };

  var config = {
    get: function (name) {
      return {
        ssl: true,
        session_duration_ms: 24 * 60 * 60 * 1000,
        session_cookie_name: 'session',
        session_cookie_secret: 'there be dragons'
      }[name];
    }
  };


  beforeEach(function () {
    middleware = session({
      sessionStore: sessionStore,
      config: config,
      sessionlessUrls: ['/no_session']
    });

    res = new ResponseMock();
  });

  it('adds `req.session` to urls not in `options.sessionlessUrls`', function (done) {
    var req = new RequestMock({
      url: '/has_session',
      session: undefined
    });

    middleware(req, res, function (err) {
      assert.isUndefined(err);
      assert.ok(req.session);
      done();
    });
  });

  it('does not add `req.session` to urls in `options.sessionlessUrls`', function (done) {
    var req = new RequestMock({
      url: '/no_session',
      session: undefined
    });

    middleware(req, res, function (err) {
      assert.isUndefined(err);
      assert.isUndefined(req.session);
      done();
    });
  });

  it('calls the validation function, if available', function (done) {
    var validateSessionCalled = false;

    var req = new RequestMock({
      url: '/should_set_session',
      session: undefined
    });

    middleware = session({
      sessionStore: sessionStore,
      config: config,
      sessionlessUrls: ['/no_session'],
      validateSession: function (req, res, next) {
        assert.ok(req.session);
        validateSessionCalled = true;
        next();
      }
    });

    middleware(req, res, function (err) {
      assert.isUndefined(err);
      assert.ok(req.session);
      assert.isTrue(validateSessionCalled);
      done();
    });
  });
});

