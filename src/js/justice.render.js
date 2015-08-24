/////////////////////
// DOM interaction //
/////////////////////

import { settings, dataFpsHistory, options, activeMetrics } from "./justice.cache";
import { trackFPS } from "./justice.collectors";

import { getAllTextMetricsHTML, getAllChartMetricsHTML } from "./justice.render.utils";

var prefix = settings.prefix;

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
  domDisplayChartFpsCanvas = document.getElementById(prefix + '-fps');
  domDisplayChartFpsCanvasCtx = domDisplayChartFpsCanvas.getContext('2d');
}


export function renderUI() {
  var stateClass = getState();
  var wrap = document.createElement('div');
  wrap.id = prefix;
  wrap.classList.add(prefix, stateClass);
  document.body.appendChild(wrap);
  wrap = document.getElementById(prefix);

  wrap.innerHTML = [
    `<div id="${prefix}-toggle" class="${prefix}-toggle"></div>`,
    getAllTextMetricsHTML(),
    getAllChartMetricsHTML()
  ].join('');

  if (options.showFPS) {
    cacheLookups();
  }
  attachListeners();
}


export function renderText() {
  var textWrapper = document.getElementById(prefix + '-text-metrics');
  textWrapper.innerHTML = getAllTextMetricsHTML(activeMetrics);
}


export function attachListeners() {
  document.getElementById(prefix + '-toggle').onclick = function() {
    var e = document.getElementById(prefix);
    var closedClass = 'closed';

    e.classList.toggle(closedClass);
    setState(e.classList.contains(closedClass) ? closedClass : 'open');
  }
}


export function setState(state) {
  if (window.localStorage) return;
  localStorage.setItem(prefix + '-state', state);
}


export function getState() {
  if (!window.localStorage) return;
  return localStorage.getItem(prefix + '-state') || 'open';
}
