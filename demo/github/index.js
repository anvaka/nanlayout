var githubClient = require('./lib/ghClient.js')(process.env.GH_TOKEN);
var graph = require('nangraph')();
var createLayout = require('../../');

var queue = [];
var known = new Set();

indexUserFollowers('dariaP').then(g => {
  var layout = createLayout(g.getNativeGraph(), 2);
  layout.step(100);
  var log = console.log.bind(console);
  console.log('---------------------- SVG ------------------------');
  renderSvg(log, g, layout);
  console.log('---------------------- DOT ------------------------');
  renderDot(log, g);
});

function renderDot(log, graph) {
  log('digraph G {');
  graph.forEachLink(function (link) {
    log(`"${link.fromId}"->"${link.toId}"`);
  });
  log('}');
}

function renderSvg(log, graph, layout) {
  var rect = layout.getGraphRect();
  var width = rect.max[0] - rect.min[0];
  var height = rect.max[1] - rect.min[1];
  log('<?xml version="1.0"?>');
  log(`<svg viewBox="${rect.min[0]} ${rect.min[1]} ${width} ${height}" version="1.1" xmlns="http://www.w3.org/2000/svg">`);

  log('<g id="scene">');

  log('<g class="edges">')
  graph.forEachLink(function (link) {
    var from = layout.getNodePosition(link.fromId);
    var to = layout.getNodePosition(link.toId);
    log(`<line x1="${from[0]}" y1="${from[1]}" x2="${to[0]}" y2="${to[1]}" stroke="black" stroke-width="0.5"/>`)
  });
  log('</g>'); // edges
  log('<g class="nodes">')
  graph.forEachNode(function (node) {
    // todo: this will fail:
    //var pos = layout.getPosition(node);
    var pos = layout.getNodePosition(node.id);
    log(`  <circle cx="${pos[0]}" cy="${pos[1]}" r="2"/>`);
  });

  log('</g>'); // nodes
  log('</g>'); // scene
  log('</svg>');
}

function indexUserFollowers(userName) {
  if (userName === undefined) {
    console.log('Are we done? Looks like there are no more users!');
    return graph;
  }
  console.log('building followers graph for ' + userName);

  graph.addNode(userName);

  return githubClient.getFollowers(userName)
    .then(process)
    .then(processQueue)
    .catch(function(e) {
      console.log('Something went bad: ' + e);
      console.log('Quiting...');
      process.exit(-1);
    });

  function process(followers) {
    followers.forEach(follower => {
      graph.addLink(follower, userName);
      queue.push(follower);
      known.add(follower);
    });
  }
}

function processQueue() {
  if (queue.length === 0) {
    console.log('All done');
    return graph;
  }

  var userName = queue.pop();
  console.log('processing ' + userName);

  return githubClient.getFollowers(userName)
    .then(process)
    .then(processQueue)
    .catch(function(e) {
      console.log('Something went bad: ' + e);
      console.log('Quiting...');
      process.exit(-1);
    });

  function process(followers) {
    followers.forEach(follower => {
      // only add users whom we saw before
      if (!known.has(follower)) return;

      graph.addLink(follower, userName);
    });
  }
}
