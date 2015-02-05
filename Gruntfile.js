module.exports = function(grunt) {

  grunt.initConfig({

    watch: {
      files: ['lib/*', 'lib/scss/*', 'examples/index.html'],
      tasks: ['build'],
      options: {
        livereload: true,
      },
    },

    sass: {
      dist: {
        files: {
          'tmp/justice.css': 'lib/scss/justice.scss'
        }
      }
    },

    css2js: {
      main: {
        src: 'tmp/justice.css',
        dest: 'tmp/justice.css.js'
      }
    },

    uglify: {
      main: {
        files: {
          'build/justice.min.js': ['tmp/justice.css.js', 'lib/justice.js']
        }
      }
    },

  });


  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-css2js');

  grunt.registerTask('build', ['sass', 'css2js:main', 'uglify:main']);
  grunt.registerTask('default', ['build', 'watch']);

};