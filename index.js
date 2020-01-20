const request = require('request')
const fs = require('fs')
const mkdirp = require('mkdirp')
const path = require('path')
const utilitise = require('./utilities')

function spider(url, callback) {
    const filename = utilitise.urlToFilename(url)
    fs.exists(filename, exists => { //todo:すでにダウンロード済かチェックする
        if(!exists) { //todo:まだダウンロードしていなかったら
            console.log('Downloading ' + url)
            request(url, (err, response, body) => { //todo:ダウンロードする
                if(err) {
                    callback(err)
                }else {
                    mkdirp(path.dirname(filename), err => { //todo:ファイル保存のためのディレクトリを作成する
                        if(err) {
                            callback(err)
                        }else {
                            fs.writeFile(filename, body, err => { //todo:urlをファイルに保存する
                                if(err) {
                                    callback(err)
                                }else {
                                    callback(null, filename, true)
                                }
                            })
                        }
                    })
                }
            })
        }else {
            callback(null, filename, false)
        }
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