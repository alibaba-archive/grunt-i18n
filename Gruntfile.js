/*
 * tb.grunt-i18n
 * https://github.com/teambition/grunt-i18n
 *
 * Copyright (c) 2014 Qi Junyuan
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp', 'test/tmp'],
    },

    // Configuration to be run (and then tested).
    tb_grunt_i18n: {
      default_options: {
        options: {
          lang:'en',
          localesPath: 'test/raw/locales'
        },
        expand: true,
        cwd: 'test/raw',
        src: ['**/*'],
        dest: 'test/tmp/',
        localesPath: 'test/raw/locales'
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

    bump: {
      options: {
        files: ['package.json'],
        updateConfigs: [],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['-a'],
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: false,
        pushTo: 'master'
      }
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-bump');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'tb_grunt_i18n', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['test']);

};
