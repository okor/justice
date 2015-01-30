module.exports = function(grunt) {

  grunt.initConfig({

    watch: {
      files: ['lib/*', 'lib/scss/*', 'examples/index.html'],
      tasks: ['sass', 'css2js:main', 'uglify:main'],
      options: {
        livereload: true,
      },
    },

    uglify: {
      main: {
        files: {
          'build/ninjaguru.min.js': ['lib/ninjaguru.css.js', 'lib/ninjaguru.js']
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

    css2js: {
      main: {
        src: 'build/ninjaguru.css',
        dest: 'lib/ninjaguru.css.js'
      }
    }

  });


  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-css2js');

  grunt.registerTask('default', ['sass', 'css2js:main', 'uglify:main', 'watch']);

};