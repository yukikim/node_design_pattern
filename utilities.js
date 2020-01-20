"use strict";

const urlParse = require('url').parse;
const slug = require('slug');
const path = require('path');
/**
 * urlをhttp://等を削除して文字列として取り出す
 * @param url
 * @returns {string}
 */
module.exports.urlToFilename = function urlToFilename(url) {
  const parsedUrl = urlParse(url);
  const urlPath = parsedUrl.path.split('/')
    .filter(function(component) {
      return component !== '';
    })
    .map(function(component) {
      return slug(component, { remove: null });
    })
    .join('/');
  let filename = path.join(parsedUrl.hostname, urlPath);
  if(!path.extname(filename).match(/htm/)) {
    filename += '.html';
  }
  return filename;
};