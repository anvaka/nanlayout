var test = require('tap').test;
var createGraph = require('nangraph');
var createLayout = require('../index.js');

test('it moves nodes', function(t) {
 var graph = createGraph();
 graph.addLink(1, 2);

 var layout = createLayout(graph.getNativeGraph());

 var move = layout.step();
 t.ok(move > 0, 'It moves');

 verifyPositionValid(t, layout.getNodePosition(1), 'Node 1 position is ok');
 verifyPositionValid(t, layout.getNodePosition(2), 'Node 2 position is ok');

 t.end()
});

function verifyPositionValid(t, pos, msg) {
  t.ok(typeof pos.x === 'number', msg + ' x');
  t.ok(typeof pos.y === 'number', msg + ' y');
  t.ok(typeof pos.z === 'number', msg + ' z');
}

