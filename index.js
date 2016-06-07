module.exports = createLayout;

var Layout = require('bindings')('nanlayout').Layout;

function createLayout(graph) {
  return new Layout(graph);
}
