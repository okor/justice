/////////////////////
//   Collectors    //
/////////////////////

// load time
function getLoadTime() {
  return timing.loadEventStart - timing.navigationStart;
}

// from first byte to dom complete
function getDomComplete() {
  return timing.domComplete - timing.domLoading;
}

// from first byte to dom is interactive
function getDomInteractive() {
  return timing.domInteractive - timing.domLoading;
}

function getNumRequests() {
  // turn on the dom.enable_resource_timing in firefox about:config
  if (performance.getEntries) {
    return performance.getEntries().length;
  } else {
    return '?';
  }
}

// only tracks fps, doesn't handle rendering
function trackFPS(time) {
  if (!dataFpsLastTime) {
    dataFpsLastTime = time;
  } else {
    var delta = (time - dataFpsLastTime) / 1000;
    var fps = 1 / delta;
    var fpsClipped = Math.floor(fps > 60 ? 60 : fps);
    dataFpsCurrent = fpsClipped;
    dataFpsHistory.push([fpsClipped, fpsClipped]);
    if (dataFpsHistory.length > maxHistory) {
      dataFpsHistory.shift();
    }
    dataFpsLastTime = time;
  }
}