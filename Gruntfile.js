module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		less: {
			// Options
			options: {
				banner: "/*!\n" +
						"Theme Name: <%= pkg.name %>\n" +
						"Author: <%= pkg.author %>\n" +
						"Description: <%= pkg.description %>\n" +
						"Version: <%= pkg.version %>\n" +
						"*/\n",
				compress: true
			},

			// Tasks
			main: {
				files: {
					"css/styles.css": "less/styles.less"
				}
			},

			// demo tasks
			red: {
				options: {
					modifyVars: {
						"brand-primary": "#ea5859"
					}
				},
				files: {
					"demo/red.css": "less/styles.less"
				}
			},
			lightBlue: {
				options: {
					modifyVars: {
						"brand-primary": "#58aaea"
					}
				},
				files: {
					"demo/light-blue.css": "less/styles.less"
				}
			},
			green: {
				options: {
					modifyVars: {
						"brand-primary": "#7dba55"
					}
				},
				files: {
					"demo/green.css": "less/styles.less"
				}
			},
			turqoise: {
				options: {
					modifyVars: {
						"brand-primary": "#2ab877"
					}
				},
				files: {
					"demo/turqoise.css": "less/styles.less"
				}
			},
			purple: {
				options: {
					modifyVars: {
						"brand-primary": "#ba2ebf"
					}
				},
				files: {
					"demo/purple.css": "less/styles.less"
				}
			},
			yellow: {
				options: {
					modifyVars: {
						"brand-primary": "#f1c40f"
					}
				},
				files: {
					"demo/yellow.css": "less/styles.less"
				}
			},
			orange: {
				options: {
					modifyVars: {
						"brand-primary": "#f39c12"
					}
				},
				files: {
					"demo/orange.css": "less/styles.less"
				}
			}
		},
		watch: {
			less: {
				files: ['less/**/*.less'],
				tasks: ['less']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('demo', ['less:red', 'less:lightBlue', 'less:green', 'less:turqoise', 'less:purple', 'less:yellow', 'less:orange']);
};