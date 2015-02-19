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
    '<div id="' + prefix + '-toggle" class="' + prefix + '-toggle"></div>',
    getAllTextMetricsHTML(),
    getAllChartMetricsHTML()
  ].join('');

  cacheLookups();
  attachListeners();
}

function renderText() {
  var html = getAllTextMetricsHTML(activeMetrics);
  var textWrapper = document.getElementById(prefix + '-text-metrics');
  textWrapper.innerHTML = html;
}

function attachListeners() {
  document.getElementById('justice-toggle').onclick = function() {
    var e = document.getElementById('justice');

    if (e.className.match(' closed')) {
      e.className = e.className.replace(' closed', '')
    } else {
      e.className += ' closed';
    }

  }
}

