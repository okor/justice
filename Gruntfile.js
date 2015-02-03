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
          'build/HUD.min.js': ['lib/HUD.css.js', 'lib/HUD.js']
        }
      }
    },

    sass: {
      dist: {
        files: {
          'build/HUD.css': 'lib/scss/HUD.scss'
        }
      }
    },

    css2js: {
      main: {
        src: 'build/HUD.css',
        dest: 'lib/HUD.css.js'
      }
    }

  });


  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-css2js');

  grunt.registerTask('default', ['sass', 'css2js:main', 'uglify:main', 'watch']);

};