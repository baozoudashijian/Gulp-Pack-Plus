var gulp = require('gulp');
var gulpSequence = require('gulp-sequence');
var path = require("path");
var fileinclude = require('gulp-file-include');
var revCollector = require('gulp-rev-collector');
var verNum = '20190513';


gulp.task('config_dev_app', function () {
  gulp.src(['./config/dev/**']).pipe(gulp.dest(path.resolve('./src/static/js/common')))
  return true
})

const deploy = {
  title: "CSDN - 专业开发者社区",
  description: "CSDN是全球知名中文IT技术交流平台,创建于1999年,包含原创博客、精品问答、职业培训、技术论坛、资源下载等产品服务,提供原创、优质、完整内容的专业IT技术开发社区.",
  author: "CSDN",
  keyword: "CSDN博客,CSDN学院,CSDN论坛,CSDN直播",
  shareLib: '//www.csdn.net/pc/lib',
  base: '//www.csdn.net/pc',
  lib: '//www.csdn.net/pc/lib',
  js: '//www.csdn.net/pc/js',
  img: '//www.csdn.net/pc/img',
  imgStoreUrl: '//www.csdn.net/meadincms/',
  realName: 'https://www.csdn.net',
  noTop: 'no-topheight',
  version: verNum
}

gulp.task('dev_build', function () {
  console.log('------开发------')
  gulp.src(['./src/views/pages/**'])
    .pipe(fileinclude({
      prefix: '@@',
      indent: true,
      // 部件路径
      basepath: './src/views/partials/',
      context: {
        ...deploy,
        base: '/static',
        lib: '/static/lib',
        js: '/static/js',
        img: '/static/img',
        imgStoreUrl: 'https://img-md.veimg.cn/meadin/',
        realName: 'http://localhost:5480',
        noTop: 'no-topheight',
        version: verNum
      }
    }))
    .pipe(revCollector({
      replaceReved: true
    }))
    .pipe(gulp.dest('./build'))
})


// 开发
gulp.task('dev-dist', gulpSequence('config_dev_app', 'dev_build'))