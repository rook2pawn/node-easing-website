var html = require('choo/html')
var choo = require('choo')
const lib = require("./lib");
const css = require("sheetify")
const path = require("path")

css("./css/agate.css")
css("./css/materialize.min.css")
css("./css/style.css")

var app = choo()
app.use((state,emit) => {
  state.route = path.join(lib.getBaseRoute(), "buttons")
  emit.on("DOMContentLoaded", () => {
  })
  /*
  emit.on("DOMContentLoaded", () => {
    console.log("DOMContentLoaded!")
    if(typeof(Storage) !== "undefined") {
      if (sessionStorage.state) {
          let sessionState = JSON.parse(sessionStorage.state)
          Object.assign(state, sessionState)
      }
      emit.on('saveState', () => {
        sessionStorage.state = JSON.stringify(state) ;
      })
    }
    emit.emit("render")
  })
  */
})
app.use((state, emitter) => {                  // 1.
  emitter.on('navigate', () => {               // 2.
    console.log(`Navigated to ${state.route}`) // 3.
  })
})

app.route(lib.getBaseRoute(), view.clone())
app.route(path.join(lib.getBaseRoute(),'buttons'), view.clone())
app.route(path.join(lib.getBaseRoute(),'input'), view.clone())
app.route(path.join(lib.getBaseRoute(),'submit'), view.clone())
app.route(path.join(lib.getBaseRoute(),'input-with-nanocomponent'), view.clone())
app.route(path.join(lib.getBaseRoute(),'view-markdown'), view.clone())

app.mount('body')
//<pre><code class="hljs">${raw(hljs.highlight('javascript', foo, true).value)}</code></pre>

const header = require("./components/header");
const footer = require("./components/footer");
const buttonsComponent = require("./components/nested-buttons.js")(app)
const inputComponent = require("./components/input.js")(app)
const inputComponentWithNanocomponent = require("./components/input-with-nanocomponent.js")(app)
const submitComponent = require("./components/submit.js")(app)
const viewMarkdownComponent = require("./components/viewMarkdownComponent.js")(app)

const articles = {}
articles[lib.getBase()] = buttonsComponent;
articles[path.join(lib.getBaseRoute(),'buttons')] = buttonsComponent;
articles[path.join(lib.getBaseRoute(),'input')] = inputComponent;
articles[path.join(lib.getBaseRoute(),'input-with-nanocomponent')] = inputComponentWithNanocomponent;
articles[path.join(lib.getBaseRoute(),'submit')] =  submitComponent;
articles[path.join(lib.getBaseRoute(),'view-markdown')] =  viewMarkdownComponent;

console.log("Articles are:", articles);

const articleView = function(state,emit) {
  console.log("state route:", state.route)
  if (state.route == lib.getBase())
    state.route = path.join(lib.getBaseRoute(), "buttons")
  console.log("after state.route:", state.route)
  return html`<div>${articles[state.route].render(state,emit)}`
}
function view (state, emit) {
//  console.log("VIew!:", state)
  return html`
    <body>
      <div class="container">
      ${header(state,emit)}
      ${articleView(state,emit)}
      ${footer(state,emit)}
      </div>
    </body>
  `
}
