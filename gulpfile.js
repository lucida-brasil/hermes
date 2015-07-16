var gulp   = require('gulp');
var babel  = require('gulp-babel');
var uglify = require('gulp-uglify');

gulp.task('es6to5', function () {
    return gulp.src('source/**/*.js')
        .pipe(babel())
        .pipe(uglify())
        .pipe(gulp.dest('bin'));
});

gulp.task('default', ['es6to5']);
