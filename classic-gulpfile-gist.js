// jshint: esversion: 6

// Typical gulp setup for testing on from github gist by lmartins
// URL: https://gist.github.com/lmartins/8753349

// Include gulp
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    prefix = require('gulp-autoprefixer'),
    coffee = require('gulp-coffee'),
    coffeelint = require('gulp-coffeelint'),
    concat = require('gulp-concat'),
    plumber = require('gulp-plumber'),
    changed = require('gulp-changed'),
    uglify = require('gulp-uglify'),
    livereload = require('gulp-livereload'),
    lr = require('tiny-lr'),
    server = lr(),
    notify = require("gulp-notify");

var options = {
    // HTML
    HTML_SOURCE     : "views/**/*.tpl",

    // SASS / CSS
    SASS_SOURCE     : "sass/**/*.scss",
    SASS_DEST       : "../assets/css/",

    // JavaScript
    COFFEE_SOURCE   : "coffee/**/*.coffee",
    COFFEE_DEST     : "../assets/js/",

    // Images
    IMAGE_SOURCE    : "images/**/*",
    IMAGE_DEST      : "../assets/images",

    // Icons
    ICONS_SOURCE    : "src/sass/app/components/icons/svg/*.svg",
    ICONS_DEST      : "build/css/fonts/",

    // Live reload
    LIVE_RELOAD_PORT: 35729
};

// Compile Our Sass
gulp.task('sass', function() {
    gulp.src( options.SASS_SOURCE )
        .pipe(plumber())
        .pipe(sass({
            outputStyle: 'compressed',
            // sourceComments: 'map'
            }))
        .on("error", notify.onError())
        .on("error", function (err) {
            console.log("Error:", err);
        })
        .pipe(prefix(
            "last 2 versions", "> 10%"
            ))
        .pipe(gulp.dest( options.SASS_DEST ))
        .pipe(livereload(server));
});


// Compile Our Coffee
gulp.task('coffee', function () {
  gulp.src( options.COFFEE_SOURCE )
    .pipe(changed ( options.COFFEE_SOURCE ))
    .pipe(coffee({
        sourceMap: true
    })
    .on('error', gutil.log))
    .pipe(gulp.dest( options.COFFEE_DEST ))
    .pipe(livereload(server));
});


gulp.task('lint', function () {
    gulp.src( options.COFFEE_SOURCE )
        .pipe(coffeelint())
        .pipe(coffeelint.reporter());
});

gulp.task('bowerCopy', function() {
  gulp.src([
    'vendor/yepnope/yepnope.js',
    'vendor/jquery/jquery.min.js'
    // 'vendor/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/tooltip.js',
    // 'vendor/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/popover.js'
    ])
    .pipe(uglify())
    .pipe(gulp.dest( options.COFFEE_DEST + "libs" ));
});

gulp.task('bowerMerge', function() {
  gulp.src([
    'vendor/owlcarousel/owl-carousel/owl.carousel.js',
    'vendor/bootstrap/js/tab.js',
    'vendor/parsleyjs/dist/parsley.min.js'
    ])
    .pipe(concat("plugins.js"))
    .pipe(uglify())
    .pipe(gulp.dest( options.COFFEE_DEST ));
});

gulp.task('default', function () {
  gulp.watch( options.SASS_SOURCE , ['sass']);
  gulp.watch( options.COFFEE_SOURCE , ['coffee','lint'] );
});

gulp.task('bower', ['bowerCopy', 'bowerMerge']);


gulp.task('watch', function () {
  server.listen( options.LIVE_RELOAD_PORT , function (err) {
    if (err) {
        return console.log(err);
    }

    // Watch .SCSS files
    gulp.watch( options.COFFEE_SOURCE , ['coffee','lint'] );
    gulp.watch( options.SASS_SOURCE , ['sass']);
    // gulp.watch( options.HTML_SOURCE , ['html'] );
    // gulp.watch( options.IMAGE_SOURCE , ['images'] );

  });
});
