var options = {};

var defaultOptions = {
  metrics: {
    pageLoad: { budget: 1000 },
    domComplete: { budget: 800 },
    domInteractive: { budget: 200 },
    requests: { budget: 20 }
  },

  interface: {
    position: 'fixed',
    placement: 'bottom'
  }
};

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
