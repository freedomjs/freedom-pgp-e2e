/**
 * Gruntfile for freeom-pgp-e2e
 *
 * This repository uses JavaScript crypto code from
 * Google's end-to-end project to provide a pgp-like
 * freedom crypto API. Note that (for now) the build
 * process is a bit unorthodox (clones e2e repo from
 * Google Code - see README.md).
 **/

module.exports = function(grunt) {
  grunt.initConfig({
    gitclone: {
      e2e: {
        options: {
          repository: 'https://code.google.com/p/end-to-end.build/'
        }
      }
    },

    gitpull: {
      e2e: {
        options: {
          cwd: 'end-to-end.build/'
        }
      }
    },

    // These shell commands execute/depend on do.sh in the e2e repo
    // Dependencies: unzip, svn, Python 2.X, Java >= 1.7
    shell: {
      doDeps: {
        command: 'bash ./end-to-end.build/do.sh install_deps'
      },
      doLib: {
        command: 'bash ./end-to-end.build/do.sh build_library'
      }
    },

    copy: {
      dist: {
        src: ['src/*.js*'],
        dest: 'build/',
        flatten: true,
        filter: 'isFile',
        expand: true
      },
      freedom: {
        src: ['node_modules/freedom/freedom.js*'],
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
      e2eCompiledJavaScript: {
        files: [ {
          src: ['end-to-end.build/build/library/end-to-end.compiled.js'],
          dest: 'build/end-to-end.compiled.js',
          onlyIf: 'modified'
        } ]
      }
    },

    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      single: {
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

    jshint: {
      all: ['src/*.js', 'src/demo/*.js'],
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

    clean: ['build/', 'end-to-end.build/']
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-symlink');
  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-force');
  grunt.loadNpmTasks('grunt-git');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('base', [
    'copy:e2eCompiledJavaScript',
    'copy:freedom',
    'copy:dist',
    'copy:demo'
  ]);
  grunt.registerTask('getEndToEnd', [
    'force:on',  // clone will fail if already exists, want to continue anyway
    'gitclone:e2e',
    'force:off',
    'gitpull:e2e',
    'shell:doDeps',
    'shell:doLib'
  ]);
  grunt.registerTask('buildEndToEnd', [
    'base'
  ]);
  grunt.registerTask('build', [
    'getEndToEnd',
    'buildEndToEnd'
  ]);
  grunt.registerTask('test', [
    'build',
    'karma'
  ]);
  grunt.registerTask('full', [
    'jshint',
    'build',
    'karma:phantom',
    'connect'
  ]);
  grunt.registerTask('default', [
    'jshint',
    'base',
    'karma:phantom',
    'connect'
  ]);

}
