'use strict';
var NinjaGuru = (function(timing) {

  var t = window.performance.timing;
  var wrapperDiv = document.createElement('div');

  // from first byte to dom complete
  function getDomComplete() {
    return t.domComplete - t.domLoading;
  }

  // from first byte to dom is interactive
  function getDomInteractive() {
    return t.domInteractive - t.domLoading;
  }

  function renderStat(label, value, unitLabel) {
    return [
      '<div style="display: inline-block; margin-right: 4em; font-size: 16px;">',
        '<span style="font-weight: bold">' + label + ': </span>' + getDomComplete() + unitLabel +
      ' </div>'
    ].join('');
  }

  function renderStats(stats) {
    var statsHTML = [
      renderStat('domComplete', getDomComplete(), 'ms'),
      renderStat('domInteractive', getDomInteractive(), 'ms')
    ].join('')

    wrapperDiv.innerHTML = statsHTML;
  }

  function initUI(content) {
    var wrapperStyles = [
      'position: fixed;',
      'bottom: 0px;',
      'width: 100%;',
      'height: 40px;',
      'z-index: 100;',
      'background: rgba(0, 0, 0, 0.8);',
      'color: #EEBF49;',
      'padding: 10px;',
      'box-sizing: border-box;',
      'font-family: monospace'
    ];

    wrapperDiv.style.cssText = wrapperStyles.join('');
    document.body.appendChild(wrapperDiv);
  }

  return {
    init: function() {

      if (!window.performance || !window.performance.timing) return;

      if (document.readyState === 'complete') {
        seriouslyInit();
      } else {
        window.onload = seriouslyInit;
      }

      function seriouslyInit() {
        initUI();
        renderStats();
      }
    }
  }

})();

NinjaGuru.init();