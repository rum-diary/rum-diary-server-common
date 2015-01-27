/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

module.exports = function (grunt) {
  'use strict';

  grunt.config('jshint', {
    app: {
      options: {
        jshintrc: '.jshintrc'
      },
      src: [
        '**/*.js',
        '!test/**',
        '!node_modules/**'
      ]
    },
    test: {
      options: {
        /* The test .jshintrc allows mocha global variables */
        jshintrc: 'test/.jshintrc'
      },
      src: [
        'test/**/*.js'
      ]
    }
  });
};
