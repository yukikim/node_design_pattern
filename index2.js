/**
 * このコードは所謂コールバック地獄の例です
 * @type {request}
 */

const request = require('request')
const fs = require('fs')
const mkdirp = require('mkdirp')
const path = require('path')
const utilitise = require('./utilities')

//todo:ファイルを書き込み保存する関数を作成する
function saveFile(filename, contents, callback) {
    mkdirp(path.dirname(filename), err => { //todo:ファイル保存のためのディレクトリを作成する
        if (err) {
            return callback(err)
        }
        fs.writeFile(filename, contents, callback)
    })
}

//todo:ファイルをダウンロードして上記関数を使って保存する
function download(url, filename, callback) {
    console.log(`Downloading ${url}`)
    request(url, (err, response, body) => {
        if(err) {
            return callback(err)
        }
        saveFile(filename, body, err => {
            if(err) {
                return callback(err)
            }
            console.log(`Downloaded and saved: ${url}`)
            callback(null, body)
        })
    })
}


//todo:上記関数を実行してファイル名を返す
function spider(url, callback) {
    const filename = utilitise.urlToFilename(url)
    fs.exists(filename, exists => {
        if(exists) {
            return callback(null, filename, false)
        }
        download(url, filename, err => {
            if(err) {
                return callback(err)
            }
            callback(null, filename, true)
        })
    })
}

const url = 'https://github.com/yukikim/node_design_pattern'

spider(url, (err, filename, downloaded) => {
    if(err) {
        console.log(err)
    }else if(downloaded) {
        console.log(`Completed the download of "${filename}"`)

    }else {
        console.log(`"${filename}" was already downloaded`)
    }
})