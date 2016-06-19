module.exports = renderSvg;

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
