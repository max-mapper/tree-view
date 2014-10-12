var document = require('global/document')
var hg = require('mercury')
var h = require('mercury').h
var observify = require('observify')
var path = require('path')

module.exports = function(data) {
  function TreeView() {
    var state = observify(data)
    return state
  }

  TreeView.render = function render(state) {
    return renderTree(state)
  }
  
  hg.app(document.body, TreeView(), TreeView.render)
  
  function renderTree(obj) {
    return h('div.t-tree-container',
      h('ul', obj['/'].map(function(child) {
        if (child.type === 'file') return renderFile(child)
        if (child.type === 'directory') return renderDirectory(child.path)
      }))
    )
  }

  function renderFile(obj) {
    return h('li', [
      h('span.t-tree-icon#t-tree-expanded'),
      h('span.t-tree-label', path.basename(obj.path))
    ])
  }

  function renderDirectory(dirPath) {
    var obj = data[dirPath]
    if (!obj) obj = []
    var children = obj.map(function(child) {
      if (child.type === 'file') return renderFile(child)
      if (child.type === 'directory') return renderDirectory(child.path)
    })
    return h('li', [
      h('span.t-tree-icon#t-tree-expanded'),
      h('span.t-tree-label', path.basename(dirPath)),
      h('ul', children)
    ])
  }
}
