var gulp    = require('gulp');
var mocha   = require('gulp-mocha');
var jshint  = require('gulp-jshint');
var stylish = require('jshint-stylish');

var paths = {
  test: './test/**/*',
  src: './lib/**/*'
};

gulp.task('test', function() {
  return gulp.src(paths.test, {read: false})
    .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('jshint', function() {
  return gulp.src(paths.src)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('default', ['jshint', 'test']);
