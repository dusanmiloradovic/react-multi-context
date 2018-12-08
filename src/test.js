import React from "react";
import ReactDOM from "react-dom";

import MultiContext from "./index.js";

const incF = x => {
  if (!x) return 1;
  return x + 1;
};

/*Example for functional components*/
//let Context1 = null;
//let Context2 = null;
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

/*Example for "full" components */

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

class App extends React.Component {
  render() {
    return (
      <MultiContext>
        Functional components:
        <div />
        <Test />
        Full components
        <Test2 />
        <div />
      </MultiContext>
    );
  }
}

window.onload = _ => {
  ReactDOM.render(<App />, document.getElementById("root"));
};
