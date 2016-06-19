var githubClient = require('./lib/ghClient.js')(process.env.GH_TOKEN);
var graph = require('nangraph')();
var createLayout = require('../../');
var renderSvg = require('../shared/renderSvg.js');

var queue = [];
var known = new Set();

indexUserFollowers('anvaka').then(g => {
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
