module.exports = createLayout;

var Layout = require('bindings')('nanlayout').Layout;

function createLayout(graph) {
  var layout = new Layout(graph, 'foo');
  return layout;
}
