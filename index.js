var path = require('path')
var react = require('react')
var events = require('events')
var fs = require('fs')
var defaultcss = require('defaultcss')
var DOM = react.DOM

var CHEVRON_RIGHT = fs.readFileSync(__dirname+'/images/chevron-right.png', 'base64')
var CHEVRON_DOWN = fs.readFileSync(__dirname+'/images/chevron-down.png', 'base64')
var FOLDER = fs.readFileSync(__dirname+'/images/folder.png', 'base64')
var FILE = fs.readFileSync(__dirname+'/images/file.png', 'base64')
var STYLE = fs.readFileSync(__dirname+'/style.css', 'utf-8')

STYLE = STYLE
  .replace(/images\/file.png/g, 'data:image/png;base64,'+FILE)
  .replace(/images\/folder.png/g, 'data:image/png;base64,'+FOLDER)
  .replace(/images\/chevron-right.png/g, 'data:image/png;base64,'+CHEVRON_RIGHT)
  .replace(/images\/chevron-down.png/g, 'data:image/png;base64,'+CHEVRON_DOWN)

var Browser = react.createClass({
  getInitialState: function() {
    return {root:{}}
  },
  renderDirectory: function(dir, indent) {
    var self = this
    var entries = this.state.root[dir]

    if (!entries) return DOM.ul(null)

    var list = entries.map(function(e) {
      var name = path.basename(e.path)
      var open = self.state.root[e.path]

      var onclick = function() {
        self.setState({selected:e.path})
        if (e.type !== 'directory') return self.props.onfile(e)
        if (open) self.props.onclose(e)
        else self.props.onopen(e)
      }

      var selected = e.path === self.state.selected ? ' selected' : ''
      var item = DOM.div({className:'list-item', onClick:onclick}, DOM.span({className:'name'}, name))

      if (e.type !== 'directory') return DOM.li({key:e.path, className:'entry file'+selected}, item)
      if (!open) return DOM.li({key:e.path, className:'entry directory closed'+selected}, item)
      return DOM.li({key:e.path, className:'entry directory open'+selected}, item, self.renderDirectory(e.path))
    })

    return DOM.ul(null, list)
  },
  render: function() {
    return DOM.div({className:'tree-view'},
      this.renderDirectory('/', 0)
    )
  }
})

module.exports = function(opts) {
  if (!opts) opts = {}

  var that = new events.EventEmitter()
  var root = {}
  var comp

  var onfile = function(e) {
    that.emit('file', e.path, e)
  }

  var onopen = function(e) {
    that.emit('directory', e.path, e)
  }

  var onclose = function(e) {
    root[e.path] = null
    Object.keys(root).forEach(function(p) {
      if (path.join(p, '/').indexOf(path.join(e.path, '/')) === 0) root[p] = null
    })
    if (comp) comp.setState({root:root})
  }

  that.style = STYLE

  that.directory = function(cwd, entries) {
    root[cwd] = entries
    if (comp) comp.setState({root:root})
  }

  that.appendTo = function(el) {
    if (typeof el === 'string') el = document.querySelector(el)
    if (opts.style !== false) defaultcss('tree-view', STYLE)
    comp = react.renderComponent(Browser({onopen:onopen, onclose:onclose, onfile:onfile}), el)
    comp.setState({root:root})
  }

  return that
}