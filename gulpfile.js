const gulp = require('gulp');
const {series, parallel, watch, task } = require('gulp');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const autoPrefixer = require('gulp-autoprefixer');
const imageMin = require('gulp-imagemin');
const cache = require('gulp-cache');
const browserSync = require('browser-sync').create();
const useref = require('gulp-useref');
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const rename = require('gulp-rename');
const gulpIf = require('gulp-if');
const lazypipe = require('lazypipe');
const del = require('del');
const runSequence = require('run-sequence');

const handleJS = lazypipe()
  .pipe(babel, {
    presets: ['@babel/preset-env']
  })
  .pipe(terser);

gulp.task('hello', function() {
  console.log('Hello Simon');
});

const AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

 gulp.task('sync', function() {
  browserSync.init({
    server: {
      baseDir: 'src'
    },
    ui: {
      port: 8010
    },
    port: 8080
  });
});

 gulp.task('ref', function() {
  return gulp
    .src('src/*.html')
    .pipe(useref())
    .pipe(gulpIf('./src/js/*.js', handleJS()))
    .pipe(gulpIf('./js/vendor/**/*.js', terser()))
    .pipe(gulpIf('*.css', cleanCSS()))
    .pipe(gulp.dest('dist'));
});

 gulp.task('handleSass', function() {
  return gulp
    .src('src/styles/scss/*.scss')
    .pipe(sass()) // Using gulp-sass
    .pipe(autoPrefixer())
    .pipe(gulp.dest('src/styles/css'))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
});

 gulp.task('html', function() {
  return gulp
    .src('src/*.html')
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
});

 gulp.task('js', function() {
  return gulp
    .src('src/js/*.js')
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
});

 gulp.task('fonts', function() {
  return gulp.src('src/fonts/**/*').pipe(gulp.dest('dist/fonts'));
});

gulp.task('models', function() {
  return gulp.src('src/models/*').pipe(gulp.dest('dist/models'));
});

 gulp.task('images', function() {
  return gulp
    .src('src/images/**/*.+(png|jpg|gif|svg)')
    .pipe(imageMin([
			//gif minify
			imageMin.gifsicle({interlaced: true}),
			//jpg minify
			imageMin.jpegtran({progressive: true}),
			//png minify
			imageMin.optipng({optimizationLevel: 5}),
			//svg minify
			imageMin.svgo({
				plugins: [
					{removeViewBox: true},
					{cleanupIDs: false}
				]
			})
			],{verbose: true}))
    .pipe(gulp.dest('dist/images'));
});

  gulp.task('videos', function() {
  return gulp
  .src('src/videos/*.mp4')
  .pipe(gulp.dest('dist/videos'));
});

  gulp.task('cleanDist', async function() {
  return del.sync('dist/*');
});

 gulp.task('observe', function() {
  gulp.watch(['src/styles/scss/*.scss'], gulp.series('handleSass'));
  gulp.watch(['src/*.html'], gulp.series('html'));
  gulp.watch(['src/js/*.js'], gulp.series('js'));
});

gulp.task('autoPrefix', function() {
  gulp.src('src/styles/css/style.css')
      .pipe(autoPrefixer({
          cascade: false
      }))
      .pipe(gulp.dest('dist/'))
    });

  gulp.task('makeUgly', function() {
  gulp.src('src/js/main.js')
      .pipe(terser())
      .pipe(rename({ extname: '.min.js' }))
      .pipe(gulp.dest('dist/'))
});

gulp.task('handleJS', () =>
    gulp.src('src/js/main.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(gulp.dest('dist/'))
);

// [] --> paralell ()--> sequence

const serve = gulp.parallel('hello','handleSass', 'sync', 'observe');

const build = gulp.series('cleanDist', 'handleSass','ref', 'fonts', 'models', 'images', 'videos');

exports.serve = serve;

exports.build = build;
