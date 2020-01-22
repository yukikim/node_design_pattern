"use strict";

const request = require('request');

function getPageHtml(url) {
  return new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
      if(error) {
        return reject('エラー発生です\n' + error)
      }
      resolve(body);
    });
  });
}

//todo: asyncキーワードを付与することで非同期処理でawaitが使われる可能性を明示する
async function main() {
    //todo: awaitは次の行を実行する前にgetPageHtmlが非同期で返すresolveを待つ
  const html = await getPageHtml('http://google.com');
  //todo: 変数htmlに結果とともにresolveまたはrejectが格納される
  console.log(html);
}

main();
console.log('Loading...');