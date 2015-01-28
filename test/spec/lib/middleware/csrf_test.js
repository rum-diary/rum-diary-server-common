/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

var assert = require('chai').assert;
var csrf = require('../../../../lib/middleware/csrf');
var RequestMock = require('../../../mocks/request');
var ResponseMock = require('../../../mocks/response');

describe('lib/middleware/csrf', function () {
  var middleware;
  var req;
  var res;

  beforeEach(function () {
    middleware = csrf({
      noCsrfUrls: [ '/no_csrf' ]
    });

    res = new ResponseMock();
  });

  it('does not blow up on GET requests w/o CSRF token', function (done) {
    req = new RequestMock({
      url: '/any_url',
      method: 'GET'
    });

    middleware(req, res, function (err) {
      assert.isUndefined(err);
      done();
    });
  });

  it('adds `csrftoken` to res.locals for GET requests', function (done) {
    req = new RequestMock({
      url: '/any_url',
      method: 'GET'
    });

    middleware(req, res, function () {
      assert.isTrue('csrftoken' in res.locals);
      done();
    });
  });

  it('does not add `csrftoken` to res.locals for url in `noCsrfUrls`', function (done) {
    req = new RequestMock({
      url: '/no_csrf',
      method: 'GET'
    });

    middleware(req, res, function () {
      assert.isFalse('csrftoken' in res.locals);
      done();
    });
  });

  it('blows up on POST requests w/o CSRF token', function () {
    req = new RequestMock({
      url: '/missing_csrf',
      method: 'POST'
    });

    assert.throws(function () {
      middleware(req, res, assert.fail);
    });
  });

  it('does not blow up on POST requests w/ CSRF token', function (done) {
    var getReq = new RequestMock({
      url: '/gets_csrf',
      method: 'GET'
    });

    middleware(getReq, res, function () {
      var postReq = new RequestMock({
        url: '/sends_csrf',
        method: 'POST',
        session: getReq.session,
        body: {
          _csrf: res.locals.csrftoken
        }
      });

      middleware(postReq, res, function (err) {
        assert.isUndefined(err);
        done();
      });
    });
  });

  it('does not blow up on POST requests w/o CSRF token if whitelisted', function (done) {
    req = new RequestMock({
      url: '/no_csrf',
      method: 'POST'
    });

    middleware(req, res, function () {
      assert.isFalse('csrftoken' in res.locals);
      done();
    });
  });
});

