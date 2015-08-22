import * as collectors from "./justice.collectors";

// need to get a better waying of syncing these values with css
export var settings = {
  primaryColor: "rgb(241, 250, 195)",
  secondaryColor: "rgb(48, 48, 48)",
  failColor: "rgb(206, 69, 45)",
  warnColor: "rgb(212, 202, 61)",
  passColor: "rgb(65, 155, 163)",

  prefix: "justice",
  maxWidth: 300,
  maxHeight: 40,

  chartLabelOffset: 20,
  timing: window.performance.timing
};

// FPS
export var dataFpsHistory = [];

// These are the default options
export var options = {
  metrics: {
    TTFB:             { budget: 200   },
    domInteractive:   { budget: 250   },
    domComplete:      { budget: 800   },
    firstPaint:       { budget: 1000  },
    pageLoad:         { budget: 2000  },
    requests:         { budget: 6     },
  },

  'interface': {
    position: 'fixed',
    placement: 'bottom'
  },

  warnThreshold: 0.8,
  chartType: 'spline',
  showFPS: true
};


// TO DO: break these into text: and chart:
export var availableMetrics = {
  pageLoad:         { id: settings.prefix + '-load',         label: 'Load',        unitLabel: 'ms',  collector: collectors.getLoadTime        },
  firstPaint:       { id: settings.prefix + '-paint',        label: 'Paint',       unitLabel: 'ms',  collector: collectors.getFirstPaint      },
  TTFB:             { id: settings.prefix + '-ttfb',         label: 'TTFB',        unitLabel: 'ms',  collector: collectors.getTTFB            },
  domComplete:      { id: settings.prefix + '-complete',     label: 'Complete',    unitLabel: 'ms',  collector: collectors.getDomComplete     },
  domInteractive:   { id: settings.prefix + '-interactive',  label: 'Interactive', unitLabel: 'ms',  collector: collectors.getDomInteractive  },
  requests:         { id: settings.prefix + '-requests',     label: 'Requests',    unitLabel: '',    collector: collectors.getNumRequests     }
};

export var activeMetrics = {};

