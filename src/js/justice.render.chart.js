render.chart.reset = function(ctx, canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  render.chart.lines(ctx);
  render.chart.labels(ctx);
  render.chart.gradient(ctx);
}

render.chart.stream.dots = function(ctx, canvas, data) {
  render.chart.reset(ctx, canvas);
  for (var i = 0; i < data.length; i++) {
    var scaledHeight = ((60 - data[i][1]) * fpsHeightScale);
    ctx.fillRect( (data.length - i) + chartLabelOffset, scaledHeight, 1.5, 1.5);
  }
}

render.chart.stream.spline = function(ctx, canvas, data) {
  render.chart.reset(ctx, canvas);

  ctx.beginPath();
  var startHeight = data.length > 0 ? data[data.length] : 0;
  ctx.moveTo(0, startHeight);

  for (var i = 0; i < data.length; i++) {
    var left = (i === 0 ? 0 : i);
    var scaledHeight = ((60 - data[i][1]) * fpsHeightScale);
    ctx.lineTo((data.length - left) + chartLabelOffset, scaledHeight);
  }

  ctx.lineWidth = 1;
  ctx.stroke();
}

render.chart.labels = function(ctx) {
  var fontSize = 10;
  ctx.font = "600 " + fontSize + "px sans-serif";
  // no
  ctx.fillStyle = failColor;
  ctx.fillText(0, 0, maxHeight);
  // meh
  ctx.fillStyle = warnColor;
  ctx.fillText(30, 0, ((maxHeight / 2) + (fontSize / 2)));
  // wins internet
  ctx.fillStyle = passColor;
  ctx.fillText(60, 0, 0 + fontSize);
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
  for (var i = 0; i < 3; i++) {
    var top = ((maxHeight / 2) * i) + 0.5 - (i === 2 ? 1 : 0);
    ctx.beginPath();
    ctx.moveTo(0.5 + chartLabelOffset, top);
    ctx.lineTo(maxWidth + 0.5, top);
    ctx.lineWidth = 1;
    ctx.strokeStyle = secondaryColor;
    ctx.stroke()
  }
}