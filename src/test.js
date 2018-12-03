import React from "react";
import ReactDOM from "react-dom";

import MultiContext from "./index.js";

const incF = x => {
  if (!x) return 1;
  return x + 1;
};

/*Example for functional components*/
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

/*Example for "full" components */

let HOC = (rootContext, contextId, context) => {
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
  kl.contextType = context;
  return kl;
};

class Test2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = { contextC: null, contextD: null };
  }
  render() {
    let C = this.state.contextC
      ? HOC(this.context, ":c", this.state.contextC)
      : () => <div />;
    let D = this.state.contextD
      ? HOC(this.context, ":d", this.state.contextD)
      : () => <div />;
    return (
      <div>
        <C />
        <D />
      </div>
    );
  }
  componentDidMount() {
    this.setState({
      contextC: this.context.addInnerContext(":c"),
      contextD: this.context.addInnerContext(":d")
    });
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
        <div />
        <Test2 />
      </MultiContext>
    );
  }
}

window.onload = _ => {
  ReactDOM.render(<App />, document.getElementById("root"));
};
