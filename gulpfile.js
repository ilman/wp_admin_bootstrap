/*global -$ */
'use strict';
// generated on 2015-04-29 using generator-sgtheme 0.0.1
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;

gulp.task('styles', function () {

  return gulp.src([
      'app/assets/styles/plugins.less',
      'app/assets/styles/app.less'
    ])
    .pipe($.debug())
    .pipe($.plumber({
        errorHandler: function (err) {
            console.log(err);
            this.emit('end');
        }
    }))
    .pipe($.fileInclude({
      prefix: '@@',
      basepath: '@file'
    }))
    // .pipe($.sourcemaps.init())
    .pipe($.less())
    .pipe($.postcss([
      require('autoprefixer-core')({browsers: ['last 1 version']})
    ]))
    // .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(reload({stream: true})); 
});


gulp.task('bs-styles', function () {

  return gulp.src('app/styles/bootstrap.less')
    .pipe($.debug())
    .pipe($.plumber({
        errorHandler: function (err) {
            console.log(err);
            this.emit('end');
        }
    }))
    // .pipe($.sourcemaps.init())
    .pipe($.less())
    .pipe($.postcss([
      require('autoprefixer-core')({browsers: ['last 1 version']})
    ]))
    .pipe($.replace(/\./g, '.sgtb-'))
    .pipe($.replace(/\.sgtb-active/g, '.active'))
    .pipe($.replace(/\.sgtb-caret/g, '.caret'))
    .pipe($.replace(/\.sgtb-top/g, '.top'))
    .pipe($.replace(/\.sgtb-bottom/g, '.bottom'))
    .pipe($.replace(/\.sgtb-left/g, '.left'))
    .pipe($.replace(/\.sgtb-right/g, '.right'))
    .pipe($.replace(/\.sgtb-3/g, '.3'))
    .pipe($.replace(/\.sgtb-6/g, '.6'))
    // .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(reload({stream: true})); 
});

gulp.task('jshint', function () {
  return gulp.src('app/assets/scripts/**/*.js')
    .pipe(reload({stream: true, once: true}))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});


gulp.task('scripts', function () {
  return gulp.src([
      'app/assets/scripts/vendors.js', 
      'app/assets/scripts/plugins.js', 
      'app/assets/scripts/app.js', 
      'app/assets/scripts/form.js', 
      'app/assets/scripts/fonts.js', 
    ])
    .pipe($.debug())
    .pipe($.plumber({
        errorHandler: function (err) {
            console.log(err);
            this.emit('end');
        }
    }))
    .pipe($.fileInclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe($.uglify())
    .pipe($.rename(function(path){
      path.extname = ".min.js";
    }))
    .pipe(gulp.dest('.tmp/scripts')); 
});


gulp.task('html', ['styles', 'bs-styles'], function () {
  var assets = $.useref.assets({searchPath: ['.tmp', 'app', '.']});

  return gulp.src('app/*.html')
    .pipe($.debug())
    .pipe($.plumber({
        errorHandler: function (err) {
            console.log(err);
            this.emit('end');
        }
    }))
    .pipe(assets)
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.csso()))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest('dist'));
});

gulp.task('html-tmp', function () {

  return gulp.src('app/index.html')
    .pipe($.debug())
    .pipe($.plumber({
        errorHandler: function (err) {
            console.log(err);
            this.emit('end');
        }
    }))
    .pipe($.fileInclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('.tmp'));
});

gulp.task('images', function () {
  return gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    })))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function () {
  return gulp.src(require('main-bower-files')({
    filter: '**/*.{eot,svg,ttf,woff,woff2}'
  }).concat('app/fonts/**/*'))
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', function () {
  return gulp.src([
    'app/*.*',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('clean', require('del').bind(null, ['.tmp', 'dist']));

// build auto reload webserver
gulp.task('serve', ['html-tmp', 'styles', 'bs-styles', 'scripts', 'fonts'], function () {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  // watch for changes
  gulp.watch([
    'app/*.html',
    'app/assets/scripts/**/*.js',
    'app/assets/styles/**/*.{less,css}',
    'app/assets/images/**/*',
    'app/vendors/**/*',
    '.tmp/fonts/**/*'
  ]).on('change', reload);

  gulp.watch('app/assets/styles/**/*.{less,css}', ['styles', 'bs-styles']);
  gulp.watch('app/assets/scripts/**/*.js', ['scripts']);
  gulp.watch('app/fonts/**/*', ['fonts']);
  gulp.watch('app/vendors/**/*', ['styles', 'scripts']);
  gulp.watch('app/*.html', ['html-tmp']);
  gulp.watch('bower.json', ['fonts']);
});


gulp.task('build', ['jshint', 'html', 'images', 'fonts', 'extras'], function () {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], function () {
  gulp.start('build');
});
