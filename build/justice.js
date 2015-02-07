"use strict";

!function() {
    var cssText = ".justice {\n  position: fixed;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  background: #1c1c22;\n  padding: 0 10px 10px 10px;\n  box-sizing: border-box;\n  font-size: 12px;\n  font-family: monospace;\n  display: flex;\n  flex-flow: row wrap;\n  justify-content: space-between;\n  z-index: 2147483647; }\n  @media (min-width: 1235px) {\n    .justice {\n      padding-bottom: 10px; } }\n  .justice .justice-metric {\n    height: 40px;\n    color: #f1fac3;\n    width: 150px;\n    display: inline-block;\n    display: flex;\n    align-items: center;\n    margin-top: 10px; }\n    .justice .justice-metric.chart {\n      width: 300px; }\n  .justice .justice-title {\n    text-transform: uppercase;\n    padding: 3px 1.5em 3px 3px;\n    color: #dfdfdf; }\n  .justice .justice-text {\n    color: #419ba3; }\n\n/*# sourceMappingURL=justice.css.map */\n", styleEl = document.createElement("style");
    if (document.getElementsByTagName("head")[0].appendChild(styleEl), styleEl.styleSheet) styleEl.styleSheet.disabled || (styleEl.styleSheet.cssText = cssText); else try {
        styleEl.innerHTML = cssText;
    } catch (e) {
        styleEl.innerText = cssText;
    }
}();

var justice = function() {
    function getLoadTime() {
        return cache.timing.loadEventStart - cache.timing.navigationStart;
    }
    function getDomComplete() {
        return cache.timing.domComplete - cache.timing.domLoading;
    }
    function getDomInteractive() {
        return cache.timing.domInteractive - cache.timing.domLoading;
    }
    function getNumRequests() {
        return performance.getEntries ? performance.getEntries().length : "?";
    }
    function trackFPS(time) {
        if (cache.data.fps.lastTime) {
            var delta = (time - cache.data.fps.lastTime) / 1e3, fps = 1 / delta, fpsClipped = Math.floor(fps > 60 ? 60 : fps);
            cache.data.fps.current = fpsClipped, cache.data.fps.history.push([ fpsClipped, fpsClipped ]), 
            cache.data.fps.history.length > maxHistory / slack && cache.data.fps.history.shift(), 
            cache.data.fps.lastTime = time;
        } else cache.data.fps.lastTime = time;
    }
    function setChartType(chartType) {
        cache.chart.fpsRenderer = render.chart.stream[chartType];
    }
    function tick(time) {
        cache.tickCount++, trackFPS(time), cache.chart.fpsRenderer(cache.dom.display.chart.fpsCanvasCtx, cache.dom.display.chart.fpsCanvas, cache.data.fps.history), 
        null === lastTextUpdate && (lastTextUpdate = time), window.requestAnimationFrame(tick);
    }
    function seriouslyInit() {
        render.ui(), render.text(), setChartType("spline"), window.requestAnimationFrame(tick);
    }
    var maxWidth = 300, maxHeight = 40, fpsHeightScale = maxHeight / 60, chartLabelOffset = 20, maxHistory = maxWidth - chartLabelOffset, secondaryColor = "rgb(36, 36, 36)", failColor = "rgb(206, 69, 45)", warnColor = "rgb(212, 202, 61)", passColor = "rgb(65, 155, 163)", slack = 1, lastTextUpdate = 0, cache = {
        timing: window.performance.timing,
        dom: {
            wrap: document.createElement("div"),
            bar: {
                prefix: "justice",
                node: null
            },
            display: {
                text: {
                    loadTime: document.createElement("div"),
                    domComplete: document.createElement("div"),
                    domInteractive: document.createElement("div"),
                    httpRequests: document.createElement("div")
                },
                chart: {
                    fps: document.createElement("div"),
                    fpsCanvas: document.createElement("canvas"),
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
            fpsRenderer: null
        },
        tickCount: 0
    }, render = {};
    return render.chart = {}, render.chart.stream = {}, render.ui = function() {
        cache.dom.wrap.id = cache.dom.bar.prefix, cache.dom.wrap.classList.add(cache.dom.bar.prefix), 
        cache.dom.display.text.loadTime.classList.add(cache.dom.bar.prefix + "-metric"), 
        cache.dom.wrap.appendChild(cache.dom.display.text.loadTime), cache.dom.display.text.domComplete.classList.add(cache.dom.bar.prefix + "-metric"), 
        cache.dom.wrap.appendChild(cache.dom.display.text.domComplete), cache.dom.display.text.domInteractive.classList.add(cache.dom.bar.prefix + "-metric"), 
        cache.dom.wrap.appendChild(cache.dom.display.text.domInteractive), cache.dom.display.text.httpRequests.classList.add(cache.dom.bar.prefix + "-metric"), 
        cache.dom.wrap.appendChild(cache.dom.display.text.httpRequests), cache.dom.display.chart.fps.classList.add(cache.dom.bar.prefix + "-metric"), 
        cache.dom.display.chart.fps.classList.add("chart");
        var span = document.createElement("span");
        span.classList.add(cache.dom.bar.prefix + "-title"), span.innerHTML = "FPS: ", cache.dom.display.chart.fps.appendChild(span), 
        cache.dom.display.chart.fpsCanvas.classList.add(cache.dom.bar.prefix + "-canvas"), 
        cache.dom.display.chart.fpsCanvas.height = maxHeight, cache.dom.display.chart.fpsCanvas.width = maxWidth, 
        cache.dom.display.chart.fps.appendChild(cache.dom.display.chart.fpsCanvas), cache.dom.display.chart.fpsCanvasCtx = cache.dom.display.chart.fpsCanvas.getContext("2d"), 
        cache.dom.wrap.appendChild(cache.dom.display.chart.fps), document.body.appendChild(cache.dom.wrap);
    }, render.text = function() {
        cache.dom.display.text.loadTime.innerHTML = '<span class="' + cache.dom.bar.prefix + '-title">Load: </span><span class="' + cache.dom.bar.prefix + '-text">' + getLoadTime() + "ms</span>", 
        cache.dom.display.text.domComplete.innerHTML = '<span class="' + cache.dom.bar.prefix + '-title">Complete: </span><span class="' + cache.dom.bar.prefix + '-text">' + getDomComplete() + "ms</span>", 
        cache.dom.display.text.domInteractive.innerHTML = '<span class="' + cache.dom.bar.prefix + '-title">Interactive: </span><span class="' + cache.dom.bar.prefix + '-text">' + getDomInteractive() + "ms</span>", 
        cache.dom.display.text.httpRequests.innerHTML = '<span class="' + cache.dom.bar.prefix + '-title">requests: </span><span class="' + cache.dom.bar.prefix + '-text">' + getNumRequests() + "</span>";
    }, render.chart.clear = function(ctx, canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, render.chart.stream.bar = function(ctx, canvas, data) {
        render.chart.clear(ctx, canvas), render.chart.lines(ctx), render.chart.gradient(ctx);
        for (var i = 0; i < data.length; i++) ctx.fillRect(i, data[i][1], 1, data[i][0]);
    }, render.chart.stream.dots = function(ctx, canvas, data) {
        render.chart.clear(ctx, canvas), render.chart.lines(ctx), render.chart.labels(ctx), 
        render.chart.gradient(ctx);
        for (var i = 0; i < data.length; i++) {
            var scaledHeight = (60 - data[i][1]) * fpsHeightScale;
            ctx.fillRect(data.length - i + chartLabelOffset, scaledHeight, 2, 2);
        }
    }, render.chart.stream.spline = function(ctx, canvas, data) {
        render.chart.clear(ctx, canvas), render.chart.lines(ctx), render.chart.labels(ctx), 
        render.chart.gradient(ctx), ctx.beginPath();
        var startHeight = data.length > 0 ? data[data.length] : 0;
        ctx.moveTo(0, startHeight);
        for (var i = 0; i < data.length; i++) {
            var left = 0 === i ? 0 : i * slack, scaledHeight = (60 - data[i][1]) * fpsHeightScale;
            ctx.lineTo(data.length - left + chartLabelOffset, scaledHeight);
        }
        ctx.lineWidth = 1, ctx.stroke();
    }, render.chart.labels = function(ctx) {
        var fontSize = 10;
        ctx.font = fontSize + "px sans-serif", ctx.fillStyle = failColor, ctx.fillText("0", 0, maxHeight), 
        ctx.fillStyle = warnColor, ctx.fillText("30", 0, maxHeight / 2 + fontSize / 2), 
        ctx.fillStyle = passColor, ctx.fillText("60", 0, 0 + fontSize);
    }, render.chart.gradient = function(ctx) {
        var grad = ctx.createLinearGradient(0, maxHeight, 0, 0);
        grad.addColorStop(0, failColor), grad.addColorStop(.25, failColor), grad.addColorStop(.5, warnColor), 
        grad.addColorStop(1, passColor), ctx.strokeStyle = grad, ctx.fillStyle = grad;
    }, render.chart.lines = function(ctx) {
        ctx.beginPath(), ctx.moveTo(.5 + chartLabelOffset, .5), ctx.lineTo(maxWidth + .5, .5), 
        ctx.lineWidth = 1, ctx.strokeStyle = secondaryColor, ctx.stroke(), ctx.beginPath(), 
        ctx.moveTo(.5 + chartLabelOffset, maxHeight / 2 + .5), ctx.lineTo(maxWidth + .5, maxHeight / 2 + .5), 
        ctx.lineWidth = 1, ctx.strokeStyle = secondaryColor, ctx.stroke(), ctx.beginPath(), 
        ctx.moveTo(.5 + chartLabelOffset, maxHeight - 1 + .5), ctx.lineTo(maxWidth + .5, maxHeight - 1 + .5), 
        ctx.lineWidth = 1, ctx.strokeStyle = secondaryColor, ctx.stroke();
    }, {
        init: function() {
            window.performance && window.performance.timing && ("complete" === document.readyState ? seriouslyInit() : window.onload = seriouslyInit);
        }
    };
}();

justice.init();