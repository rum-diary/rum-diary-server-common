/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Test the routes by making http requests.
 */

'use strict';

var assert = require('chai').assert;
var request = require('request');

var config = require('../../server/lib/config');
var baseURL = 'http://localhost:' + config.get('http_port');

var startStop = require('../lib/start-stop');

function testCommonResponseHeaders(response) {
  // Remove the x-powered-by
  assert.isUndefined(response.headers['x-powered-by']);
}

describe('routes module', function () {
  describe('start', function () {
    it('starts the server', function (done) {
      startStop.start(done);
    });
  });


  describe('POST /metrics', function () {
    it('should have CORS `access-control-allow-origin: *` header', function (done) {
      request.post(baseURL + '/metrics', {
        data: {
          hostname: 'unknown.com',
          uuid: 'fake uuid'
        }
      }, function (err, response) {
        assert.equal(response.statusCode, 200, baseURL);

        // CORS is allowed for POST /metrics
        assert.equal(response.headers['access-control-allow-origin'], '*');

        testCommonResponseHeaders(response);

        done();
      });
    });
  });

  describe('stop', function () {
    it('stops', function (done) {
      startStop.stop(function () {
        done();
      });
    });
  });
});

