var path = require('path')
var react = require('react')
var events = require('events')
var fs = require('fs')
var defaultcss = require('defaultcss')
var DOM = react.DOM

var style = fs.readFileSync(__dirname+'/style.css', 'utf-8')

var Browser = react.createClass({
  getInitialState: function() {
    return {}
  },
  renderDirectory: function(dir, indent) {
    var self = this
    var entries = this.state[dir]

    if (!entries) return DOM.ul(null)

    var list = entries.map(function(e) {
      var name = path.basename(e.path)

      var onfile = function() {
        self.props.onfile(e)
      }

      if (e.type !== 'directory') return DOM.li({key:e.path}, DOM.span({className:'entry file', onClick:onfile}, name))

      var open = self.state[e.path]

      var onclick = function() {
        if (open) self.props.onclose(e)
        else self.props.onopen(e)
      }

      if (!open) return DOM.li({key:e.path}, DOM.span({className:'entry directory closed', onClick:onclick}, name))

      return DOM.li({key:e.path},
        DOM.span({className:'entry directory opened', onClick:onclick}, name),
        self.renderDirectory(e.path)
      )
    })

    return DOM.ul(null, list)
  },
  render: function() {
    return DOM.div({className:'tree-view'}, this.renderDirectory('/', 0))
  }
})

module.exports = function(opts) {
  if (!opts) opts = {}

  var that = new events.EventEmitter()
  var state = {}
  var comp

  var onfile = function(e) {
    that.emit('file', e.path, e)
  }

  var onopen = function(e) {
    that.emit('directory', e.path, e)
  }

  var onclose = function(e) {
    state[e.path] = null
    Object.keys(state).forEach(function(p) {
      if (path.join(p, '/').indexOf(path.join(e.path, '/')) === 0) state[p] = null
    })
    if (comp) comp.setState(state)
  }

  that.style = style

  that.directory = function(cwd, entries) {
    state[cwd] = entries
    if (comp) comp.setState(state)
  }

  that.appendTo = function(el) {
    if (typeof el === 'string') el = document.querySelector(el)
    if (opts.style !== false) defaultcss('tree-view', style)
    comp = react.renderComponent(Browser({onopen:onopen, onclose:onclose, onfile:onfile}), el)
  }

  return that
}