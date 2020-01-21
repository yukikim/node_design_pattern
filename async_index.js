"use strict";

const request = require('request');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const async = require('async'); //todo:asyncライブラリの読み込み
const utilities = require('./utilities');

/**
 * todo:ページ中のリンク取得の逐次処理パターン
 * @param currentUrl //todo:リンクを取得する対象URL
 * @param body //todo:取得した要素
 * @param nesting //todo:取得するリンクの階層数
 * @param callback
 * @returns {*}
 */
function spiderLinks(currentUrl, body, nesting, callback) {
  if(nesting === 0) {
    return process.nextTick(callback); //todo:process.nextTick()はイベントループ最初の処理
  }
  let links = utilities.getPageLinks(currentUrl, body);  //todo:ページに含まれるリンクの配列を取得する

  function iterate(index) { //todo:渡された引数が配列の数と同じだったら関数を抜ける
    if(index === links.length) {
      return callback();
    }

    spider(links[index], nesting - 1, function(err) { //todo:spider()を再起的呼出し、その際にリンク階層を一つ減らす
      if(err) {
        return callback(err);
      }
      iterate(index + 1);
    });
  }
  iterate(0); //todo:リンクが0なら抜ける
}

function saveFile(filename, contents, callback) {
  mkdirp(path.dirname(filename), err => {
    if(err) {
      return callback(err);
    }
    fs.writeFile(filename, contents, callback);
  });
}

// #@@range_begin(list1)
/**
 * async.series(tasks, [callback])について
 * 引数のtasksはタスクが記憶された配列
 * callbackは全てのタスク完了時に呼び出される関数
 *
 * @param url
 * @param filename
 * @param callback
 */
function download(url, filename, callback) {
  console.log(`Downloading ${url}`);
  let body;

  async.series([
      //todo:urlダウンロードしてレスは変数bodyに入れる
    callback => {                              // todo:外側のcallback隠蔽している
      request(url, (err, response, resBody) => {
        if(err) {
          return callback(err);
        }
        body = resBody;
        callback();
      });
    },

      //todo:ファイルを保存するディレクトリを作成する
    mkdirp.bind(null, path.dirname(filename)),

      //todo:先のタスクで取得したbodyをファイルに書き込む
    callback => {                              // todo:外側のcallback隠蔽している
      fs.writeFile(filename, body, callback);
    }
  ], err => { //todo:上記全てのタスクが終了したら呼出される関数
    if(err) {
      return callback(err);
    }
    console.log(`Downloaded and saved: ${url}`);
    callback(null, body);
  });
}
// #@@range_end(list1)

function spider(url, nesting, callback) {
  const filename = utilities.urlToFilename(url);
  fs.readFile(filename, 'utf8', function(err, body) {
    if(err) {
      if(err.code !== 'ENOENT') {
        return callback(err);
      }

      return download(url, filename, function(err, body) {
        if(err) {
          return callback(err);
        }
        spiderLinks(url, body, nesting, callback);
      });
    }

    spiderLinks(url, body, nesting, callback);
  });
}

spider(process.argv[2], 1, (err) => {
  if(err) {
    console.log(err);
    process.exit();
  } else {
    console.log('Download complete');
  }
});