/////////////////////
//   Collectors    //
/////////////////////

// load time
function getLoadTime() {
  return cache.timing.loadEventStart - cache.timing.navigationStart;
}

// from first byte to dom complete
function getDomComplete() {
  return cache.timing.domComplete - cache.timing.domLoading;
}

// from first byte to dom is interactive
function getDomInteractive() {
  return cache.timing.domInteractive - cache.timing.domLoading;
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
  if (!cache.data.fps.lastTime) {
    cache.data.fps.lastTime = time;
  } else {
    var delta = (time - cache.data.fps.lastTime) / 1000;
    var fps = 1 / delta;
    var fpsClipped = Math.floor(fps > 60 ? 60 : fps);
    cache.data.fps.current = fpsClipped;
    cache.data.fps.history.push([fpsClipped, fpsClipped]);
    if (cache.data.fps.history.length > (maxHistory / slack)) {
      cache.data.fps.history.shift();
    }
    cache.data.fps.lastTime = time;
  }
}