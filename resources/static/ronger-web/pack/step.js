var path = require("path");
var gulp = require('gulp');
const env = process.env.NODE_ENV;

var templates = path.resolve(path.basename(__dirname), '../../../../templates');
var prjStatic = path.resolve(path.basename(__dirname), '../../../static');

var commonSteps = [
  /* 拷贝静态资源 */
  function () {
    return gulp.src(['../src/static/**', '!../src/static/js/common/app.js']).pipe(gulp.dest(path.resolve(prjStatic)));
  },
  /* 拷贝页面 */
  function () {
    return gulp.src(['../build/**.html']).pipe(gulp.dest(path.resolve(templates)));
  },
  function () {
    return gulp.src(['../build/errors/**']).pipe(gulp.dest(path.resolve(templates, './errors')));
  }
];

// 开发所有步骤
var devSteps = commonSteps.concat([
  function () {
    return gulp.src(['./config/dev/**']).pipe(gulp.dest(path.resolve('./src/static/js/common')));
  }
]);

// 循环依次给这些任务 “顺藤摸瓜” 式调用
var getStep = function (num, name, list) {
  gulp.task(`${name}0`, list[0]);
  for (var k = 1; k < num; k++) {
    gulp.task(`${name}${k}`, [`${name}${(k - 1)}`], list[k]);
  }
}

var steps = function () {
  getStep(devSteps.length, 'kf-dist-', devSteps)

  return devSteps.length
}

module.exports = steps