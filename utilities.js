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

module.exports.getLinkUrl = function getLinkUrl(currentUrl, element) {
  const link = urlResolve(currentUrl, element.attribs.href || "");
  const parsedLink = urlParse(link);
  const currentParsedUrl = urlParse(currentUrl);
  if(parsedLink.hostname !== currentParsedUrl.hostname
    || !parsedLink.pathname) {
    return null;
  }
  return link;
};

module.exports.getPageLinks = function getPageLinks(currentUrl, body) {
  return [].slice.call(cheerio.load(body)('a'))
    .map(function(element) {
      return module.exports.getLinkUrl(currentUrl, element);
    })
    .filter(function(element) {
      return !!element;
    });
};