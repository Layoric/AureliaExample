/*global require*/
(function () {
    var fs = require('fs');
    var path = require('path');
    // include gulp
    var gulp = require('gulp');
    // include plug-ins
    var del = require('del');
    var uglify = require('gulp-uglify');
    var newer = require('gulp-newer');
    var useref = require('gulp-useref');
    var gulpif = require('gulp-if');
    var minifyCss = require('gulp-clean-css');
    var gulpReplace = require('gulp-replace');
    var htmlBuild = require('gulp-htmlbuild');
    var eventStream = require('event-stream');
    var jspmBuild = require('gulp-jspm');
    var aureliaBundle = require('aurelia-bundler').bundle;
    var rename = require('gulp-rename');
    var runSequence = require('run-sequence');
    var argv = require('yargs').argv;
    var nugetRestore = require('gulp-nuget-restore');
    var msbuild = require('gulp-msbuild');
	var msdeploy = require('gulp-msdeploy');

    var webRoot = 'wwwroot/';
    var webBuildDir = argv.serviceStackSettingsDir || './wwwroot_build/';
    var configFile = 'config.json';
    var configDir = webBuildDir + 'publish/';
    var configPath = configDir + configFile;
    var appSettingsFile = 'appsettings.txt';
    var appSettingsDir = webBuildDir + 'deploy/';
    var appSettingsPath = appSettingsDir + appSettingsFile;

    var aureliaBundleConfig = {
        force: true,
        baseURL: '.',                   // baseURL of the application
        configPath: 'wwwroot/config.js',      // config.js file. Must be within `baseURL`
        bundles: {
            "./wwwroot/app": {
                includes: [
                    '[src/**/*.js]',
                    'src/**/*.html!text',
                    'css/*.css!text',
                    "aurelia-bootstrapper",
                    "aurelia-framework",
                    "aurelia-history-browser",
                    "aurelia-http-client",
                    "aurelia-logging-console",
                    "aurelia-loader-default",
                    "aurelia-router",
                    "aurelia-templating-binding",
                    "aurelia-templating-resources",
                    "aurelia-templating-router",
                    "bootstrap",
                    "es6-shim",
                    "jquery"
                ],
                options: {
                    inject: true,
                    minify: true
                }
            }
        }
    };

    function createConfigsIfMissing() {
        if (!fs.existsSync(configPath)) {
            if (!fs.existsSync(configDir)) {
                fs.mkdirSync(configDir);
            }
            fs.writeFileSync(configPath, JSON.stringify({
                "iisApp": "AureliaExample",
                "serverAddress": "deploy-server.example.com",
                "userName": "{WebDeployUserName}",
                "password": "{WebDeployPassword}"
            }, null, 4));
        }
        if (!fs.existsSync(appSettingsPath)) {
            if (!fs.existsSync(appSettingsDir)) {
                fs.mkdirSync(appSettingsDir);
            }
            fs.writeFileSync(appSettingsPath,
                '# Release App Settings\r\nDebugMode false');
        }
    }

    // Deployment config
    createConfigsIfMissing();
    var config = require(configPath);

    // htmlbuild replace for CDN references
    function pipeTemplate(block, template) {
        eventStream.readArray([
            template
        ].map(function (str) {
            return block.indent + str;
        })).pipe(block);
    }

    // Tasks

    gulp.task('www-clean-dlls', function (done) {
        var binPath = webRoot + '/bin/';
        del(binPath, done);
    });
    gulp.task('www-copy-bin', function () {
        var binDest = webRoot + 'bin/';
        return gulp.src('./bin/**/*')
            .pipe(newer(binDest))
            .pipe(gulp.dest(binDest));
    });
    gulp.task('www-copy-appdata', function () {
        return gulp.src('./App_Data/**/*')
            .pipe(newer(webRoot + 'App_Data/'))
            .pipe(gulp.dest(webRoot + 'App_Data/'));
    });
    gulp.task('www-copy-webconfig', function () {
        return gulp.src('./web.config')
            .pipe(newer(webRoot))
            .pipe(gulpReplace('<compilation debug="true" targetFramework="4.5">', '<compilation targetFramework="4.5">'))
            .pipe(gulp.dest(webRoot));
    });
    gulp.task('www-copy-asax', function () {
        return gulp.src('./Global.asax')
            .pipe(newer(webRoot))
            .pipe(gulp.dest(webRoot));
    });
    gulp.task('www-clean-client-assets', function (done) {
        del([
            webRoot + '**/*.*',
            '!wwwroot/bin/**/*.*', //Don't delete dlls
            '!wwwroot/App_Data/**/*.*', //Don't delete App_Data
            '!wwwroot/**/*.asax', //Don't delete asax
            '!wwwroot/**/*.config', //Don't delete config
            '!wwwroot/appsettings.txt' //Don't delete deploy settings
        ], done);
    });
    gulp.task('www-copy-fonts', function () {
        return gulp.src('./jspm_packages/npm/bootstrap@3.2.0/fonts/*.*')
            .pipe(gulp.dest(webRoot + 'lib/fonts/'));
    });
    gulp.task('www-copy-images', function () {
        return gulp.src('./img/**/*')
            .pipe(gulp.dest(webRoot + 'img/'));
    });
	gulp.task('www-copy-jspm-config', function () {
        return gulp.src('./config.js')
            .pipe(gulp.dest(webRoot + '/'));
    });
    gulp.task('www-bundle-html', function () {
        return gulp.src('./default.html')
            .pipe(gulpif('*.js', uglify()))
            .pipe(gulpif('*.css', minifyCss()))
            .pipe(useref())
            .pipe(htmlBuild({
                bootstrapCss: function (block) {
                    pipeTemplate(block, '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.2.0/css/bootstrap.min.css" />');
                },
                appbundle: function (block) {
                    pipeTemplate(block, '<script src="/app.js"></script>'); // file generated by 'www-bundle-aurelia' task below
                }
            }))
            .pipe(gulp.dest(webRoot));
    });
    gulp.task('www-bundle-aurelia', function () {
        return aureliaBundle(aureliaBundleConfig);
    });
    gulp.task('www-copy-deploy-files', function () {
        return gulp.src(webBuildDir + 'deploy/*.*')
            .pipe(newer(webRoot))
            .pipe(gulp.dest(webRoot));
    });
    gulp.task('www-jspm-deps', function () {
        return gulp.src('./src/deps.js')
            .pipe(jspmBuild())
            .pipe(rename('deps.lib.js'))
            .pipe(gulp.dest('./'));
    });
    gulp.task('www-msbuild', function () {
        return gulp.src('../../AureliaExample.sln')
            .pipe(nugetRestore())
            .pipe(msbuild({
                targets: ['Clean', 'Build'],
                stdout: true,
                verbosity: 'quiet'
            }
            ));
    });

    gulp.task('01-package-server', function (callback) {
        runSequence('www-msbuild', 'www-clean-dlls',
                [
                    'www-copy-bin',
                    'www-copy-appdata',
                    'www-copy-webconfig',
                    'www-copy-asax',
                    'www-copy-deploy-files'
                ],
                callback);
    });

    gulp.task('02-package-client', function (callback) {
        runSequence('www-clean-client-assets',
                [
                    'www-copy-fonts',
                    'www-copy-images',
					'www-copy-jspm-config',
                    'www-bundle-html'
                ],
                'www-bundle-aurelia',
                callback);
    });

    gulp.task('00-update-deps-js', function (callback) {
        runSequence('www-msbuild', 'www-jspm-deps',
                callback);
    });

    gulp.task('www-msdeploy-pack', function () {
        return gulp.src('wwwroot/')
            .pipe(msdeploy({
                verb: 'sync',
                sourceType: 'iisApp',
                dest: {
                    'package': path.resolve('./webdeploy.zip')
                }
            }));
    });

    gulp.task('www-msdeploy-push', function () {
        return gulp.src('./webdeploy.zip')
            .pipe(msdeploy({
                verb: 'sync',
                allowUntrusted: 'true',
                sourceType: 'package',
                dest: {
                    iisApp: config.iisApp,
                    wmsvc: config.serverAddress,
                    UserName: config.userName,
                    Password: config.password
                }
            }));
    });

    gulp.task('03-deploy-app', function (callback) {
        runSequence('www-msdeploy-pack', 'www-msdeploy-push',
            callback);
    });

    gulp.task('package-and-deploy', function (callback) {
        runSequence('01-package-server', '02-package-client', '03-deploy-app',
            callback);
    });
    gulp.task('default', function (callback) {
        runSequence('01-package-server', '02-package-client',
                callback);
    });
})();