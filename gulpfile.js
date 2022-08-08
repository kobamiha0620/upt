//----------------------------------------------------------------------
//  モード
//----------------------------------------------------------------------
"use strict";

//----------------------------------------------------------------------
//  モジュール読み込み
//----------------------------------------------------------------------
const gulp = require("gulp");
const { src, dest, watch, series, parallel } = require("gulp");

const plumber = require("gulp-plumber");
const sassGlob = require("gulp-sass-glob-use-forward");
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require("gulp-autoprefixer");

const purgecss = require("gulp-purgecss");
const cleancss = require("gulp-clean-css");

const bs = require("browser-sync");
//----------------------------------------------------------------------
//  関数定義
//----------------------------------------------------------------------
function compile(done) {
    src("./src/sass/**/*.scss")
      .pipe(plumber())                   // watch中にエラーが発生してもwatchが止まらないようにする
      .pipe(sassGlob())                  // glob機能を使って@useや@forwardを省略する
      .pipe(sass())                      // sassのコンパイルをする
      .pipe(autoprefixer())              // ベンダープレフィックスを自動付与する
      .pipe(dest("./css/"));
  
    done();
  }
  function sasswatch(done){

  }
  function minify(done) {
    src("./css/*.css")
      .pipe(plumber())                              // watch中にエラーが発生してもwatchが止まらないようにする
      .pipe(purgecss({
        content: ["./*.html","./**/*.js"],  // src()のファイルで使用される可能性のあるファイルを全て指定
      }))
      .pipe(cleancss())                             // コード内の不要な改行やインデントを削除
      .pipe(dest("./css/"));
  
    done();
  }
  


  function bsInit(done) {
    bs.init({
      index : "index.html",
      server: true,
    });
    done();
  }
  
  function bsReload(done) {
    bs.reload();
  
    done();
  }
  
//   function watchTask(done) {
//     watch(["./**", "!./*.css"], series(bsReload));    //	監視対象とするパスはお好みで
//     watch(['./srcsass/**/*.scss'], series(compile));

//   }"../assets/css/
  const watchTask = (done) => {
	watch(["./**", "!./css/style.css"], series(compile, bsReload));

	done();
};

//----------------------------------------------------------------------
//  タスク定義
//----------------------------------------------------------------------
exports.compile = series(compile, watchTask);
exports.minify = series(minify);
exports.bs = series(bsInit, bsReload, watchTask);
