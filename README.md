# React Multi Context
If you want to use React Context to separate the state from components, it can be challenging to manage contexts for the multiple data sources. If you store the data in one context, every update to the context will re-render all the components. This small utility library will help you create the nested contexts dynamically, and pull the data up in separate contexts.
## Installation

```sh
npm install react-multiple-contexts
```
## Use

MultiContexts exposes the root context with property _rootContext_. You use this to setup the context type for the top-level component:

```js
import MultiContext from 'react-multiple-contexts';

TopLevelComp.contextType=MultiContext.rootContext;
```
To create the inner context, use the MultiContext function _addInnerContext_.
It has only one parameter, the id of the inner context, and the optional second parameter if we want to pass the existing context:

```js
    Context1 = this.context.addInnerContext(":a");
```

Why we need the id? The whole idea of this library is to separate the data from the components, and lift it up in __separate__ contexts.
When we need to update the context data, from inside our outside the component, we need the id. We do it with the root context function _setInnerState_:

```js

 <button onClick={ev => this.context.setInnerState(":b", incF)}>
          :b
 </button>
```


The first argument of this function is the context id. Another is the  state function, that takes the existing context state and produces the new one.


Every adding of the new context to the provider causes the redraw. To avoid this, we can add the multiple inner contexts at once:

```js
this.context.addMultipleInnerContexts([":c", ":d"], [contextC, contextD]);
```



Example for functional components:
```js
import React from "react";
import ReactDOM from "react-dom";
import MultiContext from "react-multiple-contexts";

const incF = x => {
  if (!x) return 1;
  return x + 1;
};

let Context1 = React.createContext(null);
let Context2 = React.createContext(null);

class Test extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const A = <Context1.Consumer>{value => value}</Context1.Consumer>;
    const B = <Context2.Consumer>{value => value}</Context2.Consumer>;

    return (
      <div>
        :a
        {A}
        :b
        {B}
        <button onClick={ev => this.context.setInnerState(":a", incF)}>
          :a
        </button>
        <button onClick={ev => this.context.setInnerState(":b", incF)}>
          :b
        </button>
      </div>
    );
  }
  componentDidMount() {
    //    Context1 = this.context.addInnerContext(":a");
    //  Context2 = this.context.addInnerContext(":b");
    //to avoid redraw, we add multiple contexts at once.
    let ctxts = this.context.addMultipleInnerContexts(
      [":a", ":b"],
      [Context1, Context2]
    );
  }
}

Test.contextType = MultiContext.rootContext;

class App extends React.Component {
  render() {
    return (
      <MultiContext>
        <Test/>
      </MultiContext>
    );
  }
}

window.onload = _ => {
  ReactDOM.render(<App />, document.getElementById("root"));
};

```

For regular React Components:

```js
let HOC = (rootContext, contextId, Context) => {
  let kl = class extends React.Component {
    render() {
      console.log("called render for " + contextId);
      return (
        <div>
          inner value for
          {contextId}
          {this.context}
          <button onClick={ev => rootContext.setInnerState(contextId, incF)}>
            {contextId}
          </button>
        </div>
      );
    }
  };
  kl.contextType = Context;
  return kl;
};

const contextC = React.createContext(null);
const contextD = React.createContext(null);
class Test2 extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let C = HOC(this.context, ":c", contextC);
    let D = HOC(this.context, ":d", contextD);
    return (
      <div>
        <C />
        <D />
      </div>
    );
  }
  componentDidMount() {
    this.context.addMultipleInnerContexts([":c", ":d"], [contextC, contextD]);
  }
}

Test2.contextType = MultiContext.rootContext;
```

### ContextPool

If you have to completely avoid re-draws due to the adding of inner contexts, you can use the _pool_ of contexts, __ContextPool__ class. It is a drop-in replacement for the MultiContext class. It will create the pool of contexts with the initially defined size that can grow on demand. Internally contexts will not be destroyed when __removeContext__ is called, they will be returned to the pool instead

```js
import {ContextPool} from 'react-multiple-contexts';



render(){
    return (
      <ContextPool rootContext={rootContext} initialSize={10} minimumFree={3}>
        <Test />
      </ContextPool>
    );
}
```

All the props are mandatory: __rootContext is an externally defined rootContext, __intialSize__ is the number of contexts initially created, __minimumFree__ is the minum of the non-occupied contexts in the pool. Once the limuit is reached, new contexts will be added to the pool

