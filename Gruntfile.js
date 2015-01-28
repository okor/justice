module.exports = function(grunt) {

  grunt.initConfig({

    watch: {
      files: ['lib/*', 'lib/scss/*', 'examples/index.html'],
      tasks: ['uglify:ng', 'sass'],
      options: {
        livereload: true,
      },
    },

    uglify: {
      ng: {
        files: {
          'build/ninjaguru.min.js': ['lib/ninjaguru.js']
        }
      }
    },

    sass: {
      dist: {
        files: {
          'build/ninjaguru.css': 'lib/scss/ninjaguru.scss'
        }
      }
    },

  });


  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');

  grunt.registerTask('default', ['uglify:ng', 'sass', 'watch']);

};