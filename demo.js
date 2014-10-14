var tree = require('./')
var path = require('path')

var browser = tree()

browser.on('directory', function(p, entry) {
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
