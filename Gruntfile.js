module.exports = function(grunt) {

  grunt.initConfig({

    watch: {
      files: ['src/**', 'examples/**'],
      tasks: ['build'],
      options: {
        livereload: true,
      },
    },

    clean: ['tmp', 'build'],

    sass: {
      dist: {
        files: {
          'tmp/justice.css': 'src/scss/justice.scss'
        }
      }
    },

    css2js: {
      main: {
        src: 'tmp/justice.css',
        dest: 'tmp/justice.css.js'
      }
    },

    includes: {
      js: {
        options: {
          duplicates: false,
          debug: true,
          silent: false
        },
        files: [{
          src: 'src/justice.js',
          dest: 'tmp/justice.all.js',
          includePath: 'src'
        }],
      }
    },

    uglify: {
      main: {
        files: {
          'build/justice.min.js': ['tmp/justice.css.js', 'tmp/justice.all.js']
        }
      }
    },

    size: {
      app: ['build/**']
    },

  });


  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-css2js');
  grunt.loadNpmTasks('grunt-includes');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-plugin-size');

  grunt.registerTask('build', ['clean', 'sass', 'css2js:main', 'includes:js', 'uglify:main', 'size']);
  grunt.registerTask('default', ['build', 'watch']);
};