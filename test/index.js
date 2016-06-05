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

test('does not tolerate bad input', function (t) {
  t.throws(missingGraph);
  t.throws(invalidNodeId);
  t.throws(notNativeGraph);
  t.end();

  function missingGraph() {
    // graph is missing:
    createLayout();
  }

  function notNativeGraph() {
    var graph = createGraph();
    var layout = createLayout(graph);
  }

  function invalidNodeId() {
    var graph = createGraph();
    var layout = createLayout(graph.getNativeGraph());

    // we don't have nodes in the graph. This should throw:
    layout.getNodePosition(1);
  }
});

test('it can return graph rect', function(t) {
  var graph = createGraph();
  graph.addLink(1, 2);

  var layout = createLayout(graph.getNativeGraph());

  var move = layout.step();
  var rect = layout.getGraphRect();
  t.ok(rect.x2 - rect.x1 > 0, 'Width is defined');
  t.ok(rect.y2 - rect.y1 > 0, 'Height is defined');
  t.ok(rect.z2 - rect.z1 > 0, 'Depth is defined');

  t.end();
});

function verifyPositionValid(t, pos, msg) {
  t.ok(typeof pos.x === 'number', msg + ' x');
  t.ok(typeof pos.y === 'number', msg + ' y');
  t.ok(typeof pos.z === 'number', msg + ' z');
}

