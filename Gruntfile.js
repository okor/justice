module.exports = function(grunt) {

  grunt.initConfig({

    watch: {
      files: ['lib/ninjaguru.js', 'examples/index.html'],
      tasks: ['uglify:ng'],
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
    }

  });


  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['uglify:ng', 'watch']);

};