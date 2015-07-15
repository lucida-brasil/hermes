var gulp  = require('gulp');
var babel = require('gulp-babel');

gulp.task('es6to5', function () {
    return gulp.src('source/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest('bin'));
});

gulp.task('default', ['es6to5']);
