module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  var paths = {
    src: {
      main: 'index.js',
      all: ['server/**/*.js', 'config/**/*.js']
    },
    dist: 'dist/',
  };

  grunt.initConfig({
    clean: {
      dist: {
        src: paths.dist
      }
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
        tasks: ['babel'],
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
          ignore: ['node_modules/**/*.js'],
        },
      },
    },
    concurrent: {
      all: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true,
        },
      },
    },
  });

  grunt.event.on('watch', function(action, filepath) {
    grunt.config('babel.src.files.0.src', filepath);
  });

  grunt.registerTask('default', ['concurrent']);
  grunt.registerTask('build', ['clean', 'babel']);
};
