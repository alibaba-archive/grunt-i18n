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
    var options = this.options({
      localesPath: '',
      defaultLanguage: 'en'
    });

    var localesPath = this.data.localesPath;
    var localeFiles = [];
    var dest = this.data.dest;
    var cwd = this.data.cwd;
    var defaultLanguage = options.defaultLanguage;

    if (!localesPath || !grunt.file.isDir(localesPath)) {
      grunt.log.warn('Locales path is not valid');
    }

    grunt.file.recurse(localesPath, function(abspath, rootdir, subdir, filename){
      var localeName = filename.split('.')[0];
      if (grunt.file.exists(abspath)) {
        var localeFile = {
          name: localeName,
          file: grunt.file.readJSON(abspath)
        };
        localeFiles.push(localeFile);
        grunt.file.mkdir(dest + 'i18n');
      }
    });

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      var files = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (grunt.file.isDir(filepath)) {
          return false;
        }

        if (grunt.file.isMatch(localesPath + '**/*', filepath)) {
          return false;
        }

        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      });

      if (files.length > 0) {
        files.map(function(filepath) {
          for (var i = 0; i < localeFiles.length; i++) {
            var localeName = localeFiles[i].name;
            var targetFilepath = filepath.replace(cwd, dest + 'i18n/' + localeName);
            var originalContent = grunt.file.read(filepath);
            var tag, value, regex;
            originalContent = originalContent.replace(/\{\{__([\s\S]+?)\}\}/g, function(m, grep) {
              return localeFiles[i].file[grep] ? localeFiles[i].file[grep] : ''
            })
            if (localeName === defaultLanguage) {
              grunt.file.write(f.dest, originalContent);
              grunt.log.writeln('File "' + f.dest + '" created.');
            }
            grunt.file.write(targetFilepath, originalContent);
            grunt.log.writeln('File "' + targetFilepath + '" created.');
          }
        });
      }

    });
  });

};
