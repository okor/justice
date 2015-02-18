'use strict';
var Justice = (function() {

  include "justice.options.js"
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

  function seriouslyInit(opts) {
// 1. validate options (drop and log if not)
// 2. merge options into defaults
// 3. verify each metric has browser api
// 4. push each metric into queues
//   - rolling
//   - onetime
// 5. render



    options = mergeOptions(opts);

    console.log(options)

    render.ui();
    fpsRenderer = render.chart.stream['spline']; // should be option if charts didn't suck
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