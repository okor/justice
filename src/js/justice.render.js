/////////////////////
// DOM interaction //
/////////////////////

var render = {};
    render.chart = {};
    render.chart.stream = {};
    render.utils = {};

include "justice.render.utils.js"
include "justice.render.chart.js"


render.ui = function() {
  wrap = document.createElement('div');
  wrap.id = prefix;
  wrap.classList.add(prefix)
  document.body.appendChild(wrap);
  wrap = document.getElementById(prefix)

  wrap.innerHTML = [
    render.utils.getTextHTML(),
    render.utils.getChartHTML()
  ].join('');

  render.utils.cacheNodes();
}

render.text = function() {
  var html = render.utils.getTextHTML(activeMetrics);
  var textWrapper = document.getElementById(prefix + '-text-metrics');
  textWrapper.innerHTML = html;
}
