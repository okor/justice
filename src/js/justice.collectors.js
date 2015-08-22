/////////////////////
//   Collectors    //
/////////////////////

import { settings, dataFpsHistory } from "./justice.cache";

var shrug = '¯\\_(ツ)_/¯';

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
  if (window.chrome && chrome.loadTimes) {
    // Convert to ms
    var loadTimes = chrome.loadTimes();
    firstPaint = loadTimes.firstPaintTime * 1000;
    firstPaint = firstPaint - (loadTimes.startLoadTime * 1000);
    return firstPaint.toFixed(0);
  }

  if (typeof settings.timing.msFirstPaint === 'number') {
    firstPaint = settings.timing.msFirstPaint;
    firstPaint = firstPaint - settings.timing.navigationStart;
    return firstPaint.toFixed(0);
  }

  return shrug;
}

export function getNumRequests() {
  return performance.getEntries ? performance.getEntries().length : shrug;
}

export function getTTFB() {
  return settings.timing.responseStart - settings.timing.connectEnd;
}

var dataFpsLastTime = null;

// only tracks fps, doesn't handle rendering
export function trackFPS(time) {
  if (dataFpsLastTime) {
    var delta = (time - dataFpsLastTime) / 1000;
    var fps = 1 / delta;
    var fpsClipped = fps > 60 ? 60 : Math.floor(fps);
    dataFpsHistory.push([fpsClipped, fpsClipped]);

    var maxHistory = settings.maxWidth - settings.chartLabelOffset;
    if (dataFpsHistory.length > maxHistory) {
      dataFpsHistory.shift();
    }
  }

  dataFpsLastTime = time;
}
