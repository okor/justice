import { settings, options, activeMetrics } from "./justice.cache";

function getMetricRatingClass(metricValue, metricBudget) {
  var rating = '';

  if (metricValue > metricBudget) {
    rating = 'fail';
  } else if (metricValue > ( metricBudget * options.warnThreshold) ) {
    rating = 'warn';
  } else {
    rating = 'pass';
  }

  return rating;
}

function getSingleTextMetricHTML(metricKey, metric, budget) {
  var metricValue = metric.collector();
  var ratingClass = getMetricRatingClass(metricValue, budget);

  return `<div class="${settings.prefix}-metric" id="${metric.id}">
      <span class="${settings.prefix}-title">${metric.label}: </span>
      <span class="${settings.prefix}-text ${ratingClass}">${metricValue + metric.unitLabel}</span>
    </div>`;
}

export function getAllTextMetricsHTML(metrics) {
  var textMetricsHTML = [];

  for (var k in activeMetrics ) {
    var html = getSingleTextMetricHTML( k, activeMetrics[k], options.metrics[k].budget );
    textMetricsHTML.push(html);
  }

  return `<div id="${settings.prefix}-text-metrics" class="${settings.prefix}-metric-wrap">
    ${ textMetricsHTML.join('') }
  </div>`;
}

export function getAllChartMetricsHTML() {
  var metricHTML = !options.showFPS ? '' :
    `<div class="${settings.prefix}-metric chart">
      <span class="${settings.prefix}-title">FPS: </span>
      <canvas id="${settings.prefix}-fps" class="${settings.prefix}-canvas" height="${settings.maxHeight}" width="${settings.maxWidth}"></canvas>
    </div>`;

  return metricHTML;
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
//   },
//
//   chartType: 'spline'
// };


// TODO: remove all data munging from this area
// put in a completely seperate thing
// this shit should only handle rendering
// this shit should not access non-local variables (pass in all the things)
// anything called a "utils" should
  // not access external data
  // return a helpful value
  // get<SomeThing>

