render.utils.cacheNodes = function() {
  domDisplayChartFpsCanvas = document.getElementById(prefix + '-fps')
  domDisplayChartFpsCanvasCtx = domDisplayChartFpsCanvas.getContext('2d');
}

// var defaultOptions = {
//   metrics: {
//     pageLoad: { budget: 1000 },
//     domComplete: { budget: 800 },
//     domInteractive: { budget: 200 },
//     requests: { budget: 20 }
//   },

//   interface: {
//     position: 'fixed',
//     placement: 'bottom'
//   }
// };

var availableMetrics = {
  pageLoad:         { id: prefix + '-load',         label: 'Load',        unitLabel: 'ms',  collector: getLoadTime       },
  domComplete:      { id: prefix + '-complete',     label: 'Complete',    unitLabel: 'ms',  collector: getDomComplete     },
  domInteractive:   { id: prefix + '-interactive',  label: 'Interactive', unitLabel: 'ms',  collector: getDomInteractive  },
  requests:         { id: prefix + '-requests',     label: 'Requests',    unitLabel: '',    collector: getNumRequests     }
}

function getMetricRatingClass(metricValue, metricBudget) {
  var rating = '';

  if (metricValue > metricBudget) {
    rating = 'fail';
  } else if (metricValue > ( metricBudget / 2) ) {
    rating = 'warn';
  } else {
    rating = 'pass';
  }

  return rating;
}

function prerenderSingleTextMetric(metricKey, metric, budget) {
  var metricValue = metric.collector();
  var ratingClass = getMetricRatingClass(metricValue, budget);

  return [
    '<div class="' + prefix + '-metric" id="' + metric.id + '">',
      '<span class="' + prefix + '-title">' + metric.label + ': </span>',
      '<span class="' + prefix + '-text ' + ratingClass + '">' + metricValue + metric.unitLabel + '</span>',
    '</div>'
  ].join('');
}

render.utils.getTextHTML = function(metrics) {
  var textMetricsHTML = [];

  for (var k in availableMetrics ) {
    var html = prerenderSingleTextMetric( k, availableMetrics[k], options.metrics[k].budget );
    textMetricsHTML.push(html);
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
    { metricKey: 'pageLoad', id: prefix + '-load',         label: 'Load',        val: getLoadTime(),       unitLabel: 'ms' },
    { metricKey: 'domComplete', id: prefix + '-complete',     label: 'Complete',    val: getDomComplete(),    unitLabel: 'ms' },
    { metricKey: 'domInteractive', id: prefix + '-interactive',  label: 'Interactive', val: getDomInteractive(), unitLabel: 'ms'   },
    { metricKey: 'requests', id: prefix + '-requests',     label: 'Requests',    val: getNumRequests(),    unitLabel: '' }
  ]
}