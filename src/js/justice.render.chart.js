import { settings } from "./justice.cache";

var fpsHeightScale = settings.maxHeight / 60;

function renderChartReset(ctx, canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  renderChartLines(ctx);
  renderChartLabels(ctx);
  renderChartGradient(ctx);
}

function renderChartLabels(ctx) {
  var fontSize = 10;
  ctx.font = "600 " + fontSize + "px sans-serif";
  // no
  ctx.fillStyle = settings.failColor;
  ctx.fillText(0, 0, settings.maxHeight);
  // meh
  ctx.fillStyle = settings.warnColor;
  ctx.fillText(30, 0, ((settings.maxHeight / 2) + (fontSize / 2)));
  // wins internet
  ctx.fillStyle = settings.passColor;
  ctx.fillText(60, 0, 0 + fontSize);
}

function renderChartGradient(ctx) {
  var grad = ctx.createLinearGradient(0, settings.maxHeight,0,0);
  grad.addColorStop(0, settings.failColor); // you crazy fool
  grad.addColorStop(0.25, settings.failColor); // bad zone
  grad.addColorStop(0.5, settings.warnColor); // warning
  grad.addColorStop(1, settings.passColor); // da sweetness
  ctx.strokeStyle = grad;
  ctx.fillStyle = grad;
}

function renderChartLines(ctx) {
  for (var i = 0; i < 3; i++) {
    var top = ((settings.maxHeight / 2) * i) + 0.5 - (i === 2 ? 1 : 0);
    ctx.beginPath();
    ctx.moveTo(0.5 + settings.chartLabelOffset, top);
    ctx.lineTo(settings.maxWidth + 0.5, top);
    ctx.lineWidth = 1;
    ctx.strokeStyle = settings.secondaryColor;
    ctx.stroke();
  }
}

export function getFpsRenderer(chartType) {
  var chartRenderer = null;

  if (chartType === 'spline') {
    chartRenderer = renderChartSplineType;
  } else if (chartType === 'dots') {
    chartRenderer = renderChartDotsType;
  }

  return chartRenderer;
}

function renderChartDotsType(ctx, canvas, data) {
  renderChartReset(ctx, canvas);
  for (var i = 0; i < data.length; i++) {
    var scaledHeight = ((60 - data[i][1]) * fpsHeightScale);
    ctx.fillRect( (data.length - i) + settings.chartLabelOffset, scaledHeight, 1.5, 1.5);
  }
}

function renderChartSplineType(ctx, canvas, data) {
  renderChartReset(ctx, canvas);

  ctx.beginPath();
  var startHeight = data.length > 0 ? data[data.length] : 0;
  ctx.moveTo(0, startHeight);

  for (var i = 0; i < data.length; i++) {
    var left = (i === 0 ? 0 : i);
    var scaledHeight = ((60 - data[i][1]) * fpsHeightScale);
    ctx.lineTo((data.length - left) + settings.chartLabelOffset, scaledHeight);
  }

  ctx.lineWidth = 1;
  ctx.stroke();
}

