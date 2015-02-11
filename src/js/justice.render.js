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
  var textMetrics = render.utils.getTextMetrics();
  var textMetricsHTML = render.utils.getTextHTML(textMetrics);
  var chartMetricsHMTL = render.utils.getChartHTML();
  var uiHTML = render.utils.getUIHTML({ text: textMetricsHTML, charts: chartMetricsHMTL });

  wrap = document.createElement('div');
  wrap.id = prefix;
  wrap.classList.add(prefix)
  document.body.appendChild(wrap);
  wrap = document.getElementById(prefix)
  wrap.innerHTML = uiHTML;

  render.utils.cacheNodes(textMetrics);
}

render.text = function() {
  var metrics = render.utils.getTextMetrics();
  var html = render.utils.getTextHTML(metrics)
  var textWrapper = document.getElementById(prefix + '-text-metrics');
  textWrapper.innerHTML = html;
}
