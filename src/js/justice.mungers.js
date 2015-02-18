function mergeOptions(userOpts) {
  var mergedOptions = {};
  var userOpts = userOpts || {};

  for (var k in defaultOptions) {
    mergedOptions[k] = defaultOptions[k];
  }

  for (var k in userOpts) {
    mergedOptions[k] = userOpts[k];
  }

  return mergedOptions;
}


function setActiveMetrics(options, activeMetrics, availableMetrics) {
  for (var k in options.metrics) {
    activeMetrics[k] = availableMetrics[k];
  }
}