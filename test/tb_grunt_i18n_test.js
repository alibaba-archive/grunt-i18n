'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.tb_grunt_i18n = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  default_options: function(test) {
    test.expect(3);

    var actual_en = grunt.file.read('test/tmp/i18n/en/test.js');
    var actual_zh = grunt.file.read('test/tmp/i18n/zh/test.js');
    var actual_default = grunt.file.read('test/tmp//test.js');

    var expected_en = grunt.file.read('test/expected/i18n/en/test.js');
    var expected_zh = grunt.file.read('test/expected/i18n/zh/test.js');
    var expected_default = grunt.file.read('test/expected/test.js');

    test.equal(actual_en, expected_en, 'should describe what the default behavior is.');
    test.equal(actual_zh, expected_zh, 'should describe what the default behavior is.');
    test.equal(actual_default, expected_default, 'should describe what the default behavior is.');

    test.done();
  }
};
