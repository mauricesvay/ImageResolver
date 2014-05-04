var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');

gulp.task('browserify', function() {
    return browserify(['./src/ImageResolver.js'])
        .bundle({'standalone':'ImageResolver'})
        .pipe(source('ImageResolver.min.js'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('watch', function(){
	gulp.watch('src/**', ['browserify']);
});

gulp.task('default', ['browserify']);