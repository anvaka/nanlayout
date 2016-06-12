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

var width = rect.x2 - rect.x1 + 50;
var height = rect.y2 - rect.y1 + 50;
var canvas = new Canvas(width, height, 'svg');

var ctx = canvas.getContext('2d');

//
graph.forEachNode(function (node) {
  var pos = layout.getNodePosition(node.id);
  console.log(pos);
  var x = pos.x - rect.x1;
  var y = pos.y - rect.y1;
  ctx.strokeRect(x - 5, y - 5, 10, 10);
  ctx.strokeText(node.id, x, y )
});

fs.writeFile('out.svg', canvas.toBuffer());
