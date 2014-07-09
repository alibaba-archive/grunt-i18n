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
    var options = this.options();

    var localesPath = options.localesPath;
    var revisionPath = options.revisionPath;
    var revision = revisionPath && options.revision;
    var defaultLocale = options.defaultLocale || 'en';
    var localeFiles = {};
    var localeKeys = {};
    var dest = options.dest;
    var cwd = options.cwd;
    var reg = /\{\{__([\s\S]+?)\}\}/g;

    if (!localesPath || !grunt.file.isDir(localesPath)) {
      grunt.log.warn('"localesPath" path is not valid');
    }
    if (!cwd || !grunt.file.isDir(cwd)) {
      grunt.log.warn('"cwd" path is not valid');
    }

    function each(obj, fn) {
      for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) fn(obj[key], key, obj);
      }
    }

    function extend(a, b, conflictFn) {
      each(b, function (value, key) {
        if (a[key] == null) a[key] = value;
        else if (conflictFn) conflictFn(a[key], key);
      });
    }

    function writeJSON(path, obj, order) {
      var _obj = {}, sort = Object.keys(obj);
      sort.sort().forEach(function (key) {
        _obj[key] = obj[key];
      });
      grunt.file.write(path, JSON.stringify(order? _obj : obj, null, '  '));
    }

    var defaultLocales = localeFiles[defaultLocale] = {};

    if (revisionPath) {
      grunt.file.recurse(revisionPath, function(abspath, rootdir, subdir, filename){
        var localeName = filename.split('.');
        if (grunt.file.isFile(abspath) && localeName[1] === 'json') {
          var locale = grunt.file.readJSON(abspath);
          localeName = localeName[0];
          if (localeFiles[localeName] == null) localeFiles[localeName] = {};
          extend(localeFiles[localeName], locale);
        }
      });
    }

    grunt.file.recurse(localesPath, function(abspath, rootdir, subdir, filename){
      var localeName = filename.split('.');
      if (grunt.file.isFile(abspath) && localeName[1] === 'json') {
        var changed = false;
        var locale = grunt.file.readJSON(abspath);
        var include = locale['@include'] || [];
        localeName = localeName[0];
        if (localeFiles[localeName] == null) localeFiles[localeName] = {};

        extend(localeKeys, locale);
        extend(localeFiles[localeName], locale, function (value, key) {
          if (locale[key] === value) return;
          changed = true;
          locale[key] = value;
        });

        if (revision && changed) {
          writeJSON(abspath, locale);
          grunt.log.writeln('A revision file "' + abspath + '" created.');
        }

        include.forEach(function (abspath) {
          abspath += '/' + localeName + '.json';
          if (!grunt.file.isFile(abspath)) return;
          var changed = false;
          var file = grunt.file.readJSON(abspath);
          extend(localeKeys, file);
          extend(localeFiles[localeName], file, function (value, key) {
            if (file[key] === value) return;
            changed = true;
            file[key] = value;
          });
          if (revision && changed) {
            writeJSON(abspath, file);
            grunt.log.writeln('A revision file "' + abspath + '" created.');
          }
        });

        delete localeFiles[localeName]['@include'];
      }
    });

    delete localeKeys['@include'];

    each(localeFiles, function (locale) {
      each(locale, function (value, key) {
        if (localeKeys[key] == null) delete locale[key];
      });
      each(localeKeys, function (value, key) {
        if (locale[key] == null) locale[key] = '';
      });
    });

    if (revision) {
      each(localeFiles, function (locale, key) {
        var targetFilepath = revisionPath+ '/' + key + '.json';
        writeJSON(targetFilepath, locale, true);
        grunt.log.writeln('File "' + targetFilepath + '" created.');
      });
      return;
    }

    each(localeFiles, function (locale, key) {
      writeJSON(dest + '/locales/' + key + '.json', locale, true);
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
        each(localeFiles, function (locale, localeName) {
          var targetFilepath = filepath.replace(cwd, dest + '/' + localeName);
          var originalContent = grunt.file.read(filepath);
          originalContent = originalContent.replace(reg, function (m, grep) {
            if (!localeFiles[localeName][grep]) grunt.log.warn('"' + grep + '" not found in ' + filepath);
            return localeFiles[localeName][grep] || grep;
          });
          grunt.file.write(targetFilepath, originalContent);
          grunt.log.writeln('File "' + targetFilepath + '" created.');
        });
      });

    });
  });

};
