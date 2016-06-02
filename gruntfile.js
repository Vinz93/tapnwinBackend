module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  var path = require('path');

  var games = {
    design: 'design',
    voice: 'voice',
    match3: 'match3',
    owner: 'owner',
  };

  var paths = {
    src: {
      main: 'index.js',
      all: ['server/**/*.js', 'config/**/*.js'],
      no: ['server/**/*', 'config/**/*', '!server/**/*.js', '!config/**/*.js']
    },
    dist: 'dist/',
  };

  grunt.initConfig({
    clean: {
      dist: {
        src: paths.dist
      }
    },
    copy: {
      srcno: {
        files: [{
          expand: true,
          src: paths.src.no,
          dest: paths.dist
        }],
      },
    },
    mkdir: {
      dist: {
        options: {
          create: [games.design, games.voice, games.match3, games.owner].map(function(str) {
            return path.join(paths.dist, 'uploads', str);
          })
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
          src: [paths.src.main, paths.src.all],
          dest: paths.dist,
          ext: '.js',
        }],
      },
    },
    watch: {
      src: {
        files: [paths.src.main, paths.src.all],
        tasks: ['changed:babel'],
        options: {
          spawn: false,
        },
      },
      srcno: {
        files: paths.src.no,
        tasks: ['changed:copy'],
        options: {
          spawn: false,
        },
      },
    },
    nodemon: {
      dist: {
        script: paths.src.main,
        options: {
          cwd: paths.dist
        },
      },
    },
    concurrent: {
      all: {
        tasks: ['nodemon', 'watch:src', 'watch:srcno'],
        options: {
          logConcurrentOutput: true,
          limit: 3
        },
      },
    }
  });

  grunt.registerTask('build', ['clean', 'changed:babel', 'changed:copy', 'mkdir']);
  grunt.registerTask('serve', ['concurrent']);
  grunt.registerTask('default', 'serve');
};
