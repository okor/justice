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
          domInteractive: document.createElement('div'),
          httpRequests: document.createElement('div')
        },
        chart: {
          fps: document.createElement('div'),
          fpsCanvas: document.createElement('canvas'),
          fpsCanvasCtx: null
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

    chart: {
      fpsRenderer: null, // function
    },

    tickCount: 0
  }

  // need to get a better waying of syncing these values with css
  var maxWidth = 300;
  var maxHeight = 40;
  var fpsHeightScale = maxHeight / 60;
  var chartLabelOffset = 20;
  var maxHistory = maxWidth - chartLabelOffset;
  var primaryColor = "rgb(241, 250, 195)";
  var secondaryColor = "rgb(36, 36, 36)";
  var failColor = "rgb(206, 69, 45)";
  var warnColor = "rgb(212, 202, 61)";
  var passColor = "rgb(65, 155, 163)";
  var slack = 1; // gap between data points - 1, must figure out how to make slower
  var lastTextUpdate = 0;

  function setChartType(chartType) {
    cache.chart.fpsRenderer = renderCharts[chartType];
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

  function getNumRequests() {
    // turn on the dom.enable_resource_timing in firefox about:config
    if (performance.getEntries) {
      return performance.getEntries().length;
    } else {
      return '?';
    }
  }

  // could be base64 or empty
  function urlIsRemote(urlString) {
    return (urlString && urlString.match(/^http|^\/\/|url\(http/)) ? true : false;
  }

  function elementIsTypeOf(element, typeString) {
    return element.getAttribute && element.getAttribute('type') && element.getAttribute('type').match(typeString);
  }

  function elementAttributeMatches(element, attr, matcher) {
    return element.getAttribute(attr) && element.getAttribute(attr).match(matcher);
  }


  // only tracks fps, doesn't handle rendering
  function trackFPS(time) {
    if (!cache.data.fps.lastTime) {
      cache.data.fps.lastTime = time;
    } else {
      var delta = (time - cache.data.fps.lastTime) / 1000;
      var fps = 1 / delta;
      var fpsClipped = Math.floor(fps > 60 ? 60 : fps);
      cache.data.fps.current = fpsClipped;
      cache.data.fps.history.push([fpsClipped, fpsClipped]);
      if (cache.data.fps.history.length > (maxHistory / slack)) {
        cache.data.fps.history.shift();
      }
      cache.data.fps.lastTime = time;
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

    if (lastTextUpdate === null) {
      lastTextUpdate = time;
    } else if (time - lastTextUpdate > 3000) {
      // lastTextUpdate = time;
      // renderTextStats();
    }

    window.requestAnimationFrame(tick);
  }



  /////////////////////
  // DOM interaction //
  /////////////////////

  function renderTextStats() {
    cache.dom.display.text.loadTime.innerHTML = '<span class="' + cache.dom.bar.prefix + '-title">Load: </span><span class="' + cache.dom.bar.prefix + '-text">' + getLoadTime() + 'ms</span>';
    cache.dom.display.text.domComplete.innerHTML = '<span class="' + cache.dom.bar.prefix + '-title">Complete: </span><span class="' + cache.dom.bar.prefix + '-text">' + getDomComplete() + 'ms</span>';
    cache.dom.display.text.domInteractive.innerHTML = '<span class="' + cache.dom.bar.prefix + '-title">Interactive: </span><span class="' + cache.dom.bar.prefix + '-text">' + getDomInteractive() + 'ms</span>';
    cache.dom.display.text.httpRequests.innerHTML = '<span class="' + cache.dom.bar.prefix + '-title">requests: </span><span class="' + cache.dom.bar.prefix + '-text">' + getNumRequests() + '</span>';
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
      var scaledHeight = ((60 - data[i][1]) * fpsHeightScale);
      ctx.fillRect( (data.length - i) + chartLabelOffset, scaledHeight, 2, 2);
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
      var scaledHeight = ((60 - data[i][1]) * fpsHeightScale);
      ctx.lineTo((data.length - left) + chartLabelOffset, scaledHeight);
    }

    ctx.lineWidth = 1;
    ctx.stroke();
  }



  function addGradientToChart(ctx) {
    var grad = ctx.createLinearGradient(0,maxHeight,0,0);
    grad.addColorStop(0, failColor); // you crazy fool
    grad.addColorStop(0.25, failColor); // bad zone
    grad.addColorStop(0.5, warnColor); // warning
    grad.addColorStop(1, passColor); // da sweetness
    ctx.strokeStyle = grad;
    ctx.fillStyle = grad;
  }

  function addTextToChart(ctx) {
    var fontSize = 10;
    ctx.font= fontSize + "px sans-serif";

    // no
    ctx.fillStyle = failColor;
    ctx.fillText(0 + '', 0, maxHeight);

    // meh
    ctx.fillStyle = warnColor;
    ctx.fillText(30 + '', 0, ((maxHeight / 2) + (fontSize / 2)));

    // wins internet
    ctx.fillStyle = passColor;
    ctx.fillText(60 + '', 0, 0 + fontSize);
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

    cache.dom.display.text.httpRequests.classList.add(cache.dom.bar.prefix + '-metric');
    cache.dom.wrap.appendChild(cache.dom.display.text.httpRequests);

    cache.dom.display.chart.fps.classList.add(cache.dom.bar.prefix + '-metric');
    cache.dom.display.chart.fps.classList.add('chart');

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