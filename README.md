# tb.grunt-i18n

> An i18n builder to be used under grunt.

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install tb.grunt-i18n --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('tb.grunt-i18n');
```

## The "tb_grunt_i18n" task

### Overview
In your project's Gruntfile, add a section named `tb_grunt_i18n` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  tb_grunt_i18n: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.separator
Type: `String`
Default value: `',  '`

A string value that is used to do something with whatever.

#### options.punctuation
Type: `String`
Default value: `'.'`

A string value that is used to do something else with whatever else.

### Usage Examples

#### Default Options
In this example, the default options are used to do something with whatever. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result would be `Testing, 1 2 3.`

```js
grunt.initConfig({
  tb_grunt_i18n: {
    revision: {
      options: {
        revision: true,
        localesPath: 'src/locales',
        revisionPath: 'src/revision-locales',
        cwd: 'src'
      }
    }
    build: {
      options: {
        localesPath: 'src/locales',
        revisionPath: 'src/revision-locales',
        dest: 'temp',
        cwd: 'src'
      },
      files: [
        {
          src: [
            'src/apps/**/*.{less,html,coffee}',
            'src/components/**/*.{less,html,coffee}',
            'src/lib/**/*.{less,html,coffee}',
            'src/less/*.less'
          ]
        }
      ]
    }
  }
});
```


