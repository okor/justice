'use strict';
var NinjaGuru = (function(timing) {



  /////////////////////
  //    da cache     //
  /////////////////////

  var cache = {

    timing: window.performance.timing,

    dom: {
      wrap: document.createElement('div'),
      bar: {
        prefix: "ninjaguru",
        node: null
      },
      textStats: {
        wrap: document.createElement('div')
      },
      chartStats: {
        wrap: document.createElement('div'),
        fps: {
          canvas: document.createElement('canvas'),
          ctx: null
        }
      }
    },

    data: {
      fps: {
        current: 0,
        history: [],
        lastTime: null
      }
    }

  }



  /////////////////////
  // Stat collectors //
  /////////////////////

  // from first byte to dom complete
  function getDomComplete() {
    return cache.timing.domComplete - cache.timing.domLoading;
  }

  // from first byte to dom is interactive
  function getDomInteractive() {
    return cache.timing.domInteractive - cache.timing.domLoading;
  }

  // only tracks fps, doesn't handle rendering
  function trackFPS(time) {
    if (!cache.data.fps.lastTime) {
      cache.data.fps.lastTime = time;
    } else {
      var delta = (time - cache.data.fps.lastTime) / 1000;
      cache.data.fps.current = ((1 / delta) + '').split('.')[0];

      if (cache.data.fps.history.length > 200) {
        cache.data.fps.history.shift();
      }
      cache.data.fps.history.push([cache.data.fps.current, 60 - cache.data.fps.current]);

      cache.data.fps.lastTime = time;
    }
    window.requestAnimationFrame(trackFPS);
  }



  /////////////////////
  // DOM interaction //
  /////////////////////

  function renderTextStat(label, value, unitLabel) {
    return [
      '<div class="' + cache.dom.bar.prefix + '-text-stats">',
        '<span>' + label + ': </span>' + value + unitLabel +
      ' </div>'
    ].join('');
  }

  function renderTextStats() {
    var statsHTML = [
      renderTextStat('domComplete', getDomComplete(), 'ms'),
      renderTextStat('domInteractive', getDomInteractive(), 'ms')
    ].join('')
    cache.dom.textStats.wrap.innerHTML = statsHTML;
  }

  function clearCanvas(ctx, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  function renderFpsChart() {
    clearCanvas(cache.dom.chartStats.fps.ctx, cache.dom.chartStats.fps.canvas);

    for (var i = 0; i < cache.data.fps.history.length; i++) {
      cache.dom.chartStats.fps.ctx.fillStyle = "#EEBF49";
      cache.dom.chartStats.fps.ctx.fillRect(i, cache.data.fps.history[i][1], 1, cache.data.fps.history[i][0]);
    }

  }

  function renderChartStats() {
    var statsHTML = [
      renderChartStat('fps', cache.data.fps.current, '')
    ].join('')
    cache.dom.chartStats.wrap.innerHTML = statsHTML;
  }


  function constructUI() {
    cache.dom.wrap.id = cache.dom.bar.prefix;
    cache.dom.wrap.classList.add(cache.dom.bar.prefix)

    cache.dom.textStats.wrap.id = cache.dom.bar.prefix + '-textStats';
    cache.dom.textStats.wrap.classList.add(cache.dom.bar.prefix + '-text');

    cache.dom.chartStats.wrap.id = cache.dom.bar.prefix + '-chartStats';
    cache.dom.chartStats.wrap.classList.add(cache.dom.bar.prefix + '-text')

    cache.dom.chartStats.fps.canvas.id = cache.dom.bar.prefix + '-fpsChart';
    cache.dom.chartStats.fps.canvas.classList.add(cache.dom.bar.prefix + "-canvas");
    cache.dom.chartStats.wrap.appendChild(cache.dom.chartStats.fps.canvas);

    cache.dom.wrap.appendChild(cache.dom.textStats.wrap);
    cache.dom.wrap.appendChild(cache.dom.chartStats.wrap);

    document.body.appendChild(cache.dom.wrap);
  }



  /////////////////////
  //   init things   //
  /////////////////////

  function seriouslyInit() {
    constructUI();

    cache.dom.chartStats.fps.ctx = document.getElementById(cache.dom.bar.prefix + '-fpsChart').getContext('2d');

    renderTextStats();
    window.requestAnimationFrame(trackFPS);
    window.thing = setInterval(renderFpsChart, 500);
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

NinjaGuru.init();