/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

module.exports = function (config, prefix) {
  'use strict';

  var adaptedConfig = {
    get: function (name) {
      try {
        return config.get(prefix + '.' + name);
      } catch(e) {
        // ignore the error. convict blows up if the item does not exist.
      }
    },
    set: function (name, value) {
      return config.set(prefix + '.' + name, value);
    }
  };

  return adaptedConfig;
};
