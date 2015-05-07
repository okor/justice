// these should all be in a settings hash
var primaryColor = "rgb(241, 250, 195)";
var secondaryColor = "rgb(48, 48, 48)";
var failColor = "rgb(206, 69, 45)";
var warnColor = "rgb(212, 202, 61)";
var passColor = "rgb(65, 155, 163)";

// need to get a better waying of syncing these values with css
var prefix = "justice";
var maxWidth = 300;
var maxHeight = 40;

var fpsHeightScale = maxHeight / 60;
var chartLabelOffset = 20;
var maxHistory = maxWidth - chartLabelOffset;

var lastTextUpdate = 0;
var tickCount = 0;
var timing = null;

// Nodes
var wrap = null;
var domBarNode = null;

// FPS
var fpsRenderer = null;
var dataFpsCurrent = 0;
var dataFpsHistory = [];
var dataFpsLastTime = null;

var domDisplayChartFps = null;
var domDisplayChartFpsCanvas = null;
var domDisplayChartFpsCanvasCtx = null;


// Text
var domDisplayTextLoadTime = null;


var defaultOptions = {
  metrics: {
    TTFB:             { budget: 200   },
    domInteractive:   { budget: 250   },
    domComplete:      { budget: 800   },
    firstPaint:       { budget: 1000  },
    pageLoad:         { budget: 2000  },
    requests:         { budget: 6     },
  },

  interface: {
    position: 'fixed',
    placement: 'bottom'
  },

  warnThreshold: 0.8,
  chartType: 'spline',
  showFPS: true
};

var options = {};


// TO DO: break these into text: and chart:
var availableMetrics = {
  pageLoad:         { id: prefix + '-load',         label: 'Load',        unitLabel: 'ms',  collector: getLoadTime        },
  firstPaint:       { id: prefix + '-paint',        label: 'Paint',       unitLabel: 'ms',  collector: getFirstPaint      },
  TTFB:             { id: prefix + '-ttfb',         label: 'TTFB',        unitLabel: 'ms',  collector: getTTFB            },
  domComplete:      { id: prefix + '-complete',     label: 'Complete',    unitLabel: 'ms',  collector: getDomComplete     },
  domInteractive:   { id: prefix + '-interactive',  label: 'Interactive', unitLabel: 'ms',  collector: getDomInteractive  },
  requests:         { id: prefix + '-requests',     label: 'Requests',    unitLabel: '',    collector: getNumRequests     }
}

var activeMetrics = {};

