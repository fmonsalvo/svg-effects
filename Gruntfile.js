module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ['Gruntfile.js', 'src/js/*.js']
    },
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
    csslint: {
      src: 'src/css/*.css'
    },
    cssmin: {
      compress: {
        files: {
          'build/effects.css': 'src/css/*.css'
        }
      }
    },
    clean: ["sourcemap", "build"]
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Default task(s).
  grunt.registerTask('build', ['clean', 'jshint', 'csslint', 'uglify', 'cssmin']);

};
