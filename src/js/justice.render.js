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
  var uiHTML = render.utils.getUIHTML([textMetricsHTML, chartMetricsHMTL]);

  wrap = document.createElement('div');
  wrap.id = prefix;
  wrap.classList.add(prefix)
  document.body.appendChild(wrap);
  document.getElementById(prefix).innerHTML = uiHTML;

  render.utils.cacheNodes(textMetrics);
}

render.text = function(metrics) {
  var html = [];
  for (var i = 0; i < metrics.length; i++) {
    html.push([
      '<div class="'    + prefix + '-metric">',
        '<span class="' + prefix + '-title">'   + metrics[i][0] + ': </span>',
        '<span class="' + prefix + '">'         + metrics[i][1] + 'ms</span>',
      '</div>'
    ].join(''))
  }
  wrap.innerHMTL = html.join('');
}
