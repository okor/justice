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
        '<span class="' + prefix + '-text">' + metrics[i].val + 'ms</span>',
      '</div>'
    ].join(''))
  }
  return textMetricsHTML;
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
    '<div id="justice" class="justice">',
      partials.join(''),
    '</div>'
  ].join('')
}

render.utils.getTextMetrics = function() {
  return [
    { id: prefix + '-load',         label: 'Load',        val: getLoadTime() },
    { id: prefix + '-complete',     label: 'Complete',    val: getDomComplete() },
    { id: prefix + '-interactive',  label: 'Interactive', val: getDomInteractive() },
    { id: prefix + '-requests',     label: 'Requests',    val: getNumRequests() }
  ]
}