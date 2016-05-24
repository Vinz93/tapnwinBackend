module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  var paths = {
    src: {
      main: 'index.js',
      all: ['server/**/*.js', 'config/**/*.js'],
      no: ['package.json', 'server/**/*', 'config/**/*', '!server/**/*.js', '!config/**/*.js']
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
      srcno: {
        files: paths.src.no,
        tasks: ['copy'],
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
        tasks: ['nodemon', 'watch:src', 'watch:srcno'],
        options: {
          logConcurrentOutput: true,
          limit: 3
        },
      },
    },
  });

  grunt.event.on('watch', function(action, filepath) {
    grunt.config('babel.src.files.0.src', filepath);
  });

  /*
  grunt.event.on(['watch', 'nosrc'], function(action, filepath) {
    console.log(action);
    grunt.config('copy.srcno.files.0.src', filepath);
  });
  */
  
  grunt.registerTask('build', ['clean', 'babel', 'copy']);
  grunt.registerTask('serve', ['concurrent']);
  grunt.registerTask('default', 'serve');
};
