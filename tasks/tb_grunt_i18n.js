/*
 * tb.grunt-i18n
 * https://github.com/teambition/grunt-i18n
 *
 * Copyright (c) 2014 Qi Junyuan
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  grunt.registerMultiTask('tb_grunt_i18n', 'An i18n builder to be used under grunt.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var options = this.options({
      localesPath: ''
    });

    var localesPath = options.localesPath;
    var localeFiles = {};
    var dest = options.dest;
    var cwd = options.cwd;
    var reg = /\{\{__([\s\S]+?)\}\}/g;

    if (!localesPath || !grunt.file.isDir(localesPath)) {
      grunt.log.warn('"localesPath" path is not valid');
    }
    if (!dest || !grunt.file.isDir(dest)) {
      grunt.log.warn('"dest" path is not valid');
    }
    if (!cwd || !grunt.file.isDir(cwd)) {
      grunt.log.warn('"cwd" path is not valid');
    }

    function extend(obj) {
      for (var key in obj) {
          if (hasOwnProperty.call(obj, key)) {
            this[key] = obj[key];
          }
      }
      return this;
    }

    grunt.file.recurse(localesPath, function(abspath, rootdir, subdir, filename){
      var localeName = filename.split('.');
      if (grunt.file.isFile(abspath) && localeName[1] === 'json') {
        var locale = grunt.file.readJSON(abspath);
        var include = locale['@include'] || [];
        localeName = localeName[0];
        localeFiles[localeName] = localeFiles[localeName] || {};
        extend.call(localeFiles[localeName], locale);
        include.forEach(function (abspath) {
          abspath += '/' + localeName + '.json';
          if (grunt.file.isFile(abspath)) {
            var file = grunt.file.readJSON(abspath);
            extend.call(localeFiles[localeName], file);
          }
        });
        grunt.file.mkdir(dest + '/' + localeName);
      }
    });

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      var files = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (grunt.file.isDir(filepath)) return false;
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      });

      if (!files.length) return;
      files.map(function(filepath) {
        for (var localeName in localeFiles) {
          var targetFilepath = filepath.replace(cwd, dest + '/' + localeName);
          var originalContent = grunt.file.read(filepath);
          originalContent = originalContent.replace(reg, function (m, grep) {
            return localeFiles[localeName][grep] || grep;
          });
          grunt.file.write(targetFilepath, originalContent);
          // grunt.log.writeln('File "' + targetFilepath + '" created.');
        }
      });

    });
  });

};
