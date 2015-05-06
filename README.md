Justice.js
==================================================
![ScreenShot](http://i.imgur.com/zKaj6fD.png)
Justice will create an on page toolbar that displays page timing metrics and a streaming fps meter. Budgets are also supported for timing metrics.
[> DEMO <](http://okor.github.io/justice/)
======

Budget results are color coded based on budgets:
  - Over budget:  Red
  - > 80% budget: Yellow
  - Under budget: Green

The FPS meter does not support budgets at this time but does color code the spline (or optional dot type) chart, assuming a goal of 60 FPS.

The "requests" metric also supports budgets and is unique in that it polls for changes to that metric over time, since most webpages these days load a boat load of stuff async after page load. In the future it would be possible to seperate this metric into "Sync Requests" and "Async Requests". But not right now.

The tiny button in the lower right hand corner is a simple hide show with localstorage persistance.


** Justice is under active development and the API may change. **


Why
===
The goal of this project it to provide insight into the performance of a webpage. I would refer to it as a "high level performance discovery tool". My vision for the tool is to allow developers, support team members and anyone interested to discover troublesome performance issues that might not have been previously known. Networks like Vox Media for instance, have many data, media and page types which could end up being manifested in many different combinations. Justice can be rolled out to authenticated users so they can become more aware of perf as they browse their own sites and applications.

Once a page show signs of performance issues, next steps would likely include recording the performance violation and escalating investigation into the whys - using more robust tools like Chromes dev tools or whatever the team is using for deep performance debugging.

I am considering adding a reporting agent to make recording violations easier, which would probably be an optional callback provided to the Justice initializer. Then one could push the violation data set to some arbitrary endpoint.

## Use
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

      warnThreshold: 0.70,
      showFPS: true,
      chartType: 'spline'
    });
</script>
```

## Develop
The default grunt process will watch files for changes and handle builds. I keep examples/simple.html open in a browser, which will automatically be refreshed on build.
```
npm install
grunt
```
I like to keep an eye on fill size, so you can additionally watch that.
```
watch tail log/size-log.txt
```


## Contribute
Pull requests are always welcome. Before you plan a PR, please ensure the values and functionality listed below will be maintained with your PR.

Checkout the to do list: https://waffle.io/okor/justice

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

