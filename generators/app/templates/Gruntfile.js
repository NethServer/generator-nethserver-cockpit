module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ['dist/**'],
        clean: {
            build: ['dist/**'],
            remove: ['.tmp']
        },
        useminPrepare: {
            html: 'app/index.html',
            options: {
                dest: 'dist'
            }
        },
        usemin: {
            html: ['dist/index.html']
        },
        copy: {
            html: {
                src: './app/index.html',
                dest: 'dist/index.html'
            },
            manifests: {
                expand: true,
                cwd: 'app/',
                src: ['manifest.json', 'override.json'],
                dest: 'dist/'
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'dist/index.html': 'dist/index.html',
                }
            }
        },
        shell: {
            rsync: {
                command: function (login, port, source, dest) {
                    return "rsync -aiz -e 'ssh -p " + port + "' " + source + " " + login + ':' + dest;
                },
            },
            compress: {
                command: function () {
                    return "tar cvzf <%= rawname %>-app.tar.gz -C dist/ .";
                }
            }
        },
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('build', 'Make .js files in under dist/', [
        'clean:build',
        'copy:html',
        'copy:manifests',
        'useminPrepare',
        'concat',
        'uglify',
        'cssmin',
        'usemin',
        'htmlmin',
        'clean:remove'
    ]);
    grunt.registerTask('rsync', 'Sync folder with remote host', function (login, port, dest) {
        if (port === undefined) {
            port = 22;
        }
        if (dest === undefined) {
            dest = '~/.local/share/cockpit/nethserver';
        }
        grunt.task.run([
            'shell:manifest', ['shell:rsync', login, port, 'dist/', dest].join(':'),
        ]);
    });

    grunt.registerTask('release', 'Create release file', ['shell:compress']);

};