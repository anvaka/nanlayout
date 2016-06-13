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

test('it can make several steps at once', function(t) {
 var graph = createGraph();
 graph.addLink(1, 2);

 var layout1 = createLayout(graph.getNativeGraph());
 var layout2 = createLayout(graph.getNativeGraph());

 var move1 = layout1.step();
 move1 += layout1.step();

 // the code above should be equivalent to:
 var move2 = layout2.step(2);

 t.equals(move1, move2, 'Both moves are equivalent');
 t.same(layout1.getNodePosition(1), layout2.getNodePosition(1), 'Both layouts should give the same position for node 1');
 t.same(layout1.getNodePosition(2), layout2.getNodePosition(2), 'Both layouts should give the same position for node 2');

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

