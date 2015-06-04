/**
 * Gruntfile for freedom-pgp-e2e
 *
 * This repository uses JavaScript crypto code from
 * Google's end-to-end project to provide a pgp-like
 * freedom crypto API. Note that (for now) the build
 * process is a bit unorthodox (clones e2e repo from
 * Google Code - see README.md).
 **/

module.exports = function(grunt) {
  grunt.initConfig({
    copy: {
      build: {
        src: ['src/*.js*'],
        dest: 'build/',
        flatten: true,
        filter: 'isFile',
        expand: true
      },
      freedom: {
        src: [require.resolve('freedom')],
        dest: 'build/',
        flatten: true,
        filter: 'isFile',
        expand: true
      },
      demo: {
        src: ['src/demo/*'],
        dest: 'build/demo/',
        flatten: true,
        filter: 'isFile',
        expand: true
      },
      playground: {
        src: ['src/playground/*'],
        dest: 'build/playground/',
        flatten: true,
        filter: 'isFile',
        expand: true
      },
      e2eCompiledJavaScript: {
        files: [ {
          src: [require.resolve('e2e')],
          dest: 'build/end-to-end.compiled.js',
          onlyIf: 'modified'
        } ]
      },
      dist: {
        src: ['build/*'],
        dest: 'dist/',
        flatten: true,
        filter: 'isFile',
        expand: true
      }
    },

    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      browsers: {
        singleRun: true,
        autoWatch: false
      },
      watch: {
        singleRun: false,
        autoWatch: true,
        reporters: ['progress', 'story'],
        preprocessors: {},
        coverageReporter: {}
      },
      phantom: {
        browsers: ['PhantomJS'],
        singleRun: true,
        autoWatch: false
      }
    },

    jasmine_chromeapp: {
      src: ['node_modules/freedom-for-chrome/freedom-for-chrome.*',
            'spec/integration/pgpapi.spec.js', 'build/*.js*', 'build/demo/*'],
      options: {
        paths: ['node_modules/freedom-for-chrome/freedom-for-chrome.js',
                'spec/integration/pgpapi.spec.js'],
        keepRunner: false
      }
    },

    jasmine_node: {
      integration: ['spec/integration/']
    },

    jshint: {
      all: ['src/**/*.js', 'spec/**/*.js'],
      options: {
        jshintrc: true
      }
    },

    connect: {
      demo: {
        options: {
          port: 8000,
          keepalive: true,
          base: ['./', 'build/'],
          open: 'http://localhost:8000/build/demo/main.html'
        }
      }
    },

    bump: {
      options: {
        files: ['package.json'],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['package.json'],
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: true,
        pushTo: 'origin'
      }
    },

    'npm-publish': {
      options: {
        // list of tasks that are required before publishing
        requires: [],
        // if the workspace is dirty, abort publishing (to avoid publishing local changes)
        abortIfDirty: true
      }
    },

    prompt: {
      tagMessage: {
        options: {
          questions: [
            {
              config: 'bump.options.tagMessage',
              type: 'input',
              message: 'Enter a git tag message:',
              default: 'v%VERSION%'
            }
          ]
        }
      }
    },

    clean: ['build/', '.build/', 'dist/']
  });

  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jasmine-chromeapp');
  grunt.loadNpmTasks('grunt-jasmine-node2');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-npm');
  grunt.loadNpmTasks('grunt-prompt');

  grunt.registerTask('build', [
    'jshint',
    'copy'
  ]);
  grunt.registerTask('test', [
    'build',
    'karma:browsers',
    'karma:phantom',
    'jasmine_node',
    'jasmine_chromeapp'
  ]);
  grunt.registerTask('ci', [
    'build',
    'jasmine_node'
  ]);
  grunt.registerTask('release', function (arg) {
    if (arguments.length === 0) {
      arg = 'patch';
    }
    grunt.task.run([
      'prompt:tagMessage',
      'bump:' + arg,
      'npm-publish'
    ]);
  });
  grunt.registerTask('demo', [
    'build',
    'connect'
  ]);
  grunt.registerTask('default', [
    'build',
    'karma:phantom'
  ]);

}
