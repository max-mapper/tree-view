var fs = require('fs')

var CHEVRON_RIGHT = fs.readFileSync(__dirname+'/images/chevron-right.png', 'base64')
var CHEVRON_DOWN = fs.readFileSync(__dirname+'/images/chevron-down.png', 'base64')
var FOLDER = fs.readFileSync(__dirname+'/images/folder.png', 'base64')
var FILE = fs.readFileSync(__dirname+'/images/file.png', 'base64')

module.exports = fs.readFileSync(__dirname+'/style.css', 'utf-8')
  .replace(/images\/file.png/g, 'data:image/png;base64,'+FILE)
  .replace(/images\/folder.png/g, 'data:image/png;base64,'+FOLDER)
  .replace(/images\/chevron-right.png/g, 'data:image/png;base64,'+CHEVRON_RIGHT)
  .replace(/images\/chevron-down.png/g, 'data:image/png;base64,'+CHEVRON_DOWN)  
