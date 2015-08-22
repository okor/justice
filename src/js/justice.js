'use strict';

import { options, availableMetrics, activeMetrics } from "./justice.cache";
import { tick, renderUI } from "./justice.render";

import { getFpsRenderer } from "./justice.render.chart";

function seriouslyInit(opts) {
  if (typeof opts === 'object') {
    for (var i in opts) {
      options[i] = opts[i];
    }
  }

  for (var j in options.metrics) {
    activeMetrics[j] = availableMetrics[j];
  }

  renderUI();
  var fpsRenderer = getFpsRenderer(options.chartType);
  window.requestAnimationFrame((time) => tick(time, fpsRenderer));
}

export function init(opts) {
  if ('performance' in window && 'timing' in window.performance) {
    if (document.readyState === 'complete') {
      seriouslyInit(opts, 'already loaded');
    } else {
      window.onload = function() { seriouslyInit(opts) };
    }
  } else {
    console.log("Justice: performance api not supported in this browser, initialization stopped.")
  }
}