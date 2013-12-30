module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    //js linting
    jshint: {
      all: ['Gruntfile.js', 'src/js/*.js'],
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: false,
        eqnull: true,
        browser: true,
        nomen: false
      },
      globals: {
        console: true,
        require: true,
        define: true,
        $: true
      }
    },
    // JS Minification
    uglify: {
      compress: {
        options: {
          sourceMap: 'sourcemap/<%= pkg.name %>-map.js'
        },
        files: {
          'build/<%= pkg.name %>.min.js': 'src/js/<%= pkg.name %>.js'
        }
      }
    },
    //CSS Linting
    csslint: {
      src: 'src/css/*.css'
    },
    // CSS Minification
    cssmin: {
      compress: {
        files: {
          'build/effects.css': 'src/css/*.css'
        }
      }
    },
    // jasmine testsuites
    jasmine: {
      files: ['js/tests/SpecRunner.html']
    },
    // clean build directory
    clean: ["sourcemap", "build"]
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  // Default task(s).
  grunt.registerTask('build', ['clean', 'jshint', 'csslint', 'jasmine', 'uglify', 'cssmin']);

};
