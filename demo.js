var tree = require('./')
var path = require('path')

var browser = tree()

document.body.style.fontFamily = 'helvetica'

browser.on('directory', function(p, entry) {
  console.log('You clicked on a directory (%s)', p)
  browser.directory(p, [{
    path: path.join(p, '/foo'),
    type: 'directory'
  }, {
    path: path.join(p, '/bar'),
    type: 'directory'
  }, {
    path: path.join(p, '/baz'),
    type: 'file'
  }])
})

browser.on('file', function(p, entry) {
  console.log('You clicked on a file (%s)', p)
})

browser.appendTo(document.body)

browser.directory('/', [{
  path: '/foo',
  type: 'directory'
}, {
  path: '/bar',
  type: 'directory'
}, {
  path: '/baz',
  type: 'file'
}])
