// Include gulp
var gulp = require('gulp');

// Include Plugins
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify'); //https://www.npmjs.org/package/gulp-uglify
var rename = require('gulp-rename');
var minifyCSS = require('gulp-minify-css');
var htmlreplace = require('gulp-html-replace'); //https://www.npmjs.org/package/gulp-html-replace
var inject = require("gulp-inject"); //https://www.npmjs.org/package/gulp-inject
var fileinclude = require('gulp-file-include'); //https://www.npmjs.org/package/gulp-file-include - check out this once it includes inc and template - https://www.npmjs.org/package/gulp-processhtml/
var imagemin = require('gulp-imagemin'); //https://www.npmjs.com/package/gulp-imagemin/
var pngquant = require('imagemin-pngquant');//https://www.npmjs.com/package/imagemin-pngquant

// Paths
var srcsite = 'src/';
var distsite = 'dist/';
var srcapp = 'src/app/www/'
var distapp = 'dist/app/';

// Lint Task
gulp.task('lint', function() {
    gulp.src([srcsite + 'js/*.js', srcapp + 'js/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Concatenate & Minify CSS
gulp.task('styles', function() {
    //app
    gulp.src([srcapp + 'css/normalize.css', srcapp + 'css/reset.css', srcapp + 'css/boilerplate.css', srcapp + 'css/main.css', srcapp + 'css/theme.css', srcapp + 'css/behavior.css'])
        .pipe(concat('styles.css'))
        .pipe(minifyCSS({
            keepBreaks: false
        }))
        .pipe(gulp.dest(distapp + 'css'))
    //site
    gulp.src([srcsite + 'css/normalize.css', srcsite + 'css/reset.css', srcsite + 'css/boilerplate.css', srcsite + 'css/main.css', srcsite + 'css/theme.css', srcsite + 'css/behavior.css'])
        .pipe(concat('styles.css'))
        .pipe(minifyCSS({
            keepBreaks: false
        }))
        .pipe(gulp.dest(distsite + 'css'))
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    //app
    gulp.src([srcapp + 'js/vendor/jquery.min.js', srcapp + 'js/vendor/amplify.store.min.js', srcapp + 'js/vendor/shake.js', srcapp + 'js/helper.js', srcapp + 'js/plugins.js', srcapp + 'js/main.js'])
        .pipe(concat('scripts.js'))
        .pipe(uglify({
            mangle: false,
            compress: false
        }))
        .pipe(gulp.dest(distapp + 'js'));
    //site
    gulp.src([srcsite + 'js/vendor/jquery.min.js', srcsite + 'js/vendor/greensock/TweenMax.min.js', srcsite + 'js/vendor/jquery.scrollmagic.min.js', srcsite + 'js/helper.js', srcsite + 'js/plugins.js', srcsite + 'js/main.js'])
        .pipe(concat('scripts.js'))
        .pipe(uglify({
            mangle: false,
            compress: false
        }))
        .pipe(gulp.dest(distsite + 'js'));
});

//Optimize Images
gulp.task('images', function () {
    //app
    gulp.src([srcapp + 'img/*'])
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(distapp + 'img'));
    gulp.src([srcapp + 'img/touch/*'])
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(distapp + 'img/touch'));
    gulp.src([srcapp + 'img/startup/*'])
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(distapp + 'img/startup'));
    //site
    gulp.src([srcsite + 'img/*'])
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(distsite + 'img'));
    gulp.src([srcsite + 'img/touch/*'])
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(distsite + 'img/touch'));
});

// Move Files
gulp.task('prepDist', function() {
    //app
    gulp.src([srcapp + 'fonts/*'])
        .pipe(gulp.dest(distapp + 'fonts'));
    gulp.src([srcapp + 'js/vendor/modernizr.min.js'])
        .pipe(gulp.dest(distapp + 'js/vendor'));
    gulp.src([srcapp + '*.html', srcapp + '*.txt', srcapp + '*.json', srcapp + '*.appcache'])
        .pipe(htmlreplace({
            'styles': 'css/styles.css',
            'cordova': '',
            'scripts': 'js/scripts.js',
            'inc': '@@include(\'gtm.inc\')'
        }))
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(distapp));
    //site
    gulp.src([srcsite + 'fonts/*'])
        .pipe(gulp.dest(distsite + 'fonts'));
    gulp.src([srcsite + 'js/vendor/modernizr.min.js'])
        .pipe(gulp.dest(distsite + 'js/vendor'));
    gulp.src([srcsite + '*.html', srcsite + '*.txt', srcsite + '*.json', srcsite + '*.appcache'])
        .pipe(htmlreplace({
            'styles': 'css/styles.css',
            'scripts': 'js/scripts.js',
            'inc': '@@include(\'gtm.inc\')'
        }))
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(distsite));
});

// Watch Files For Changes
gulp.task('watch', function() {
    //app
    gulp.watch(srcapp + 'js/*.js', ['lint', 'scripts']);
    gulp.watch(srcapp + 'css/*.css', ['styles']);
    gulp.watch(srcapp + '*.html', ['prepDist']);
    gulp.watch(srcapp + '*.txt', ['prepDist']);
    gulp.watch(srcapp + '*.json', ['prepDist']);
    gulp.watch(srcapp + '*.appcache', ['prepDist']);
    //site
    gulp.watch(srcsite + 'js/*.js', ['lint', 'scripts']);
    gulp.watch(srcsite + 'css/*.css', ['styles']);
    gulp.watch(srcsite + '*.html', ['prepDist']);
    gulp.watch(srcsite + '*.txt', ['prepDist']);
    gulp.watch(srcsite + '*.json', ['prepDist']);
    gulp.watch(srcsite + '*.appcache', ['prepDist']);
});

// Default Task
gulp.task('default', ['lint', 'scripts', 'styles', 'images', 'prepDist', /*'watch'*/ ]);
