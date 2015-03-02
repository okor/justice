'use strict';
var Justice = (function() {

  include "justice.cache.js"
  include "justice.mungers.js"
  include "justice.collectors.js"
  include "justice.render.js"

  // main tick function that calls everything else
  function tick(time) {
    tickCount++;

    trackFPS(time);
    fpsRenderer(
      domDisplayChartFpsCanvasCtx,
      domDisplayChartFpsCanvas,
      dataFpsHistory
    );

    if (lastTextUpdate === null) {
      lastTextUpdate = time;
    } else if (time - lastTextUpdate > 3000) {
      lastTextUpdate = time;
      renderText();
    }

    window.requestAnimationFrame(tick);
  }

  function seriouslyInit(opts) {
    options = mergeOptions(opts);
    setActiveMetrics(options, activeMetrics, availableMetrics);
    renderUI();
    fpsRenderer = getFpsRenderer(options.chartType);
    window.requestAnimationFrame(tick);
  }

  return {
    init: function(opts) {
      if (!window.performance || !window.performance.timing) return;
      if (document.readyState === 'complete') {
        seriouslyInit(opts, 'already loaded');
      } else {
        window.onload = function() { seriouslyInit(opts) };
      }
    }
  }

})();