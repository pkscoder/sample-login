var babel       = require('gulp-babel'),
    browserify 	= require('gulp-browserify'),
    browserSync = require('browser-sync').create(),
    gulp  	    = require('gulp'),
    gutil   	= require('gulp-util'),
    rename 	    = require('gulp-rename'),
    sass        = require('gulp-sass'),
    watch 	    = require('gulp-watch'),
    nightwatch = require('gulp-nightwatch'),
    del = require('del');
    var cleanCSS = require('gulp-clean-css');

gulp.task('clean:all', function () {
  return del([
    'public/javascripts/*.js',
    'public/stylesheets/*.css'
  ]);
});

//Browserify
gulp.task('browserify', 
    function(){
        gulp.src(['src/views/*.js'], {read: false})
            .pipe(browserify({
                transform 	: ['reactify'],
                extension	: ['js']
            }))
            .on('prebundle', function(bundle) { //Before bundling file, include react file.
                bundle.require('react')
            })
            .pipe(rename(function(path){
                path.basename = path.basename+"-combined"; 
                path.extname  = ".js"; // Take file name + append `-combined` + `.js`
                gutil.log("Gulpying " + path.basename+""+path.extname);
            }))
            .pipe(gulp.dest('public/javascripts')
        )
    }
);

gulp.task('browserify-dev', 
    function(){
        gulp.src(['src/views/*.js'], {read: false})
            .pipe(watch('src/views/*.js'))
            .pipe(browserify({
                transform   : ['reactify'],
                extension   : ['js']
            }))
            .on('prebundle', function(bundle) { //Before bundling file, include react file.
                bundle.require('react')
            })
            .pipe(rename(function(path){
                path.basename = path.basename+"-combined"; 
                path.extname  = ".js"; // Take file name + append `-combined` + `.js`
                gutil.log("Gulpying " + path.basename+""+path.extname);
            }))
            .pipe(gulp.dest('public/javascripts')
        )
    }
);

// SASS
gulp.task('sass', function() {
    return gulp.src('src/sass/*.scss')
    .pipe(sass())
    .pipe(rename(function(path){
        gutil.log("SASS " + path.basename);
    }))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('public/stylesheets'))
    .pipe(browserSync.stream());
});

gulp.task('nightwatch:chrome', function(){
  return gulp.src('')
    .pipe(nightwatch({
      configFile: './nightwatch.json',
      cliArgs: [ '--env chrome']
    }));
});

// Browser-Sync
gulp.task('serve', ['sass'],function() {
    browserSync.init({
        proxy: 'http://localhost:3000'
    });
    gulp.watch('src/sass/**', ['sass']);
    gulp.watch('views/*.hbs').on('change', browserSync.reload);
    gulp.watch('public/javascripts/*.js').on('change', browserSync.reload);
});

gulp.task('default', ['browserify-dev', 'serve']);

gulp.task('build', ['clean:all', 'sass', 'browserify'])
