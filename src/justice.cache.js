/////////////////////
//   dat cache     //
/////////////////////

// need to get a better waying of syncing these values with css
var maxWidth = 300;
var maxHeight = 40;
var fpsHeightScale = maxHeight / 60;
var chartLabelOffset = 20;
var maxHistory = maxWidth - chartLabelOffset;
var primaryColor = "rgb(241, 250, 195)";
var secondaryColor = "rgb(36, 36, 36)";
var failColor = "rgb(206, 69, 45)";
var warnColor = "rgb(212, 202, 61)";
var passColor = "rgb(65, 155, 163)";
var slack = 1; // gap between data points - 1, must figure out how to make slower
var lastTextUpdate = 0;

var cache = {

  timing: window.performance.timing,

  dom: {
    wrap: document.createElement('div'),
    bar: {
      prefix: "justice",
      node: null
    },
    display: {
      text: {
        loadTime: document.createElement('div'),
        domComplete: document.createElement('div'),
        domInteractive: document.createElement('div'),
        httpRequests: document.createElement('div')
      },
      chart: {
        fps: document.createElement('div'),
        fpsCanvas: document.createElement('canvas'),
        fpsCanvasCtx: null
      }
    }
  },

  data: {
    fps: {
      current: 0,
      history: [],
      lastTime: null
    }
  },

  chart: {
    fpsRenderer: null, // function
  },

  tickCount: 0
}