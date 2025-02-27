const path = require('path');
const ejs = require('ejs');

ejs.fileLoader = function (filePath) {
  return require('fs').readFileSync(path.join(__dirname, 'views', filePath), 'utf8');
};