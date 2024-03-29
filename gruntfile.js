module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  var path = require('path');

  var paths = {
    pkg: 'package.json',
    src: {
      main: 'index.js',
      js: [
        'server/controllers/**/*.js',
        'server/models/**/*.js',
        'server/routes/**/*.js',
        'server/helpers/**/*.js',
        'config/**/*.js'
      ],
      views: 'server/views/**/*',
    },
    seeds: 'config/seeds/**/*.json',
    dist: 'dist/',
  };

  grunt.initConfig({
    clean: {
      dist: {
        src: paths.dist
      }
    },
    copy: {
      statics: {
        files: [{
          expand: true,
          src: [
            paths.seeds,
            paths.src.views,
          ],
          dest: paths.dist
        }],
      },
      pkg: {
        files: [{
          src: paths.pkg,
          dest: paths.dist
        }],
      },
    },
    mkdir: {
      dist: {
        options: {
          create: [path.join(paths.dist, 'uploads')]
        },
      },
    },
    babel: {
      options: {
        sourceMap: true,
        presets: ['es2015'],
      },
      src: {
        files: [{
          expand: true,
          src: [
            paths.src.main,
            paths.src.js
          ],
          dest: paths.dist,
          ext: '.js',
        }],
      },
    },
    watch: {
      src: {
        files: [
          paths.src.main,
          paths.src.js
        ],
        tasks: ['changed:babel'],
        options: {
          spawn: false,
        },
      },
      statics: {
        files: [
          paths.seeds,
          paths.src.views,
        ],
        tasks: ['changed:copy:statics'],
        options: {
          spawn: false,
        },
      },
    },
    nodemon: {
      dist: {
        script: paths.src.main,
        options: {
          cwd: paths.dist,
          nodeArgs: ['--harmony_proxies'],
        },
      },
    },
    concurrent: {
      js: {
        tasks: [
          'nodemon',
          'watch:src',
          'watch:statics'
        ],
        options: {
          logConcurrentOutput: true,
          limit: 3
        },
      },
    }
  });

  grunt.registerTask('build', [
    'clean',
    'changed:babel',
    'changed:copy:statics',
    'mkdir',
    'copy:pkg',
  ]);

  grunt.registerTask('serve', [
    'clean',
    'changed:babel',
    'changed:copy:statics',
    'mkdir',
    'concurrent',
  ]);

  grunt.registerTask('default', 'serve');
};
