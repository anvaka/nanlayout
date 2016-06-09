var grid = require('../perf/grid.js');
var path = require('path');
var fs = require('fs');
var Canvas = require('canvas');

var graph = grid(20, 20);
var layout = require('../')(graph.getNativeGraph());

for (var i = 0; i < 3000; ++i) {
  layout.step();
}

var rect = layout.getGraphRect();

var width = rect.x2 - rect.x1 + 50;
var height = rect.y2 - rect.y1 + 50;
var canvas = new Canvas(width, height, 'svg');

var ctx = canvas.getContext('2d');

//
graph.forEachNode(function (node) {
  var pos = layout.getNodePosition(node.id);
  var x = pos.x - rect.x1;
  var y = pos.z - rect.z1;
  ctx.strokeRect(x - 5, y - 5, 10, 10);
  ctx.strokeText(node.id, x, y )
});

fs.writeFile('out.svg', canvas.toBuffer());
