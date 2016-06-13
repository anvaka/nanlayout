var grid = require('../perf/grid.js');
var path = require('path');
var fs = require('fs');
var Canvas = require('canvas');

var graph = grid(20, 20);
var layout = require('../')(graph.getNativeGraph(), 2);

for (var i = 0; i < 300; ++i) {
  layout.step();
}

var rect = layout.getGraphRect();

var width = rect.max[0] - rect.min[0] + 50;
var height = rect.max[1] - rect.min[1] + 50;
var canvas = new Canvas(width, height, 'svg');

var ctx = canvas.getContext('2d');

//
graph.forEachNode(function (node) {
  var pos = layout.getNodePosition(node.id);
  var x = pos[0] - rect.min[0];
  var y = pos[1] - rect.min[1];
  ctx.strokeRect(x - 5, y - 5, 10, 10);
  ctx.strokeText(node.id, x, y )
});

fs.writeFile('out.svg', canvas.toBuffer());
