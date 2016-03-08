/*eslint-env node, jasmine, phantomjs */

var gulp = require("gulp");
var browserSync = require("browser-sync").create();
var sass = require("gulp-sass");
var autoPrefixer = require("gulp-autoprefixer");
var eslint = require("gulp-eslint");
var jasmine = require("gulp-jasmine-phantom");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");

gulp.task("styles", function() {
  gulp.src("scss/**/*.scss")
      .pipe(sass().on("error", sass.logError))
      .pipe(autoPrefixer({
        browsers: ["last 2 versions"]
      }))
      .pipe(gulp.dest("./css"))
      .pipe(browserSync.stream())
  ;
});

gulp.task("lint", function () {
  return gulp.src(["js/**/*.js"])
    // eslint() attaches the lint output to the eslint property
    // of the file object so it can be used by other modules.
    .pipe(eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failOnError last.
    .pipe(eslint.failOnError())
  ;
});

gulp.task("watch", ["styles", "lint"], function() {
  gulp.watch("scss/**/*.scss", ["styles"]);
  gulp.watch("js/**/*.js", ["lint"]);
  gulp.watch("./**/*.html").on("change", browserSync.reload);
  browserSync.init({server: "./"});
});

gulp.task("tests", ["lint"], function () {
  // TODO: Figure out why jasmine refuses to work in "integration" mode.
  gulp.src("tests/fooSpec.js")
      .pipe(jasmine({
        vendor: "js/**/*.js"
        ,includeStackTrace: true
      }))
  ;
});

gulp.task("dist-styles", function() {
  gulp.src("scss/**/*.scss")
      .pipe(sass({
        outputStyle: "compressed"
      }).on("error", sass.logError))
      .pipe(autoPrefixer({
        browsers: ["last 2 versions"]
      }))
      .pipe(gulp.dest("dist/css"))
  ;
});

gulp.task("dist-img", function() {
  gulp.src("img/*")
      .pipe(gulp.dest("dist/img"))
  ;
});

gulp.task("dist-js", ["lint", "tests"], function() {
  gulp.src("js/**/*.js")
      .pipe(concat("all.js"))
      .pipe(uglify())
      .pipe(gulp.dest("dist/js"))
  ;
});

gulp.task("dist-html", function() {
  gulp.src("./*.html")
      .pipe(gulp.dest("dist"))
  ;
  // TODO: Probably need a step to merge the <script> blocks of the dev files
  // into a single <script> for all.js.
});

gulp.task("dist", ["dist-styles", "dist-img", "dist-js", "dist-html"], function() {
  // Could try to work a browser-sync in here, but probably not worth it.
});
