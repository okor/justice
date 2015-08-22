/////////////////////
//   Collectors    //
/////////////////////

import { settings, dataFpsHistory } from "./justice.cache";

// load time
export function getLoadTime() {
  return settings.timing.loadEventStart - settings.timing.navigationStart;
}

// from first byte to dom complete
export function getDomComplete() {
  return settings.timing.domComplete - settings.timing.domLoading;
}

// from first byte to dom is interactive
export function getDomInteractive() {
  return settings.timing.domInteractive - settings.timing.domLoading;
}

export function getFirstPaint() {
  var firstPaint = 0;
  if (window.chrome && window.chrome.loadTimes) {
    // Convert to ms
    firstPaint = window.chrome.loadTimes().firstPaintTime * 1000;
    firstPaint = firstPaint - (window.chrome.loadTimes().startLoadTime*1000);
    return firstPaint.toFixed(0);
  } else if (typeof settings.timing.msFirstPaint === 'number') {
    firstPaint = settings.timing.msFirstPaint;
    firstPaint = firstPaint - settings.timing.navigationStart;
    return firstPaint.toFixed(0);
  } else {
    return '¯\\_(ツ)_/¯';
  }
}

export function getNumRequests() {
  // turn on the dom.enable_resource_timing in firefox about:config
  if (performance.getEntries) {
    return performance.getEntries().length;
  } else {
    return '¯\\_(ツ)_/¯';
  }
}

export function getTTFB() {
  return settings.timing.responseStart - settings.timing.connectEnd;
}

var dataFpsLastTime = null;

// only tracks fps, doesn't handle rendering
export function trackFPS(time) {
  if (!dataFpsLastTime) {
    dataFpsLastTime = time;
  } else {
    var delta = (time - dataFpsLastTime) / 1000;
    var fps = 1 / delta;
    var fpsClipped = fps > 60 ? 60 : Math.floor(fps);
    dataFpsHistory.push([fpsClipped, fpsClipped]);

    var maxHistory = settings.maxWidth - settings.chartLabelOffset;
    if (dataFpsHistory.length > maxHistory) {
      dataFpsHistory.shift();
    }
    dataFpsLastTime = time;
  }
}
