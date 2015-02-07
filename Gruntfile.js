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
          src: 'src/js/justice.js',
          dest: 'tmp/justice.all.js',
          includePath: 'src'
        }],
      }
    },

    uglify: {
      min: {
        files: {
          'build/justice.min.js': ['tmp/justice.css.js', 'tmp/justice.all.js']
        },
      },
      beauty: {
        options: {
          beautify: true,
          mangle: false
        },
        files: {
          'build/justice.js': ['tmp/justice.css.js', 'tmp/justice.all.js']
        }
      }
    },

    shell: {
      options: {
        stderr: true
      },
      logSize: {
        command: 'echo `git rev-parse --short HEAD && date +"%m/%d/%y %T:%S" && stat -c%s build/justice.min.js && echo "bytes"` >> log/size-log.txt'
      }
    },

  });


  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-css2js');
  grunt.loadNpmTasks('grunt-includes');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('build', ['clean', 'sass', 'css2js:main', 'includes:js', 'uglify:min', 'uglify:beauty', 'shell:logSize']);
  grunt.registerTask('default', ['build', 'watch']);
};