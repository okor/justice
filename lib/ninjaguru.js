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
          loadTime: document.createElement('div'),
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

  // need to get a better waying of syncing these values with css
  var maxWidth = 260;
  var maxHeight = 60;
  var chartLabelOffset = 20;
  var maxHistory = maxWidth - chartLabelOffset;
  var primaryColor = "rgb(241, 250, 195)";
  var secondaryColor = "rgb(36, 36, 36)";
  var slack = 1; // gap between data points - 1, must figure out how to make slower
  var enableMemoryChart = false;

  function setChartType(chartType) {
    cache.chart.fpsRenderer = renderCharts[chartType];
    cache.chart.memoryRenderer = renderCharts[chartType];
  }

  /////////////////////
  // Stat collectors //
  /////////////////////

  // load time
  function getLoadTime() {
    return cache.timing.loadEventStart - cache.timing.navigationStart;
  }

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
      cache.data.fps.current = Math.floor((1 / delta));
      cache.data.fps.history.push([cache.data.fps.current, maxHeight - cache.data.fps.current]);
      if (cache.data.fps.history.length > (maxHistory / slack)) {
        cache.data.fps.history.shift();
      }
      cache.data.fps.lastTime = time;
    }
  }

  // would be really cool to track and render both
  // totalJSHeapSize and usedJSHeapSize
  function trackMemory(time) {
    var used = (performance.memory.jsHeapSizeLimit / performance.memory.totalJSHeapSize) / maxHeight;

    if (!cache.data.memory.lastTime) {
      cache.data.memory.lastTime = time;
    } else {
      cache.data.memory.current = Math.floor(used);
      cache.data.memory.history.push([maxHeight - used, used]);

      if (cache.data.memory.history.length > (maxHistory / slack)) {
        cache.data.memory.history.shift();
      }

      cache.data.memory.lastTime = time;
    }
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

    if (enableMemoryChart) {
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

  function appendStyles(css) {
    var style = document.createElement('style');
    style.innerHTML = css;
    style.appendChild(document.createTextNode(""));
    document.head.appendChild(style);
  }

  function renderTextStats() {
    cache.dom.display.text.loadTime.innerHTML = '<span class="' + cache.dom.bar.prefix + '-title">Load Time: </span><span class="' + cache.dom.bar.prefix + '-text">' + getLoadTime() + 'ms</span>';
    cache.dom.display.text.domComplete.innerHTML = '<span class="' + cache.dom.bar.prefix + '-title">dom Complete: </span><span class="' + cache.dom.bar.prefix + '-text">' + getDomComplete() + 'ms</span>';
    cache.dom.display.text.domInteractive.innerHTML = '<span class="' + cache.dom.bar.prefix + '-title">dom Interactive: </span><span class="' + cache.dom.bar.prefix + '-text">' + getDomInteractive() + 'ms</span>';

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

    addGradientToChart(ctx); // how to work for bars?
    // ctx.fillStyle = primaryColor;
    for (var i = 0; i < data.length; i++) {
      ctx.fillRect(i, data[i][1], 1, data[i][0]);
    }
  }

  // dots
  renderCharts.dots = function(ctx, canvas, data) {
    clearCanvas(ctx, canvas);
    renderLines(ctx);
    addTextToChart(ctx);
    addGradientToChart(ctx);

    for (var i = 0; i < data.length; i++) {
      ctx.fillRect( (data.length - i) + chartLabelOffset, data[i][1], 1, 1);
    }
  }

  // could use rect or lineto
  renderCharts.spline = function(ctx, canvas, data) {
    clearCanvas(ctx, canvas);
    renderLines(ctx);
    addTextToChart(ctx);
    addGradientToChart(ctx);

    ctx.beginPath();
    var startHeight = data.length > 0 ? data[data.length] : 0;
    ctx.moveTo(0, startHeight);

    for (var i = 0; i < data.length; i++) {
      var left = (i === 0 ? 0 : i * slack);
      ctx.lineTo((data.length - left) + chartLabelOffset, data[i][1]);
    }

    ctx.lineWidth = 1;
    ctx.stroke();
  }

  function addGradientToChart(ctx) {
    var grad = ctx.createLinearGradient(0,60,0,0);
    grad.addColorStop(0, "rgb(141, 48, 31)"); // you crazy fool
    grad.addColorStop(0.25, "rgb(141, 48, 31)"); // bad zone
    grad.addColorStop(0.5, "rgb(228, 255, 77)"); // warning
    grad.addColorStop(1, "rgb(65, 155, 163)"); // da sweetness
    ctx.strokeStyle = grad;
    ctx.fillStyle = grad;
  }

  function addTextToChart(ctx) {
    var fontSize = 10;
    ctx.font= fontSize + "px monospace";

    // no
    ctx.fillStyle = 'rgb(141, 48, 31)';
    ctx.fillText(0 + '', 0, maxHeight);

    // meh
    ctx.fillStyle = 'rgb(228, 255, 77)';
    ctx.fillText((maxHeight / 2) + '', 0, ((maxHeight / 2) + (fontSize / 2)));

    // wins internet
    ctx.fillStyle = 'rgb(65, 155, 163)';
    ctx.fillText(maxHeight + '', 0, 0 + fontSize);
  }

  function renderLines(ctx) {
    ctx.beginPath();
    ctx.moveTo(0.5 + chartLabelOffset, 0.5);
    ctx.lineTo(maxWidth + 0.5, 0.5);
    ctx.lineWidth = 1;
    ctx.strokeStyle = secondaryColor;
    ctx.stroke()

    ctx.beginPath();
    ctx.moveTo(0.5 + chartLabelOffset, (maxHeight / 2) + 0.5);
    ctx.lineTo(maxWidth + 0.5, (maxHeight / 2) + 0.5);
    ctx.lineWidth = 1;
    ctx.strokeStyle = secondaryColor;
    ctx.stroke()

    ctx.beginPath();
    ctx.moveTo(0.5 + chartLabelOffset, (maxHeight-1) + 0.5);
    ctx.lineTo(maxWidth + 0.5, (maxHeight-1) + 0.5);
    ctx.lineWidth = 1;
    ctx.strokeStyle = secondaryColor;
    ctx.stroke()
  }


  function constructUI() {
    cache.dom.wrap.id = cache.dom.bar.prefix;
    cache.dom.wrap.classList.add(cache.dom.bar.prefix)

    cache.dom.display.text.loadTime.classList.add(cache.dom.bar.prefix + '-metric');
    cache.dom.wrap.appendChild(cache.dom.display.text.loadTime);

    cache.dom.display.text.domComplete.classList.add(cache.dom.bar.prefix + '-metric');
    cache.dom.wrap.appendChild(cache.dom.display.text.domComplete);

    cache.dom.display.text.domInteractive.classList.add(cache.dom.bar.prefix + '-metric');
    cache.dom.wrap.appendChild(cache.dom.display.text.domInteractive);

    cache.dom.display.chart.fps.classList.add(cache.dom.bar.prefix + '-metric');

    var span = document.createElement('span');
    span.classList.add(cache.dom.bar.prefix + '-title')
    span.innerHTML = "FPS: ";
    cache.dom.display.chart.fps.appendChild(span);

    cache.dom.display.chart.fpsCanvas.classList.add(cache.dom.bar.prefix + '-canvas');
    cache.dom.display.chart.fpsCanvas.height = maxHeight;
    cache.dom.display.chart.fpsCanvas.width = maxWidth;
    cache.dom.display.chart.fps.appendChild(cache.dom.display.chart.fpsCanvas);
    cache.dom.display.chart.fpsCanvasCtx = cache.dom.display.chart.fpsCanvas.getContext('2d');
    cache.dom.wrap.appendChild(cache.dom.display.chart.fps);

    // disable until we figure out if it's actually useful
    if (enableMemoryChart) {
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