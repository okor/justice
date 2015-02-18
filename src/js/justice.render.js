/////////////////////
// DOM interaction //
/////////////////////

include "justice.render.utils.js"
include "justice.render.chart.js"


function cacheLookups() {
  domDisplayChartFpsCanvas = document.getElementById(prefix + '-fps')
  domDisplayChartFpsCanvasCtx = domDisplayChartFpsCanvas.getContext('2d');
}


function renderUI() {
  wrap = document.createElement('div');
  wrap.id = prefix;
  wrap.classList.add(prefix)
  document.body.appendChild(wrap);
  wrap = document.getElementById(prefix)

  wrap.innerHTML = [
    getAllTextMetricsHTML(),
    getAllChartMetricsHTML()
  ].join('');

  cacheLookups();
}

function renderText() {
  var html = getAllTextMetricsHTML(activeMetrics);
  var textWrapper = document.getElementById(prefix + '-text-metrics');
  textWrapper.innerHTML = html;
}
