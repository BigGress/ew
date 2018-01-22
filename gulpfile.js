var gulp = require('gulp');
var inlineResources = require('./scripts/gulp/inline-resources');
var sass = require('gulp-sass');


gulp.task('copy-and-inline-resource', copyHtml);

function copyHtml() {
    gulp.src('./src/app/core/**/*.html')
        .pipe(gulp.dest('./dist')).on('end', copyAssets);
}

function copyAssets () {
    gulp.src('./src/app/core/**/*.json')
        .pipe(gulp.dest('./dist'));
    gulp.src('./src/assets/**/*')
        .pipe(gulp.dest('./dist/assets')).on('end', copyScss);
}
function copyScss () {
    gulp.src('./src/app/core/**/*.scss')
        .pipe(gulp.dest('./dist')).on('end', inlineResource);
}

function inlineResource() {
    inlineResources('./dist');
}

gulp.task('default', ['copy-and-inline-resource']);
