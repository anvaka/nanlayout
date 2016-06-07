var createGraph = require('nangraph');

module.exports = grid;

function grid(n, m) {
/**
 * Grid graph with n rows and m columns.
 *
 * @param {Number} n of rows in the graph.
 * @param {Number} m of columns in the graph.
 */
  if (n < 1 || m < 1) {
    throw new Error("Invalid number of nodes in grid graph");
  }
  var g = createGraph(),
      i,
      j;
  if (n === 1 && m === 1) {
    g.addNode(0);
    return g;
  }

  for (i = 0; i < n; ++i) {
    for (j = 0; j < m; ++j) {
      var node = i + j * n;
      if (i > 0) { g.addLink(node, i - 1 + j * n); }
      if (j > 0) { g.addLink(node, i + (j - 1) * n); }
    }
  }

  return g;
}
