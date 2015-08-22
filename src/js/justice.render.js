/////////////////////
// DOM interaction //
/////////////////////

import { settings, dataFpsHistory, options, activeMetrics } from "./justice.cache";
import { trackFPS } from "./justice.collectors";

import { getAllTextMetricsHTML, getAllChartMetricsHTML } from "./justice.render.utils";

var tickCount = 0;
var lastTextUpdate = 0;

var domDisplayChartFpsCanvas = null;
var domDisplayChartFpsCanvasCtx = null;

// main tick function that calls everything else
export function tick(time, fpsRenderer) {
  tickCount++;

  if (options.showFPS) {
    trackFPS(time);
    fpsRenderer(
        domDisplayChartFpsCanvasCtx,
        domDisplayChartFpsCanvas,
        dataFpsHistory
    );
  }

  if (lastTextUpdate === null) {
    lastTextUpdate = time;
  } else if (time - lastTextUpdate > 3000) {
    lastTextUpdate = time;
    renderText();
  }

  window.requestAnimationFrame((time) => tick(time, fpsRenderer));
}


export function cacheLookups() {
  domDisplayChartFpsCanvas = document.getElementById(settings.prefix + '-fps')
  domDisplayChartFpsCanvasCtx = domDisplayChartFpsCanvas.getContext('2d');
}


export function renderUI() {
  var stateClass = getState();
  var wrap = document.createElement('div');
  wrap.id = settings.prefix;
  wrap.classList.add(settings.prefix);
  wrap.classList.add(stateClass);
  document.body.appendChild(wrap);
  wrap = document.getElementById(settings.prefix);

  wrap.innerHTML = [
    `<div id="${settings.prefix}-toggle" class="${settings.prefix}-toggle"></div>`,
    getAllTextMetricsHTML(),
    getAllChartMetricsHTML()
  ].join('');

  if (options.showFPS) {
    cacheLookups();
  }
  attachListeners();
}


export function renderText() {
  var html = getAllTextMetricsHTML(activeMetrics);
  var textWrapper = document.getElementById(settings.prefix + '-text-metrics');
  textWrapper.innerHTML = html;
}


export function attachListeners() {
  document.getElementById(settings.prefix + '-toggle').onclick = function() {
    var e = document.getElementById(settings.prefix);

    if (e.className.match(' closed')) {
      e.className = e.className.replace(' closed', '')
      setState('open');
    } else {
      e.className += ' closed';
      setState('closed')
    }

  }
}


export function setState(state) {
  if (!window.localStorage) return;
  window.localStorage.setItem(settings.prefix + '-state', state);
}


export function getState() {
  if (!window.localStorage) return;
  return window.localStorage.getItem(settings.prefix + '-state') || 'open';
}
