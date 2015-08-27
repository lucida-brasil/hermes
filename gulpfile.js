var gulp    = require('gulp');
var babel   = require('gulp-babel');
var uglify  = require('gulp-uglify');
var jsonmin = require('gulp-jsonminify');
var paths   = {
        source : {
            js: 'source/**/*.js',
            json: 'source/**/*.json'
        },
        bin: 'bin'
    };

gulp.task('es6to5', function () {
    return gulp
        .src(paths.source.js)
        .pipe(babel())
        .pipe(uglify())
        .pipe(gulp.dest(paths.bin));
});

gulp.task('json', function () {
    return gulp
        .src(paths.source.json)
        .pipe(jsonmin())
        .pipe(gulp.dest(paths.bin));
});

gulp.task('default', ['es6to5', 'json']);