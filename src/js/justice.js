'use strict';
var Justice = (function() {

  include "justice.cache.js"
  include "justice.mungers.js"
  include "justice.collectors.js"
  include "justice.render.js"

  // main tick function that calls everything else
  function tick(time) {
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

    window.requestAnimationFrame(tick);
  }

  function seriouslyInit(opts) {
    timing = window.performance.timing;
    options = mergeOptions(opts);
    setActiveMetrics(options, activeMetrics, availableMetrics);
    renderUI();
    fpsRenderer = getFpsRenderer(options.chartType);
    window.requestAnimationFrame(tick);
  }

  return {
    init: function(opts) {
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
  }

})();