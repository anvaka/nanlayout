var grid = require('./grid.js');

var Benchmark = require('benchmark');
var suite = new Benchmark.Suite;

// add tests
suite.add('Run default', function() {
  var graph = grid(20, 20).getNativeGraph();
  var layout = require('../')(graph);
  layout.step(20);
}).add('Run 2d', function() {
  var graph = grid(20, 20).getNativeGraph();
  var layout = require('../')(graph, 2);
  layout.step(20);
}).on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
})
// run async
.run({ 'async': true });
