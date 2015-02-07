'use strict';
var justice = (function() {

  include "justice.cache.js"
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
      render.text();
    }

    window.requestAnimationFrame(tick);
  }

  function seriouslyInit() {
    render.ui();
    fpsRenderer = render.chart.stream['spline']; // should be option if charts didn't suck
    window.requestAnimationFrame(tick);
  }

  return {
    init: function() {
      if (!window.performance || !window.performance.timing) return;
      if (document.readyState === 'complete') {
        seriouslyInit();
      } else {
        window.onload = seriouslyInit;
      }
    }
  }

})();


justice.init();