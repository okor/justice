const sass = require('node-sass');

module.exports = function(grunt) {

  grunt.initConfig({

    watch: {
      files: ['src/js/*.js', 'src/scss/*.scss', 'examples/**'],
      tasks: ['build'],
      options: {
        livereload: true,
      },
    },

    clean: ['tmp', 'build'],

    sass: {
      dist: {
        options: {
          implementation: sass,
          outputStyle: 'compressed'
        },
        files: {
          'tmp/justice.css': 'src/scss/justice.scss'
        }
      }
    },

    autoprefixer: {
      dist: {
        files: {
          'tmp/justice.css': 'tmp/justice.css'
        },
      },
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
        options: {
          mangle: true
        },
        files: {
          'build/justice.min.js': ['tmp/justice.css.js', 'tmp/justice.all.js']
        },
      },
     minMapped: {
        options: {
          mangle: true,
          sourceMap: true,
        },
        files: {
          'build/justice.mapped.min.js': ['tmp/justice.css.js', 'tmp/justice.all.js']
        },
      },
      beauty: {
        options: {
          beautify: {
            beautify: true,
            indent_level: 2
          },
          mangle: false,
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
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-css2js');
  grunt.loadNpmTasks('grunt-includes');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('build', ['clean', 'sass', 'autoprefixer', 'css2js:main', 'includes:js', 'uglify:min', 'uglify:minMapped', 'shell:logSize']);
  grunt.registerTask('default', ['build', 'watch']);
};