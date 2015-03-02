Justice.js
==================================================
The goal of this project it to provide insight into the performance of a webpage. Justice will create an on page widget that displays various performance metrics, including a streaming fps meter.

![ScreenShot](http://i.imgur.com/zKaj6fD.png)


## Using Justice
Simple
```
<script type="text/javascript" src="../build/justice.mapped.min.js"></script>
<script type="text/javascript">
  Justice.init();
</script>
```
With options
```
<script type="text/javascript" src="../build/justice.mapped.min.js"></script>
<script type="text/javascript">
    Justice.init({
      metrics: {
        pageLoad: { budget: 200 },
        domComplete: { budget: 800 },
        domInteractive: { budget: 200 },
        requests: { budget: 6 }
      },

      showFPS: true,
      chartType: 'spline'
    });
</script>
```

#### Core Values:
  - Easily embeddable
  - No dependencies
  - As small as possible
  - Render itself at 60fps or greater


#### Core Functionality:
  - Load times
  - FPS
  - works in modern browsers + graceful failure [TODO]


#### Roadmap
  - console.log'ish proxy
  - window on error log
  - bookmarklet
  - cdn.js release
  - npm release
  - chrome plugin

#### Release versioning
  - `<major>.<minor>.<patch>`, ex: 0.1.8

