module.exports = createLayout;

var Layout = require('bindings')('nanlayout').Layout;

function createLayout(graph, dimension) {
  return new Layout(graph, dimension);
}
