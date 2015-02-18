render.utils.cacheNodes = function() {
  domDisplayChartFpsCanvas = document.getElementById(prefix + '-fps')
  domDisplayChartFpsCanvasCtx = domDisplayChartFpsCanvas.getContext('2d');
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

  for (var k in activeMetrics ) {
    var html = prerenderSingleTextMetric( k, activeMetrics[k], options.metrics[k].budget );
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


// TODO: remove all data munging from this area
// put in a completely seperate thing
// this shit should only handle rendering
// this shit should not access non-local variables (pass in all the things)
// anything called a "utils" should
  // not access external data
  // return a helpful value
  // get<SomeThing>

