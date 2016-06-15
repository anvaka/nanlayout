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

test('it moves nodes in 2d', function(t) {
 var graph = createGraph();
 graph.addLink(1, 2);

 var layout = createLayout(graph.getNativeGraph(), 2);

 var move = layout.step();
 t.ok(move > 0, 'It moves');

 verifyPositionValidIn2d(t, layout.getNodePosition(1), 'Node 1 position is ok');
 verifyPositionValidIn2d(t, layout.getNodePosition(2), 'Node 2 position is ok');

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
  for (var i = 0; i < 3; ++i) {
    t.ok(rect.max[i] - rect.min[i] > 0, 'size is defined ' + i);
  }

  t.end();
});

test('it can set node position', function(t) {
 var graph = createGraph();
 graph.addLink(1, 2);

 var layout = createLayout(graph.getNativeGraph());
 layout.setNodePosition(1, 10, 11, 12)
 var pos = layout.getNodePosition(1);

 t.equals(pos[0], 10, 'x is set');
 t.equals(pos[1], 11, 'y is set');
 t.equals(pos[2], 12, 'z is set');

 t.end()
});

test('it can layout 1d graph', function(t) {
 var graph = createGraph();
 graph.addLink(1, 2);

 var layout = createLayout(graph.getNativeGraph(), 1);
 layout.step();
 
 var pos1 = layout.getNodePosition(1);
 var pos2 = layout.getNodePosition(2);

 t.ok(pos1[0] != 0, '1 is set');
 t.ok(pos2[0] != 0, '2 is set');
 t.ok(pos1[0] != pos2[0], 'they are different');

 t.end()
});

test('it can layout 4d graph', function(t) {
 var graph = createGraph();
 graph.addLink(1, 2);

 var layout = createLayout(graph.getNativeGraph(), 4);
 layout.step();
 
 var pos = layout.getNodePosition(1);
 console.log(pos);
 t.ok(pos.length === 4, 'dimension is 4');

 t.end()
});

function verifyPositionValid(t, pos, msg) {
  t.ok(typeof pos[0] === 'number', msg + ' x');
  t.ok(typeof pos[1] === 'number', msg + ' y');
  t.ok(typeof pos[2] === 'number', msg + ' z');
}

function verifyPositionValidIn2d(t, pos, msg) {
  t.ok(typeof pos[0] === 'number', msg + ' x');
  t.ok(typeof pos[1] === 'number', msg + ' y');
  t.ok(pos[2] === undefined, 'z should not be present');
}

