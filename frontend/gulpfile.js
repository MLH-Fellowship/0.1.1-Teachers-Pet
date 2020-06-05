
const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const strip = require('gulp-strip-comments');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const webpackStream = require('webpack-stream');
const webp = require('gulp-webp');
const cleanCSS = require('gulp-clean-css');

const baseDir = 'solution/';
const paths = {
  src: {
    css: [`${baseDir}css/normalize.css`, `${baseDir}css/main.css`],
    js: `${baseDir}js/**/*.js`,
    imagesWebp: `${baseDir}assets/images/*.{jpg,png}`,
    imagesOrig: `${baseDir}assets/images/*.{jpg,png}`,
    copyFiles: [
    `${baseDir}assets/fonts/**/*`,
    `${baseDir}assets/icons/**/*`,
    `${baseDir}assets/**/*.svg`,
    `${baseDir}assets/**/*.json`,
    ]
  },
  dist: {
    css: `${baseDir}dist/css`,
    js: `${baseDir}dist/js`,
    imagesWebp: `${baseDir}dist/assets/images`,
    imagesOrig: `${baseDir}dist/assets/images`,
  },
};

const imagesWebp = () => gulp.src(paths.src.imagesWebp)
.pipe(webp())
.pipe(gulp.dest(paths.dist.imagesWebp));

const imagesOrig = () => gulp.src(paths.src.imagesOrig)
.pipe(gulp.dest(paths.dist.imagesOrig));

const css = () => gulp.src(paths.src.css)
.pipe(sourcemaps.init())
.pipe(cleanCSS({ compatibility: '*', level: { 1: { specialComments: 0 } } }))
.pipe(concat('styles.css'))
.pipe(sourcemaps.write())
.pipe(gulp.dest(paths.dist.css));

const js = () => {
  const options = {
    mode: 'development',
  };

  return gulp.src(paths.src.js)
  .pipe(sourcemaps.init())
  .pipe(babel({
    presets: ['@babel/env'],
  }))
  .pipe(webpackStream(options))
  .pipe(strip())
  .pipe(uglify())
  .pipe(concat('vanilla.js'))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(paths.dist.js));
};

const copyFiles = () => gulp.src(paths.src.copyFiles).pipe(gulp.dest(`${baseDir}dist/assets`));

const watch = () => {
  gulp.watch(paths.src.css, css);
  gulp.watch(paths.src.js, js);
  gulp.watch(paths.src.imagesWebp, imagesWebp);
  gulp.watch(paths.src.imagesOrig, imagesOrig);
  gulp.watch(paths.src.copyFiles, copyFiles);
  return;
}

const gulpDefault = () => gulp.parallel(imagesWebp, imagesOrig, css, js, copyFiles);
const gulpWatchDefault = () => gulp.parallel(imagesWebp, imagesOrig, css, js, copyFiles, watch);

exports['heroku:production'] = gulpDefault();
exports['watch'] = gulpWatchDefault();
exports.default = gulpDefault();
