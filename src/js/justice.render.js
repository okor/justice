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
  var stateClass = getState();
  wrap = document.createElement('div');
  wrap.id = prefix;
  wrap.classList.add(prefix);
  wrap.classList.add(stateClass);
  document.body.appendChild(wrap);
  wrap = document.getElementById(prefix)

  wrap.innerHTML = [
    '<div id="' + prefix + '-toggle" class="' + prefix + '-toggle"></div>',
    getAllTextMetricsHTML(),
    getAllChartMetricsHTML()
  ].join('');

  if (options.showFPS) {
    cacheLookups();
  }
  attachListeners();
}


function renderText() {
  var html = getAllTextMetricsHTML(activeMetrics);
  var textWrapper = document.getElementById(prefix + '-text-metrics');
  textWrapper.innerHTML = html;
}


function attachListeners() {
  document.getElementById(prefix + '-toggle').onclick = function() {
    var e = document.getElementById(prefix);

    if (e.className.match(' closed')) {
      e.className = e.className.replace(' closed', '')
      setState('open');
    } else {
      e.className += ' closed';
      setState('closed')
    }

  }
}


function setState(state) {
  if (!window.localStorage) return;
  window.localStorage.setItem(prefix + '-state', state);
}


function getState() {
  if (!window.localStorage) return;
  return window.localStorage.getItem(prefix + '-state') || 'open';
}
