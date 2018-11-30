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
It has only one parameter, the id of the inner context:

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



Example for functional components:
```js
import React from "react";
import ReactDOM from "react-dom";
import MultiContext from "react-multiple-contexts";

const incF = x => {
  if (!x) return 1;
  return x + 1;
};

let Context1 = null;
let Context2 = null;

class Test extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const A = Context1 ? (
      <Context1.Consumer>{value => value}</Context1.Consumer>
    ) : (
      <div />
    );
    const B = Context2 ? (
      <Context2.Consumer>{value => value}</Context2.Consumer>
    ) : (
      <div />
    );
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
    Context1 = this.context.addInnerContext(":a");
    Context2 = this.context.addInnerContext(":b");
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
let HOC = (rootContext, contextId) => {
  let Context = rootContext.addInnerContext(contextId);
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

class Test extends React.Component {
  render() {
    let C = HOC(this.context, ":c");
    let D = HOC(this.context, ":d");
    return (
      <div>
        <C />
        <D />
      </div>
    );
  }
}

Test.contextType = MultiContext.rootContext;
```
