var iterationsCount = 100;
var renderSvg = require('../shared/renderSvg.js');

var fileName = process.argv[2];

if (!fileName) {
  console.log('Loads a dot file and runs graph layout. Result is printed into STDOUT as an SVG file');
  console.log('');
  console.log('Usage: ');
  console.log('  dot2svg file.dot');
  process.exit(1);
}

var fs = require('fs');
var dot = fs.readFileSync(fileName, 'utf8')

var graph = require('nangraph')();
var fromDot = require('ngraph.fromdot');
fromDot(dot, graph);
var layout = require('../../')(graph.getNativeGraph());
layout.step(iterationsCount);

renderSvg(console.log.bind(console), graph, layout);
