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

function getFirstPaint() {
  var firstPaint = 0;
  if (window.chrome && window.chrome.loadTimes) {
    // Convert to ms
    firstPaint = window.chrome.loadTimes().firstPaintTime * 1000;
    firstPaint = firstPaint - (window.chrome.loadTimes().startLoadTime*1000);
    return firstPaint.toFixed(0);
  } else if (typeof window.performance.timing.msFirstPaint === 'number') {
    firstPaint = window.performance.timing.msFirstPaint;
    firstPaint = firstPaint - window.performance.timing.navigationStart;
    return firstPaint.toFixed(0);
  } else {
    return '¯\\_(ツ)_/¯';
  }
}

function getNumRequests() {
  // turn on the dom.enable_resource_timing in firefox about:config
  if (performance.getEntries) {
    return performance.getEntries().length;
  } else {
    return '¯\\_(ツ)_/¯';
  }
}

function getTTFB() {
  return timing.responseStart - timing.connectEnd;
}

// only tracks fps, doesn't handle rendering
function trackFPS(time) {
  if (!dataFpsLastTime) {
    dataFpsLastTime = time;
  } else {
    var delta = (time - dataFpsLastTime) / 1000;
    var fps = 1 / delta;
    var fpsClipped = fps > 60 ? 60 : Math.floor(fps);
    dataFpsCurrent = fpsClipped;
    dataFpsHistory.push([fpsClipped, fpsClipped]);
    if (dataFpsHistory.length > maxHistory) {
      dataFpsHistory.shift();
    }
    dataFpsLastTime = time;
  }
}
