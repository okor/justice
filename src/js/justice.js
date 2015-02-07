'use strict';
var justice = (function() {

  include "justice.cache.js"
  include "justice.collectors.js"
  include "justice.utils.js"
  include "justice.render.js"

  function setChartType(chartType) {
    cache.chart.fpsRenderer = render.chart.stream[chartType];
  }

  // main tick function that calls everything else
  function tick(time) {
    cache.tickCount++;

    trackFPS(time);
    cache.chart.fpsRenderer(
      cache.dom.display.chart.fpsCanvasCtx,
      cache.dom.display.chart.fpsCanvas,
      cache.data.fps.history
    );

    if (lastTextUpdate === null) {
      lastTextUpdate = time;
    } else if (time - lastTextUpdate > 3000) {
      // lastTextUpdate = time;
      // render.text();
    }

    window.requestAnimationFrame(tick);
  }


  /////////////////////
  //   init things   //
  /////////////////////

  function seriouslyInit() {
    render.ui();
    render.text();
    setChartType('spline'); // should be option if charts didn't suck
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