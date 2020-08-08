const gulp = require("gulp");
const sass = require("gulp-sass");
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require("gulp-autoprefixer");
const imagemin = require("gulp-imagemin");
const cache = require('gulp-cache');
const browserSync = require("browser-sync").create();
const useref = require("gulp-useref");
const terser = require("gulp-terser");
const rename = require("gulp-rename");
const gulpIf = require("gulp-if");
const del = require("del");
const runSequence = require('run-sequence');
const { series, parallel, watch, task } = require("gulp");
const autoPrefixer = require("gulp-autoprefixer");

function hello() {
  console.log("Hello Simon");
};

function sync() {
  browserSync.init({
    server: {
      baseDir: "src"
    },
    ui: {
      port: 8010
    },
    port: 8080
  });
};

function ref() {
  return gulp
    .src("src/*.html")
    .pipe(useref())
    .pipe(gulpIf("*.js", terser()))
    .pipe(gulpIf("*.css",cleanCSS()))
    .pipe(gulp.dest("dist"));
};

function handleSass() {
  return gulp
    .src("src/styles/scss/*.scss")
    .pipe(sass()) // Using gulp-sass
    .pipe(gulp.dest("src/styles/css"))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
};

function html() {
  return gulp
    .src("src/*.html")
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
};

function js() {
  return gulp
    .src("src/js/*.js")
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
};

function fonts() {
  return gulp.src("src/fonts/**/*").pipe(gulp.dest("dist/fonts"));
};

function images() {
  return gulp
    .src("src/images/**/*.+(png|jpg|gif|svg)")
    .pipe(
        imagemin({
          interlaced: true
        })
    )
    .pipe(gulp.dest("dist/images"));
};

function videos() {
  return gulp
  .src("src/images/**/*.mp4")
  .pipe(gulp.dest("dist/images"));
};

async function cleanDist() {
  return del.sync("dist/*");
};

function observe() {
  watch(["src/styles/scss/*.scss"], series(handleSass));
  watch(["src/*.html"], series(html));
  watch(["src/js/*.js"], series(js));
};

async function autoPrefix () {
  gulp.src('src/styles/css/style.css')
      .pipe(autoprefixer({
          cascade: false
      }))
      .pipe(gulp.dest('dist/'))
    };

async function makeUgly () {
  gulp.src('src/js/main.js')
      .pipe(terser())
      .pipe(rename({ extname: '.min.js' }))
      .pipe(gulp.dest('dist/'))
};

  exports.serve = parallel(handleSass, sync, observe
  );

  exports.build = series(
    cleanDist, handleSass,
    parallel(ref, images, videos, fonts
    )
  );