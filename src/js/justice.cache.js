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
var timing = window.performance.timing;

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
