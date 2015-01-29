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
      display: {
        text: {
          domComplete: document.createElement('div'),
          domInteractive: document.createElement('div')
        },
        chart: {
          fps: document.createElement('div'),
          fpsCanvas: document.createElement('canvas'),
          fpsCanvasCtx: null,
          memory: document.createElement('div'),
          memoryCanvas: document.createElement('canvas'),
          memoryCanvasCtx: null
        }
      }
    },

    data: {
      fps: {
        current: 0,
        history: [],
        lastTime: null
      },
      memory: {
        current: 0,
        history: [],
        lastTime: null
      }
    },

    chart: {
      fpsRenderer: null, // function
      memoryRenderer: null
    },
    tickCount: 0
  }

  // debug
  window.cache = cache;


  // need to get a better waying of syncing these values
  var maxWidth = 300;
  var maxHeight = 60;
  var primaryColor = "#EEBF49";
  var secondaryColor = "#363636";
  var slack = 1; // gap between data points - 1, must figure out how to make slower

  function setChartType(chartType) {
    cache.chart.fpsRenderer = renderCharts[chartType];
    cache.chart.memoryRenderer = renderCharts[chartType];
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
      cache.data.fps.history.push([cache.data.fps.current, 60 - cache.data.fps.current]);
      if (cache.data.fps.history.length > (maxWidth / slack)) {
        cache.data.fps.history.shift();
      }
      cache.data.fps.lastTime = time;
    }
  }

  // would be really cool to track and render both
  // totalJSHeapSize and usedJSHeapSize
  function trackMemory(time) {
    // value should be
      // a whole number

    // total size divided by chart height
    var used = (performance.memory.jsHeapSizeLimit / performance.memory.totalJSHeapSize) / maxHeight;

    if (!cache.data.memory.lastTime) {
      cache.data.memory.lastTime = time;
    } else {
      cache.data.memory.current = ((used) + '').split('.')[0];
      cache.data.memory.history.push([maxHeight - used, used]);

      if (cache.data.memory.history.length > (maxWidth / slack)) {
        cache.data.memory.history.shift();
      }

      cache.data.memory.lastTime = time;
    }
  }

  function tick(time) {
    cache.tickCount++;

    trackFPS(time);
    cache.chart.fpsRenderer(
      cache.dom.display.chart.fpsCanvasCtx,
      cache.dom.display.chart.fpsCanvas,
      cache.data.fps.history
    );

    if (window.performance.memory) {
      trackMemory(time);
      cache.chart.memoryRenderer(
        cache.dom.display.chart.memoryCanvasCtx,
        cache.dom.display.chart.memoryCanvas,
        cache.data.memory.history
      );
    }

    window.requestAnimationFrame(tick);
  }



  /////////////////////
  // DOM interaction //
  /////////////////////

  function renderTextStats() {
    cache.dom.display.text.domComplete.innerHTML = '<span class="' + cache.dom.bar.prefix + '-title">domComplete: </span> ' + getDomComplete() + 'ms';
    cache.dom.display.text.domInteractive.innerHTML = '<span class="' + cache.dom.bar.prefix + '-title">domInteractive: </span> ' + getDomInteractive() + 'ms';
  }

  function clearCanvas(ctx, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }



  // charts
  var renderCharts = {};

  // bar, needs improvment
  renderCharts.bar = function(ctx, canvas, data) {
    clearCanvas(ctx, canvas);
    renderLines(ctx);

    for (var i = 0; i < data.length; i++) {
      ctx.fillStyle = primaryColor;
      ctx.fillRect(i, data[i][1], 1, data[i][0]);
    }
  }

  // dots
  renderCharts.dots = function(ctx, canvas, data) {
    clearCanvas(ctx, canvas);
    renderLines(ctx);

    ctx.fillStyle = primaryColor;
    for (var i = 0; i < data.length; i++) {
      ctx.fillRect(i, data[i][1], 1, 1);
    }
  }

  // could use rect or lineto
  renderCharts.spline = function(ctx, canvas, data) {
    clearCanvas(ctx, canvas);
    renderLines(ctx);

    ctx.beginPath();
    ctx.moveTo(0, 0);

    for (var i = 0; i < data.length; i++) {
      var left = i === 0 ? 0 : i * slack;
      ctx.lineTo(left, data[i][1]);
    }

    ctx.lineWidth = 1;
    ctx.strokeStyle = primaryColor;
    ctx.stroke();
  }

  function renderLines(ctx) {
    ctx.beginPath();
    ctx.moveTo(0.5, 0.5);
    ctx.lineTo(maxWidth + 0.5, 0.5);
    ctx.lineWidth = 1;
    ctx.strokeStyle = secondaryColor;
    ctx.stroke()

    ctx.beginPath();
    ctx.moveTo(0.5, (maxHeight / 2) + 0.5);
    ctx.lineTo(maxWidth + 0.5, (maxHeight / 2) + 0.5);
    ctx.lineWidth = 1;
    ctx.strokeStyle = secondaryColor;
    ctx.stroke()

    ctx.beginPath();
    ctx.moveTo(0.5, (maxHeight-1) + 0.5);
    ctx.lineTo(maxWidth + 0.5, (maxHeight-1) + 0.5);
    ctx.lineWidth = 1;
    ctx.strokeStyle = secondaryColor;
    ctx.stroke()
  }


  function constructUI() {
    cache.dom.wrap.id = cache.dom.bar.prefix;
    cache.dom.wrap.classList.add(cache.dom.bar.prefix)

    cache.dom.display.text.domComplete.classList.add(cache.dom.bar.prefix + '-metric');
    cache.dom.display.text.domInteractive.classList.add(cache.dom.bar.prefix + '-metric');
    cache.dom.wrap.appendChild(cache.dom.display.text.domComplete);
    cache.dom.wrap.appendChild(cache.dom.display.text.domInteractive);

    cache.dom.display.chart.fps.classList.add(cache.dom.bar.prefix + '-metric');
    cache.dom.display.chart.fpsCanvas.classList.add(cache.dom.bar.prefix + '-canvas');
    cache.dom.display.chart.fpsCanvas.height = maxHeight;
    cache.dom.display.chart.fpsCanvas.width = maxWidth;
    cache.dom.display.chart.fps.appendChild(cache.dom.display.chart.fpsCanvas);
    cache.dom.display.chart.fpsCanvasCtx = cache.dom.display.chart.fpsCanvas.getContext('2d');
    cache.dom.wrap.appendChild(cache.dom.display.chart.fps);

    if (window.performance.memory) {
      cache.dom.display.chart.memory.classList.add(cache.dom.bar.prefix + '-metric');
      cache.dom.display.chart.memoryCanvas.classList.add(cache.dom.bar.prefix + '-canvas');
      cache.dom.display.chart.memory.appendChild(cache.dom.display.chart.memoryCanvas)
      cache.dom.display.chart.memoryCanvas.height = maxHeight;
      cache.dom.display.chart.memoryCanvas.width = maxWidth;
      cache.dom.display.chart.memoryCanvasCtx = cache.dom.display.chart.memoryCanvas.getContext('2d');
      cache.dom.wrap.appendChild(cache.dom.display.chart.memory);
    }

    document.body.appendChild(cache.dom.wrap);
  }



  /////////////////////
  //   init things   //
  /////////////////////

  function seriouslyInit() {
    constructUI();
    renderTextStats();
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

NinjaGuru.init();