TaskManager = require('uproxy-lib/tools/taskmanager');
Rule = require('uproxy-lib/tools/common-grunt-rules');

module.exports = (grunt) ->

  grunt.initConfig {
    symlink: {
      typescriptSrc: {
        files: [ {
          expand: true,
          overwrite: true,
          cwd: 'src',
          src: ['*'],
          dest: 'build/typescript-src/'
        } ]
      },

      uproxyLibTypescriptSrc: {
        files: [ {
          expand: true,
          overwrite: true,
          cwd: 'node_modules/uproxy-lib/src/',
          src: ['*'],
          dest: 'build/typescript-src/'
        } ]
      },

      uproxyLibThirdPartyTypescriptSrc: {
        overwrite: true,
        src: 'node_modules/uproxy-lib/third_party/',
        dest: 'build/typescript-src/third_party/'
      },

      thirdPartyTypeScript: {
        files: [
          # Copy any typescript from the third_party directory
          {
            expand: true,
            overwrite: true,
            cwd: 'third_party',
            src: ['*']
            dest: 'build/typescript-src/'
          },
          # freedom-typescript-api interfaces.
          {
            expand: true,
            overwrite: true,
            cwd: 'node_modules/freedom-typescript-api/interfaces'
            src: ['*']
            dest: 'build/typescript-src/freedom-typescript-api/'
          }
        ]}
    },

    copy: {
      uproxyLib: {
        files: [ {
          expand: true, cwd: 'node_modules/uproxy-lib/build',
          src: ['**', '!**/typescript-src/**'],
          dest: 'build',
          onlyIf: 'modified',
        } ]
      },

      es6Promise: { files: [ {
          expand: true, cwd: 'node_modules/es6-promise/dist/'
          src: ['**']
          dest: 'build/third_party/typings/es6-promise/' 
          onlyIf: 'modified'
        } ] },

      # Copy any JavaScript from the third_party directory
      e2eCompiledJavaScript: { files: [ {
          src: ['end-to-end.build/build/library/end-to-end.compiled.js']
          dest: 'build/end-to-end/end-to-end.compiled.js'
          onlyIf: 'modified'
        } ] },

      sampleChromeAppLib: {
        files: [
          {  # Copy all modules in the build directory to the chromeApp
            expand: true,
            cwd: 'build'
            src: [
              'arraybuffers/**',
              'end-to-end/**',
              'logger/**'
            ]
            dest: 'build/samples/chrome-app'
            onlyIf: 'modified'
          }
        ]
      },

      sampleChromeAppFreedom: {
        expand: true,
        cwd: 'node_modules/uproxy-lib/build/freedom/',
        src: ['freedom-for-chrome-for-uproxy.js*'],
        dest: 'build/samples/chrome-app/'
      },

      endToEnd: Rule.copyModule('end-to-end')
      sampleChromeApp: Rule.copyModule('samples/chrome-app')
    }  # copy

    #-------------------------------------------------------------------------
    # All typescript compiles to locations in `build/`
    typescript: {
      # From build-tools
      arraybuffers: Rule.typescriptSrc('arraybuffers')
      # Modules
      endToEnd: Rule.typescriptSrc('end-to-end')
      sampleChromeApp: Rule.typescriptSrc('samples/chrome-app')
    } # typescript

    clean: ['build/**']
  }  # grunt.initConfig

  #-------------------------------------------------------------------------
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-typescript'
  grunt.loadNpmTasks 'grunt-env'
  grunt.loadNpmTasks 'grunt-contrib-symlink'

  #-------------------------------------------------------------------------
  # Define the tasks
  taskManager = new TaskManager.Manager();

  taskManager.add 'base', [
    'copy:uproxyLib',
    'symlink:typescriptSrc',
    'symlink:uproxyLibTypescriptSrc',
    'symlink:thirdPartyTypeScript',
    'symlink:uproxyLibThirdPartyTypescriptSrc',

    'copy:e2eCompiledJavaScript'
    'copy:es6Promise'

    # Copy all source modules non-ts files
    'copy:endToEnd'

  ]

  taskManager.add 'endToEnd', [
    'base'
    'typescript:endToEnd'
    'typescript:sampleChromeApp'
    'copy:sampleChromeApp'
    'copy:sampleChromeAppLib'
    'copy:sampleChromeAppFreedom'
  ]

  #-------------------------------------------------------------------------
  taskManager.add 'build', [
    'endToEnd'
  ]

  taskManager.add 'test', [
    'build'
  ]

  taskManager.add 'default', [
    'build'
  ]

  #-------------------------------------------------------------------------
  # Register the tasks
  taskManager.list().forEach((taskName) =>
    grunt.registerTask taskName, (taskManager.get taskName)
  );

module.exports.Rule = Rule;

