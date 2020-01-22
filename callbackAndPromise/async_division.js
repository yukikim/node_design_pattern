"use strict";

// #@@range_begin(list1)
module.exports = function asyncDivision (dividend, divisor, cb) {
  return new Promise((resolve, reject) => {  // todo:Promiseコンストラクタを返す

    process.nextTick(() => {
      const result = dividend / divisor;
      if (isNaN(result) || !Number.isFinite(result)) {
        const error = new Error('Invalid operands');
        if (cb) { cb(error); }  // todo:エラーをrejectするとともにコールバック(cd)も通知する
        return reject(error);
      }

      if (cb) { cb(null, result); }  // todo:結果をresolveするとともにコールバック(cd)も通知する
      resolve(result);
    });

  });
};
// #@@range_end(list1)