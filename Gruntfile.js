// Generated on 2014-05-06 using generator-angular-component 0.2.3
'use strict';

module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-bower-install');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsbeautifier');

    //for karma - you may need to install explicitly
    //sudo npm i -g karma phantomjs selenium-webdriver grunt-cli jasmine-node istanbul

    // Configurable paths
    var yoConfig = {
        livereload: 35729,
        examplePage: 'example/index.html',
        src: 'src',
        dist: 'dist'
    };

    // Livereload setup
    var lrSnippet = require('connect-livereload')({
        port: yoConfig.livereload
    });
    var mountFolder = function(connect, dir) {
        return connect.static(require('path').resolve(dir));
    };

    // Load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        yo: yoConfig,
        meta: {
            banner: '/**\n' +
                ' * <%= pkg.name %>\n' +
                ' * @version v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                ' * @link <%= pkg.homepage %>\n' +
                ' * @author <%= pkg.author.name %> <<%= pkg.author.email %>>\n' +
                ' * @license MIT License, http://www.opensource.org/licenses/MIT\n' +
                ' */\n'
        },
        open: {
            server: {
                path: 'http://localhost:<%= connect.options.port %>/<%= yo.examplePage %>'
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= yo.dist %>/*',
                        '!<%= yo.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            less: {
                files: ['<%= yo.src %>/{,*/}*.less'],
                tasks: ['less:dist']
            },
            app: {
                files: [
                    '<%= yo.src %>/{,*/}*.html',
                    '{.tmp,<%= yo.src %>}/{,*/}*.css',
                    '{.tmp,<%= yo.src %>}/{,*/}*.js'
                ],
                options: {
                    livereload: yoConfig.livereload
                }
            },
            test: {
                files: '<%= jshint.test.src %>',
                tasks: ['jshint:test', 'qunit']
            }
        },
        connect: {
            options: {
                port: 9000,
                hostname: '0.0.0.0' // Change this to '0.0.0.0' to access the server from outside.
            },
            livereload: {
                options: {
                    open: true,
                    middleware: function(connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, yoConfig.src),
                            mountFolder(connect, '.')
                        ];
                    }
                }
            }
        },
        less: {
            options: {
                // dumpLineNumbers: 'all',
                paths: ['<%= yo.src %>']
            },
            dist: {
                files: {
                    '<%= yo.src %>/<%= yo.name %>.css': '<%= yo.src %>/<%= yo.name %>.less'
                }
            }
        },
        jshint: {
            gruntfile: {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: 'Gruntfile.js'
            },
            src: {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: ['<%= yo.src %>/{,*/}*.js']
            },
            test: {
                options: {
                    jshintrc: 'test/.jshintrc'
                },
                src: ['test/**/*.js']
            }
        },
        karma: {
            options: {
                configFile: 'karma.conf.js',
                browsers: ['PhantomJS']
            },
            unit: {
                singleRun: true
            },
            server: {
                autoWatch: true
            }
        },
        ngmin: {
            options: {
                banner: '<%= meta.banner %>'
            },
            dist: {
                src: ['<%= yo.src %>/<%= pkg.name %>.js'],
                dest: '<%= yo.dist %>/<%= pkg.name %>.js'
            }
            // dist: {
            //   files: {
            //     '/.js': '/.js'
            //   }
            // }
        },
        concat: {
            options: {
                banner: '<%= meta.banner %>',
                stripBanners: true
            },
            dist: {
                src: ['<%= yo.src %>/<%= pkg.name %>.js'],
                dest: '<%= yo.dist %>/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '<%= meta.banner %>'
            },
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: '<%= yo.dist %>/<%= pkg.name %>.min.js'
            }
        },
        jsbeautifier: {
            //"default": {
            //      src : ["src/**/*.js"]
            //  },
            'pre-test': {
                src: ['src/**/*.js', 'Gruntfile.js', 'test/**/*.js'],
                options: {
                    //mode:"VERIFY_ONLY"
                    //dest: "test/pretty"
                }
            }
        },
        //https://github.com/stephenplusplus/grunt-bower-install
        bowerInstall: {
            target: {
                src: '<%= yo.src %>/example/index.html',
                ignorePath: ['<%= yo.src %>/', 'bower_components']
            }
        },
        bump: {
            options: {
                files: ['package.json', 'bower.json'],
                updateConfigs: [],
                commit: true,
                commitMessage: 'Release v%VERSION%',
                commitFiles: ['-a'], // '-a' for all files
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: true,
                pushTo: 'origin',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d' // options to use with '$ git describe'
            }
        }
    });


    grunt.registerTask('serve', function(target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'bowerInstall',
            'connect:livereload',
            'open',
            'watch'
        ]);
    });

    grunt.registerTask('test', [
        'jsbeautifier:pre-test',
        'jshint',
        'karma:unit'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'jsbeautifier:pre-test',
        'less:dist',
        'ngmin:dist',
        'uglify:dist'
    ]);

    grunt.registerTask('release', [
        'test',
        'bump-only',
        'build',
        'bump-commit'
    ]);

    grunt.registerTask('usage', 'prints usage information', function() {
        grunt.log.writeln('=============  usage =============');
        grunt.log.writeln('grunt serve - to see example app');
        grunt.log.writeln('grunt clean - to clean up the project and artifacts');
        grunt.log.writeln('grunt test - to run the tests');
        grunt.log.writeln('grunt build - to build the distributable files');
        grunt.log.writeln('grunt release - to bump the version, create distributables and commit to the repo and tag it');
    });

    grunt.registerTask('default', ['usage']);

};
