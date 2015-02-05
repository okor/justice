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
          'tmp/HUD.css': 'lib/scss/HUD.scss'
        }
      }
    },

    css2js: {
      main: {
        src: 'tmp/HUD.css',
        dest: 'tmp/HUD.css.js'
      }
    },

    uglify: {
      main: {
        files: {
          'build/HUD.min.js': ['tmp/HUD.css.js', 'lib/HUD.js']
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