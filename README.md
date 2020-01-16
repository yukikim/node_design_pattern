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
### 解決策
fs.readFile()の代わりにfs.readFileSync()を使う  
callback_sync.js(コールバックを使わなくてもよい)
