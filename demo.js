var tree = require('./')
var fs = require('fs')

var data = {
  '/': [{
    path: '/foo',
    type: 'directory'
  }],
  '/foo': [{
    path: '/foo/bar',
    type: 'directory'
  }],
  '/foo/bar': [{
    path: '/foo/bar/baz',
    type: 'directory'
  }, {
    path: '/foo/bar/test.js',
    type: 'file'
  }]
}

tree(data)
