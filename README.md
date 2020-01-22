# Node.js Design Pattern

- コードの整理・構成
- ベストな設計
- アプリのモジュール性
- 複数の非同期呼び出し処理
- 大規模開発

以上を正しく処理するには

*サンプルコードダウンロード*  
[Sample Code](http://github.com/mushahiroyuki/ndp2)

## コールバックパターン
同期プログラミングにおけるreturn文のかわりにコールバックを使う

コールバック関数とはある関数の結果を通知するために起動される関数のこと

    function add(a, b, callback) {
      callback(a + b);
    }

    console.log('before');
    add(1, 2, result => console.log('Result: ' + result));
    console.log('after');

関数add()はコールバックの呼び出しが終わるまで次に進まないので結果は

    before
    Result: 3
    after

### 非同期CPS(継続渡し)関数

    "use strict";

    function additionAsync(a, b, callback) {
      setTimeout(() => callback(a + b), 100);
    }

    console.log('before');
    additionAsync(1, 2, result => console.log('Result: ' + result));
    console.log('after');

コールバック関数のsetTimeout()を待たずにコンソールを処理する(ノンブロッキング)ので結果は

    before
    after
    Result: 3

### 同期と非同期の混在
callback_patt03.js

上記コードではreader2生成時はキャッシュが存在しているので同期的に即実行されるが  
その後で非同期処理にてonDataReadyに登録しているのでlistener関数は呼び出されない。  
結果は

    First call data: some data

**上記の様な関数は結果を予測できないのでバグの原因かつバグを特定出来ない**
#### 解決策
fs.readFile()の代わりにfs.readFileSync()を使う  
callback_sync.js(コールバックを使わなくてもよい)

**しかし同期関数は他のリクエストに処理待ちを強いるため全体の動作が遅くなる**

入力したデータをキャッシュする場合は次回処理が早いので同期関数(DS)であっても  
パフォーマンスに影響は少ないのでその様な場合は同期処理でもよい。  
たとえば、初期値を読み込むなど・・・使い所によってはDSのほうがわかり易いプログラムになりえる。

#### 強制的に非同期処理
process.nextTick()を使ってどのような条件下でも非同期にする  
callback_deferred_execution.js

### 非同期CPSでのエラー伝播

    const fs = require('fs');
    function readJSON(filename, callback) {
      fs.readFile(filename, 'utf8', (err, data) => {
        let parsed;
        if(err)
        //propagate the error and exit the current function
          return callback(err);

        try {
          //parse the file contents
          parsed = JSON.parse(data);
        } catch(err) {
          //catch parsing errors
          return callback(err);
        }
        //no errors, propagate just the data
        callback(null, parsed);
      });
    }

    let cb = (err, data) => {
      if (err) {
        return console.error(err);
      }

      console.log(data)
    };

    readJSON('valid_json.json', cb); // dumps the content
    readJSON('invalid_json.json', cb); // prints error (SyntaxError)

成功時のコールバックでは先頭の引数にnullを渡し、失敗時の引数はエラーオブジェクトだけ渡し、returnで関数を抜ける

## モジュールシステム
### 一般的な公開モジュールパターン

    //モジュール(logger.js)
    exports.info = (message) => {
        console.log('概要' + message);
    };
    exports.verbose = (message) => {
        console.log('詳細' + message);
    };

    //モジュール呼び出し(main.js)
    const logger = require('./logger');
    logger.info('一般情報メッセージ);
    logger.verbose('詳細情報メッセージ);

### 関数エクスポート(substackパターン)

    //モジュール(logger2.js)
    module.exports = (message) => {
        console.log(`概要 : ${message}`);
    }
    module.exports.verbose = (message) => {
        console.log(`詳細 : ${message}`);
    }

    //モジュール呼び出し(main.js)
    const logger = require('./logger2');
    logger('一般情報メッセージ);
    logger.verbose('詳細情報メッセージ);

### コンストラクタのエクスポート
/module_loader/logger_class_main.js

## コールバック非同期パターン実装例
#### nodeライブラリ追加

**request**  
HTTPリクエストを簡単に記述するためのライブラリ

**mkdirp**  
ディレクトリを再帰的に作成するライブラリ

**slug**  
URL等の文字列をサニタイズする

### 独自モジュール追加
**[utilities.js](https://github.com/yukikim/node_design_pattern/blob/master/utilities.js)**
#### アプリケーションファイル
[index.js](https://github.com/yukikim/node_design_pattern/blob/master/index.js)  
このコードは**コールバック地獄**と呼ばれています。
### コールバック地獄の回避
- クロージャを乱用しない
- if文にelseを書かずにreturnで(またはcontinue,breakで)なるべく早く抜ける
- コールバックをインラインではなく関数として定義し、必要なデータを引数として渡してクロージャを使わない
- 複数の関数に分割する

基本原則を適用してindex.jsを修正する  

    if(err) {
        callback(err)
    }else {
        //todo:エラーが無かったときの処理
    }

上記コードを次のように修正する

    if(err) {
        return callback(err)
    }
    //todo:エラーが無かったときの処理

上記に修正することでネストが一段浅くなる

#### 上記index.jsを複数の関数に分割する
**[index2.js](https://github.com/yukikim/node_design_pattern/blob/master/index2.js)**

## 非同期パターン(asyncライブラリ)
### 逐次処理
asyncライブラリのインストール

    $ npm install async

asyncライブラリの**async.series()**を使った実装例  
**[async_index.js](https://github.com/yukikim/node_design_pattern/blob/master/async_index.js)**

#### 配列を走査して非同期処理をする
asyncライブラリーの**async.eachSeries()**を使う  
**[async_index2.js](https://github.com/yukikim/node_design_pattern/blob/master/async_index2.js)**

#### asyncライブラリで非同期を並列処理する
asyncライブラリーの**async.each()**を使う  
**[async_index3.js](https://github.com/yukikim/node_design_pattern/blob/master/async_index3.js)**

#### asyncライブラリで同時実行数を制限した並列処理パターン
asyncライブラリーの**async.queue()**を使う  
**[async_index4.js](https://github.com/yukikim/node_design_pattern/blob/master/async_index4.js)**



