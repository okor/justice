/////////////////////
// DOM interaction //
/////////////////////

var render = {};
render.chart = {};
render.chart.stream = {};

render.ui = function(){
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

render.text = function() {
  cache.dom.display.text.loadTime.innerHTML = '<span class="' + cache.dom.bar.prefix + '-title">Load: </span><span class="' + cache.dom.bar.prefix + '-text">' + getLoadTime() + 'ms</span>';
  cache.dom.display.text.domComplete.innerHTML = '<span class="' + cache.dom.bar.prefix + '-title">Complete: </span><span class="' + cache.dom.bar.prefix + '-text">' + getDomComplete() + 'ms</span>';
  cache.dom.display.text.domInteractive.innerHTML = '<span class="' + cache.dom.bar.prefix + '-title">Interactive: </span><span class="' + cache.dom.bar.prefix + '-text">' + getDomInteractive() + 'ms</span>';
  cache.dom.display.text.httpRequests.innerHTML = '<span class="' + cache.dom.bar.prefix + '-title">requests: </span><span class="' + cache.dom.bar.prefix + '-text">' + getNumRequests() + '</span>';
}

render.chart.clear = function(ctx, canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

// bar, needs improvment / unusable as is
render.chart.stream.bar = function(ctx, canvas, data) {
  render.chart.clear(ctx, canvas);
  render.chart.lines(ctx);

  render.chart.gradient(ctx); // how to work for bars?
  // ctx.fillStyle = primaryColor;
  for (var i = 0; i < data.length; i++) {
    ctx.fillRect(i, data[i][1], 1, data[i][0]);
  }
}

render.chart.stream.dots = function(ctx, canvas, data) {
  render.chart.clear(ctx, canvas);
  render.chart.lines(ctx);
  render.chart.labels(ctx);
  render.chart.gradient(ctx);

  for (var i = 0; i < data.length; i++) {
    var scaledHeight = ((60 - data[i][1]) * fpsHeightScale);
    ctx.fillRect( (data.length - i) + chartLabelOffset, scaledHeight, 2, 2);
  }
}

render.chart.stream.spline = function(ctx, canvas, data) {
  render.chart.clear(ctx, canvas);
  render.chart.lines(ctx);
  render.chart.labels(ctx);
  render.chart.gradient(ctx);

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

render.chart.labels = function(ctx) {
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

render.chart.gradient = function(ctx) {
  var grad = ctx.createLinearGradient(0,maxHeight,0,0);
  grad.addColorStop(0, failColor); // you crazy fool
  grad.addColorStop(0.25, failColor); // bad zone
  grad.addColorStop(0.5, warnColor); // warning
  grad.addColorStop(1, passColor); // da sweetness
  ctx.strokeStyle = grad;
  ctx.fillStyle = grad;
}

render.chart.lines = function(ctx) {
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