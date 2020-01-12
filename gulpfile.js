var gulp = require("gulp");
var sass = require("gulp-sass");
var imagemin = require("gulp-imagemin");
var cache = require('gulp-cache');
var browserSync = require("browser-sync").create();
var useref = require("gulp-useref");
var uglify = require("gulp-uglify");
var gulpIf = require("gulp-if");
var del = require("del");
var runSequence = require('run-sequence');
const { series, parallel } = require("gulp");

gulp.task("hello", function() {
  console.log("Hello Simon");
});

gulp.task("browserSync", function() {
  browserSync.init({
    server: {
      baseDir: "src"
    },
    ui: {
      port: 8010
    },
    port: 8080
  });
});

gulp.task("useref", function() {
  return gulp
    .src("src/*.html")
    .pipe(useref())
    .pipe(gulpIf("*.js", uglify()))
    .pipe(gulp.dest("dist"));
});

gulp.task("transfer" , function() {
    return gulp
    .src("src/*.html")
    .pipe(gulp.dest("dist"));
});

gulp.task("sass", function() {
  return gulp
    .src("src/styles/scss/*.scss")
    .pipe(sass()) // Using gulp-sass
    .pipe(gulp.dest("src/styles/css"))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
});

gulp.task("html", function() {
  return gulp
    .src("src/*.html")
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
});

gulp.task("js", function() {
  return gulp
    .src("src/js/*.js")
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
});

gulp.task("fonts", function() {
  return gulp.src("src/fonts/**/*").pipe(gulp.dest("dist/fonts"));
});

gulp.task("images", function() {
  return gulp
    .src("src/images/**/*.+(png|jpg|gif|svg)")
    .pipe(
        imagemin({
          interlaced: true
        })
    )
    .pipe(gulp.dest("dist/images"));
});

gulp.task("clean:dist", async function() {
  return del.sync("dist/*");
});

gulp.task("watch", function() {
  gulp.watch("src/styles/scss/*.scss", gulp.series(["sass"]));
  gulp.watch("src/styles/scss/*.scss", browserSync.reload);
  gulp.watch("src/*.html", gulp.series(["html"]));
  gulp.watch("src/js/*.js", gulp.series(["js"]));
});


  const serve = gulp.parallel(
    'transfer','sass', 'browserSync','watch'
  );

   const build = gulp.series(
    'clean:dist',
    gulp.parallel('sass', 'useref', 'images', 'fonts')
  );

  exports.serve = serve;
  exports.build = build;