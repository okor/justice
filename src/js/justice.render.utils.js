render.utils.cacheNodes = function(textMetrics) {
  domDisplayChartFpsCanvas = document.getElementById(prefix + '-fps')
  domDisplayChartFpsCanvasCtx = domDisplayChartFpsCanvas.getContext('2d');
}


render.utils.getTextHTML = function(metrics) {
  var textMetricsHTML = [];
  for (var i = 0; i < metrics.length; i++) {
    textMetricsHTML.push([
      '<div class="' + prefix + '-metric" id="' + metrics[i].id + '">',
        '<span class="' + prefix + '-title">' + metrics[i].label + ': </span>',
        '<span class="' + prefix + '-text">' + metrics[i].val + metrics[i].unitLabel + '</span>',
      '</div>'
    ].join(''))
  }
  return '<div id="' + prefix + '-text-metrics" class="' + prefix + '-metric-wrap">' + textMetricsHTML.join('') + '</div>';
}

render.utils.getChartHTML = function() {
  return [
    '<div class="' + prefix + '-metric chart">',
      '<span class="' + prefix + '-title">FPS: </span>',
      '<canvas id="' + prefix + '-fps" class="' + prefix + '-canvas" height="' + maxHeight + '" width="' + maxWidth + '"></canvas>',
    '</div>'
  ].join('');
}


render.utils.getUIHTML = function(partials) {
  return [
    partials.text,
    partials.charts,
  ].join('')
}

render.utils.getTextMetrics = function() {
  return [
    { id: prefix + '-load',         label: 'Load',        val: getLoadTime(),       unitLabel: 'ms' },
    { id: prefix + '-complete',     label: 'Complete',    val: getDomComplete(),    unitLabel: 'ms' },
    { id: prefix + '-interactive',  label: 'Interactive', val: getDomInteractive(), unitLabel: 'ms'   },
    { id: prefix + '-requests',     label: 'Requests',    val: getNumRequests(),    unitLabel: '' }
  ]
}