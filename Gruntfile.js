module.exports = function(grunt) {
	grunt.initConfig({
		'gh-pages': {
			your_target: {
				options: {
					// Task-specific options go here.
					message: 'pushing to gh-pages',
					base: 'bin',
					branch: 'gh-pages',
					repo: 'https://github.com/tusharmath/tusharm.com.git'
				},
				src: ['**']
			}
		},

		copy: {
			main: {
				files: [{
					expand: true,
					src: ['index.php'],
					dest: 'bin/'
				}]
			}
		},

		wintersmith_compile: {
			your_target: {
				options: {
					output: 'bin'
				}
			}
		}
	});
	grunt.loadNpmTasks('grunt-wintersmith-compile');
	grunt.loadNpmTasks('grunt-gh-pages');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.registerTask('release', ['copy', 'wintersmith_compile', 'gh-pages']);
};