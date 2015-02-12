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
// A list of valid metric types
var dictionary = [
  'pageLoad',
  'domComplete',
  'domInteractive',
  'requests',
  'fps'
];


function mergeOptions(userOpts) {
  var mergedOptions = {};
  if (!userOpts) return; // use default options

  for (var k in defaultOptions) {
    mergedOptions[k] = defaultOptions[k];
  }

  for (var k in userOpts) {
    mergedOptions[k] = userOpts[k];
  }

  return mergedOptions;
}
