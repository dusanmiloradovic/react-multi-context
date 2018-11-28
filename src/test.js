import React from "react";
import ReactDOM from "react-dom";

import MultiContext from "./index.js";

class Test extends React.Component {
  render() {
    console.log(this.context);

    return <div>a</div>;
  }
  componentDidMount() {
    let context1 = this.context.addInnerContext(":a");
    let context2 = this.context.addInnerContext(":b");
  }
}

Test.contextType = MultiContext.rootContext;

class App extends React.Component {
  render() {
    return (
      <MultiContext>
        <Test />
      </MultiContext>
    );
  }
}

window.onload = _ => {
  ReactDOM.render(<App />, document.getElementById("root"));
};
