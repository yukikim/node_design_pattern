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