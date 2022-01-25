var gulp = require('gulp');
var gulpSequence = require('gulp-sequence');
var path = require("path");
var fileinclude = require('gulp-file-include');
var revCollector = require('gulp-rev-collector');
var sass = require('gulp-sass');
const env = process.env.NODE_ENV;
var devConfig = require('./pack/dev/config')
var getSteps = require('./pack/step')


gulp.task('dev_build', function () {
  console.log('---------------开发---------------')
  gulp.src(['./src/views/pages/**'])
    .pipe(fileinclude({
      prefix: '@@',
      indent: true,
      // 部件路径
      basepath: './src/views/partials/',
      context: devConfig
    }))
    .pipe(revCollector({
      replaceReved: true
    }))
    .pipe(gulp.dest('./build'))
})

/**
 * sass 转换
 * */
gulp.task('sass', function () {
  if (env === 'dev') {
    gulp.src(["./src/static/sass/**.scss", "./src/static/sass/**/**.scss"])
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('./src/static/css'));
  } else {
    gulp.src(["./src/static/sass/**.scss", "./src/static/sass/**/**.scss"])
      .pipe(sass().on('error', sass.logError))
      .pipe(cleanCSS({compatibility: 'ie8'}))
      .pipe(gulp.dest('./src/static/css'));
  }
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      console.log("---------------sass转换---------------");
      resolve();
    }, 1000);
  });
});

+function (prjname) {
  // 移动文件到相应位置的task
  let len = getSteps()

  gulp.task('config_dev_app', function () {
    gulp.src(['./config/dev/**']).pipe(gulp.dest(path.resolve('./src/static/js/common')))
    return true
  })
  // 开发
  gulp.task('dev-dist', gulpSequence('config_dev_app', 'dev_build', 'sass', ['kf-dist-' + (len - 1)]))
}()
