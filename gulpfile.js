'use strict';

let gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    exec = require('gulp-exec'),
    csso = require('gulp-csso'),
    size = require('gulp-size'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync').create(),
    sass = require('gulp-sass'),
    cp = require('child_process');

gulp.task('scss', function () {
    return gulp
        .src('_assets/scss/**/*.scss')
        .pipe(size())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(size())
        .pipe(exec(`git checkout master`))
        .pipe(csso())
        .pipe(size())
        .pipe(sourcemaps.write('../maps', { addComment: false }))
        .pipe(gulp.dest('./docs/css'))
        .pipe(browserSync.stream({ match: '**/*.css' }));
});

// Jekyll
gulp.task('jekylldev', function () {
    return cp.spawn('bundle', ['exec', 'jekyll', 'build'], { stdio: 'inherit', shell: true });
});

gulp.task('jekyllprod', function () {
    return cp.spawn('bundle', ['exec', 'jekyll', 'build --baseurl /jekyll-gulp-template'], { stdio: 'inherit', shell: true });
});

gulp.task('watch', function () {
    browserSync.init({
        server: {
            baseDir: './docs/',
        },
    });

    gulp.watch('_assets/scss/**/*.scss', gulp.series('scss'));

    gulp.watch(['./*.html', './_includes/*.html', './_layouts/*.html', './_posts/**/*.*', './scripts/*.js']).on('change', gulp.series('jekylldev', 'scss'));

    gulp.watch('docs/**/*.html').on('change', browserSync.reload);
    gulp.watch('docs/**/*.js').on('change', browserSync.reload);
});

gulp.task('deploy', gulp.series('jekyllprod', 'scss'));

gulp.task('default', gulp.series('jekylldev', 'scss', 'watch'));
