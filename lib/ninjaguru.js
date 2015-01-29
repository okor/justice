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
      }
    },

    chartRenderer: null, // function
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
    cache.chartRenderer = renderCharts[chartType];
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

  function tick(time) {
    cache.tickCount++;
    trackFPS(time);
    cache.chartRenderer();
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

  renderCharts.fps = function() {
    clearCanvas(cache.dom.display.chart.fpsCanvasCtx, cache.dom.display.chart.fpsCanvas);
    for (var i = 0; i < cache.data.fps.history.length; i++) {
      cache.dom.display.chart.fpsCanvasCtx.fillStyle = primaryColor;
      cache.dom.display.chart.fpsCanvasCtx.fillRect(i, cache.data.fps.history[i][1], 1, cache.data.fps.history[i][0]);
    }
  }


  renderCharts.bezier = function() {
    if ((cache.data.fps.history.length % 3) === 0) {
      clearCanvas(cache.dom.display.chart.fpsCanvasCtx, cache.dom.display.chart.fpsCanvas);

      cache.dom.display.chart.fpsCanvasCtx.beginPath();
      cache.dom.display.chart.fpsCanvasCtx.moveTo(0, 0);

      for (var i = 0; i < cache.data.fps.history.length; i+=3) {
        cache.dom.display.chart.fpsCanvasCtx.bezierCurveTo(
          i, (maxHeight - cache.data.fps.history[i][0]),
          i + 1, (maxHeight - cache.data.fps.history[i+1][0]),
          i + 2, (maxHeight - cache.data.fps.history[i+2][0])
        );
      }


      cache.dom.display.chart.fpsCanvasCtx.lineWidth = 2;
      cache.dom.display.chart.fpsCanvasCtx.strokeStyle = primaryColor;
      cache.dom.display.chart.fpsCanvasCtx.stroke();
      cache.dom.display.chart.fpsCanvasCtx.closePath();
    }
  }

  // dots
  renderCharts.dots = function() {
    clearCanvas(cache.dom.display.chart.fpsCanvasCtx, cache.dom.display.chart.fpsCanvas);
    cache.dom.display.chart.fpsCanvasCtx.fillStyle = primaryColor;

    for (var i = 0; i < cache.data.fps.history.length; i++) {
      cache.dom.display.chart.fpsCanvasCtx.fillRect(i, cache.data.fps.history[i][1], 1, 1);
    }
  }

  // could use rect or lineto
  renderCharts.spline = function() {
    clearCanvas(cache.dom.display.chart.fpsCanvasCtx, cache.dom.display.chart.fpsCanvas);
    renderLines();

    cache.dom.display.chart.fpsCanvasCtx.beginPath()
    cache.dom.display.chart.fpsCanvasCtx.moveTo(0, 0)

    for (var i = 0; i < cache.data.fps.history.length; i++) {
      var left = i === 0 ? 0 : i * slack;
      cache.dom.display.chart.fpsCanvasCtx.lineTo(left, cache.data.fps.history[i][1]);
    }

    cache.dom.display.chart.fpsCanvasCtx.lineWidth = 2;
    cache.dom.display.chart.fpsCanvasCtx.strokeStyle = primaryColor;
    cache.dom.display.chart.fpsCanvasCtx.stroke()
  }

  function renderLines(){

    cache.dom.display.chart.fpsCanvasCtx.beginPath();
    cache.dom.display.chart.fpsCanvasCtx.moveTo(0.5, 0.5);
    cache.dom.display.chart.fpsCanvasCtx.lineTo(maxWidth + 0.5, 0.5);
    cache.dom.display.chart.fpsCanvasCtx.lineWidth = 1;
    cache.dom.display.chart.fpsCanvasCtx.strokeStyle = secondaryColor;
    cache.dom.display.chart.fpsCanvasCtx.stroke()

    cache.dom.display.chart.fpsCanvasCtx.beginPath();
    cache.dom.display.chart.fpsCanvasCtx.moveTo(0.5, (maxHeight / 2) + 0.5);
    cache.dom.display.chart.fpsCanvasCtx.lineTo(maxWidth + 0.5, (maxHeight / 2) + 0.5);
    cache.dom.display.chart.fpsCanvasCtx.lineWidth = 1;
    cache.dom.display.chart.fpsCanvasCtx.strokeStyle = secondaryColor;
    cache.dom.display.chart.fpsCanvasCtx.stroke()

    cache.dom.display.chart.fpsCanvasCtx.beginPath();
    cache.dom.display.chart.fpsCanvasCtx.moveTo(0.5, (maxHeight-1) + 0.5);
    cache.dom.display.chart.fpsCanvasCtx.lineTo(maxWidth + 0.5, (maxHeight-1) + 0.5);
    cache.dom.display.chart.fpsCanvasCtx.lineWidth = 1;
    cache.dom.display.chart.fpsCanvasCtx.strokeStyle = secondaryColor;
    cache.dom.display.chart.fpsCanvasCtx.stroke()
  }


  function constructUI() {
    cache.dom.wrap.id = cache.dom.bar.prefix;
    cache.dom.wrap.classList.add(cache.dom.bar.prefix)

    cache.dom.display.text.domComplete.classList.add(cache.dom.bar.prefix + '-metric');
    cache.dom.display.text.domInteractive.classList.add(cache.dom.bar.prefix + '-metric');
    cache.dom.display.chart.fps.classList.add(cache.dom.bar.prefix + '-metric');
    cache.dom.display.chart.memory.classList.add(cache.dom.bar.prefix + '-metric');
    cache.dom.display.chart.fpsCanvas.classList.add(cache.dom.bar.prefix + '-canvas');
    cache.dom.display.chart.memoryCanvas.classList.add(cache.dom.bar.prefix + '-canvas');

    cache.dom.display.chart.fpsCanvas.height = maxHeight;
    cache.dom.display.chart.fpsCanvas.width = maxWidth;
    cache.dom.display.chart.memoryCanvas.height = maxHeight;
    cache.dom.display.chart.memoryCanvas.width = maxWidth;

    cache.dom.display.chart.fps.appendChild(cache.dom.display.chart.fpsCanvas);
    cache.dom.display.chart.memory.appendChild(cache.dom.display.chart.memoryCanvas)

    cache.dom.display.chart.fpsCanvasCtx = cache.dom.display.chart.fpsCanvas.getContext('2d');
    cache.dom.display.chart.memoryCanvasCtx = cache.dom.display.chart.memoryCanvas.getContext('2d');

    cache.dom.wrap.appendChild(cache.dom.display.text.domComplete);
    cache.dom.wrap.appendChild(cache.dom.display.text.domInteractive);
    cache.dom.wrap.appendChild(cache.dom.display.chart.fps);
    cache.dom.wrap.appendChild(cache.dom.display.chart.memory);

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