var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var pkg = require('./package.json');

gulp.task('browserify', function() {
    return browserify(['./src/ImageResolver.js'])
        .bundle({
            'standalone':'ImageResolver',
            'debug': false,
        })
        .pipe(source('ImageResolver.' + pkg.version + '.js' ))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('watch', function(){
	gulp.watch('src/**', ['browserify']);
});

gulp.task('default', ['browserify']);