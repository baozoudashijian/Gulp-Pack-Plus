var gulp = require('gulp');
var gulpSequence = require('gulp-sequence');
var path = require("path");
var fileinclude = require('gulp-file-include');
var revCollector = require('gulp-rev-collector');
var sass = require('gulp-sass');
var verNum = '20190513';
const env = process.env.NODE_ENV;


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
  console.log('---------------开发---------------')
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
  var templates = path.resolve(prjname, '../../../templates');
  var prjStatic = path.resolve(prjname, '../../static');


  var commonSteps = [
    /* 拷贝静态资源 */
    function () {
      console.log(1)
      return gulp.src(['src/static/**', '!src/static/js/common/app.js']).pipe(gulp.dest(path.resolve(prjStatic)));
    },
    /* 拷贝页面 */
    function () {
      console.log(2)
      return gulp.src(['./build/**.html']).pipe(gulp.dest(path.resolve(templates)));
    },
    function () {
      console.log(3)
      return gulp.src(['./build/errors/**']).pipe(gulp.dest(path.resolve(templates, './errors')));
    },
  ];

  // 开发所有步骤
  var devSteps = commonSteps.concat([
    function () {
      return gulp.src(['./config/dev/**']).pipe(gulp.dest(path.resolve('./src/static/js/common')));
    }
  ]);

  var stepFun = function (i, list) {
    if (i < 0) {
      return list.length;
    }
    return list[i];
  }
  var devfn = stepFun(-1, devSteps)

  var getStep = function (num, name, list) {
    gulp.task(`${name}0`, stepFun(0, list));
    for (var k = 1; k < num; k++) {
      gulp.task(`${name}${k}`, [`${name}${(k - 1)}`], stepFun(k, list));
    }
  }


  getStep(devfn, 'kf-dist-', devSteps)


  gulp.task('config_dev_app', function () {
    gulp.src(['./config/dev/**']).pipe(gulp.dest(path.resolve('./src/static/js/common')))
    return true
  })
  console.log('kf-dist-' + (devfn - 1));
  // 开发
  gulp.task('dev-dist', gulpSequence('config_dev_app', 'dev_build', 'sass', ['kf-dist-' + (devfn - 1)]))
}(path.basename(__dirname))
