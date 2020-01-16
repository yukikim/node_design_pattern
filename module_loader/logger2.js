//モジュール(logger2.js)
module.exports = (message) => {
    console.log(`概要 : ${message}`);
}
module.exports.verbose = (message) => {
    console.log(`詳細 : ${message}`);
}
