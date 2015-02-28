/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

var Triage = require('triage');
var Router = require('express').Router;

module.exports = function (config) {
  var router = new Router();
  var triage = new Triage();

  triage.init({
    cwd: config.cwd,
    route_config: config.route_config,
    router: router
  });

  return router;
};
