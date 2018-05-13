
const Easing = require("easing")
const html = require('choo/html')
const choo = require('choo')
const lib = require("./lib");
const path = require("path")
const Nanocomponent = require("nanocomponent")
const css = require("sheetify")
css("./style.css")
css("./materialize.min.css")

class EaseComponent extends Nanocomponent {
  constructor () {
    super()
    this.functionName = '';
    this.canvas;
    this.ctx;
    this.list;
    this.width = 80;
    this.height = 80;
    this.maxPoints = 200;
  }

  createCanvas () {
    return html`<canvas width="${this.width}" height="${this.height}"></canvas>`
  }

  update () {
    return false
  }

  unload (text) {
    console.log('No longer mounted on the DOM!')
  }
}

class EaseComponentList extends EaseComponent {
  constructor () {
    super()
  }
  createElement (functionName, options) {

    this.functionName = functionName
    this.canvas = this.createCanvas();
    this.ctx = this.canvas.getContext("2d");
    this.ctx.moveTo(0,this.height);
    if (functionName == "sigmoid") {
      this.list = Easing(this.maxPoints, functionName, {start:-10, end:10});
    } else {
      this.list = Easing(this.maxPoints, functionName, options)
    }
    const spacing = (this.width / this.maxPoints)
    this.list.forEach((value,idx) => {
      this.ctx.lineTo(idx*spacing, this.height - (value*this.height))
    })
    this.ctx.stroke();
    return html`
    <div class="easeComponent col s2">
      <div>
        <div class="componentName">${functionName}</div>
        ${this.canvas}
      </div>
      <div class="controls"></div>
    </div>
    `
  }
}

class EaseComponentEvent extends EaseComponent {
  constructor () {
    super()
  }
  createElement (functionName) {

    this.functionName = functionName
    this.canvas = this.createCanvas();
    this.ctx = this.canvas.getContext("2d");
    if (functionName == "sigmoid") {
      this.ee = Easing.event(this.maxPoints, functionName, {start:-10, end: 10, duration:3*1000, repeat:true})
    } else {
      this.ee = Easing.event(this.maxPoints, functionName, {duration:3*1000, repeat:true})
    }
    const spacing = (this.width / this.maxPoints)
    let idx = 0;
    let pointList = [];
    this.lastPoint = { x : 0, y: this.height};
    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = 2;

    this.ee.on("data", (value) => {
      if (idx === 0) {
        this.ctx.clearRect(0,0,this.width, this.height)
        this.ctx.beginPath();
        this.ctx.moveTo(0,this.height);
      }
      let x = idx*spacing;
      let y = this.height - (value*this.height);
      pointList.push({x, y})
      this.ctx.lineTo(x, y)
      this.lastPoint = { x , y }
      this.ctx.stroke();
      idx++;
    })
    this.ee.on("end", () => {
    })
    this.ee.on("repeat", () => {
      pointList = [];
      idx = 0;
    })
    return html`
    <div class="easeComponent col s2">
      <div>
        <div class="componentName">${functionName} - event </div>
        ${this.canvas}
      </div>
      <div class="controls"></div>
    </div>
    `
  }
}


var app = choo()
app.use((state, emit) => {
  state.eases = {
    list: {},
    event : {}
  };
})
app.use((state,emit) => {
  emit.on("DOMContentLoaded", () => {
  })
})
app.use((state, emitter) => {
  emitter.on('navigate', () => {
    console.log(`Navigated to ${state.route}`)
  })
})

app.route(lib.getBaseRoute(), view)
app.mount('body')

function viewEaseComponentList (state, functionName, options = {}) {
  if (state.eases.list[functionName] === undefined) {
    state.eases.list[functionName] = new EaseComponentList
  }
  return html`<div>${state.eases.list[functionName].render(functionName, options)}</div>`
}
function viewEaseComponentEvent (state, functionName, options = {}) {
  if (state.eases.event[functionName] === undefined) {
    state.eases.event[functionName] = new EaseComponentEvent
  }
  return html`<div>${state.eases.event[functionName].render(functionName, options)}</div>`
}

function view (state, emit) {
  return html`
    <body>
      <nav>
      <div class="nav-wrapper">
        <div class="center brand-logo">Easing</div>
        <a href="https://github.com/rook2pawn/node-easing" class="brand-logo right"><img src="assets/github.png"></a>
      </div>
      </nav>

      <div class="container row">
        <div class="col s12"><span class="flow-text">Event</span></div>
        ${Easing.uniqueList.map((funcName) => {
          return html`<div>${viewEaseComponentEvent(state, funcName)}</div>`
        })}
      </div>
      <div class="clear"></div>
      <div class="container row">
        <div class="col s12"><span class="flow-text">Static</span></div>
        ${Easing.uniqueList.map((funcName) => {
          return html`<div>${viewEaseComponentList(state, funcName)}</div>`
        })}
      </div>
      <div class="clear"></div>
      <div class="container row">
        <div class="col s12"><span class="flow-text">Static - End to end</span></div>

        ${Easing.uniqueList.map((funcName) => {
          return html`<div>${viewEaseComponentList(state, funcName, { endToEnd: true} )}</div>`
        })}
      </div>
      <div class="clear"></div>

    </body>
  `
}
