var grid = require('../perf/grid.js');
var path = require('path');
var Canvas = require('canvas');
var fs = require('fs');

var graph = grid(2, 20);
var layout = require('../')(graph.getNativeGraph());

for (var i = 0; i < 1000; ++i) {
  layout.step();
}

var rect = layout.getGraphRect();
console.log(rect);
var width = rect.x2 - rect.x1 + 50;
var height = rect.y2 - rect.y1 + 50;
var canvas = new Canvas(width, height, 'svg');

var ctx = canvas.getContext('2d');

//
graph.forEachNode(function (node) {
  var pos = layout.getNodePosition(node.id);
  var x = pos.x - rect.x1;
  var y = pos.z - rect.z1;
  if (x - 5 < 0 || y -5 < 0 || x > width || y > height) {
    console.log(x, y);
  }
  ctx.strokeRect(x - 5, y - 5, 10, 10);
  ctx.strokeText(node.id, x, y )
});
//
// ctx.strokeRect(0, 0, 200, 200)
// ctx.lineTo(0, 100)
// ctx.lineTo(200, 100)
// ctx.stroke()
//
// ctx.beginPath()
// ctx.lineTo(100, 0)
// ctx.lineTo(100, 200)
// ctx.stroke()
//
// ctx.globalAlpha = 1
// ctx.font = 'normal 40px Impact, serif'
//
// ctx.rotate(0.5)
// ctx.translate(20, -40)
//
// ctx.lineWidth = 1
// ctx.strokeStyle = '#ddd'
// ctx.strokeText('Wahoo', 50, 100)
//
// ctx.fillStyle = '#000'
// ctx.fillText('Wahoo', 49, 99)
//
// var m = ctx.measureText('Wahoo')
//
// ctx.strokeStyle = '#f00'
//
// ctx.strokeRect(
//   49 + m.actualBoundingBoxLeft,
//   99 - m.actualBoundingBoxAscent,
//   m.actualBoundingBoxRight - m.actualBoundingBoxLeft,
//   m.actualBoundingBoxAscent + m.actualBoundingBoxDescent
// )
//canvas.createPNGStream().pipe(fs.createWriteStream(path.join(__dirname, 'text.png')))
fs.writeFile('out.svg', canvas.toBuffer());
