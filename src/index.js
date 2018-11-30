import React from "react";

const RootContext = React.createContext({
  addInnerContext: contextId => {},
  getInnerContext: contextId => {},
  setInnerState: (contextId, state) => {}
});

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.addInnerContext = this.addInnerContext.bind(this);
    this.getInnerContext = this.getInnerContext.bind(this);
    this.setInnerState = this.setInnerState.bind(this);
    this.getInnerState = this.getInnerState.bind(this);
    this.state = {
      innerContexts: {},
      root: {
        addInnerContext: this.addInnerContext,
        getInnerContext: this.getInnerContext,
        setInnerState: this.setInnerState
      }
    };
  }

  addInnerContext(contextId) {
    let ex = this.getInnerContext(contextId);
    if (ex) return ex;
    let ctx = React.createContext(null);
    let st = { ...this.state.innerContexts };
    st[contextId] = { context: ctx, state: null };
    this.setState({ innerContexts: st });
    return ctx;
  }

  getInnerContext(contextId) {
    return (
      this.state.innerContexts[contextId] &&
      this.state.innerContexts[contextId].context
    );
  }

  addProvider(innerProvider, contextId) {
    let PRV = this.getInnerContext(contextId).Provider;
    let innerState = this.state.innerContexts[contextId].state;
    return <PRV value={innerState}>{innerProvider}</PRV>;
  }

  setInnerState(contextId, stateF) {
    let st = { ...this.state.innerContexts };
    st[contextId].state = stateF(st[contextId].state);
    this.setState({ innerContexts: st });
  }

  getInnerState(contextId) {
    return (
      this.state.innerContexts[contextId] &&
      this.state.innerContexts[contextId].state
    );
  }

  render() {
    let currProvider = this.props.children;
    for (let cid in this.state.innerContexts) {
      currProvider = this.addProvider(currProvider, cid);
    }

    return (
      <RootContext.Provider value={this.state.root}>
        {currProvider}
      </RootContext.Provider>
    );
  }

  get rootContext() {
    return RootContext;
  }

  static get rootContext() {
    return RootContext;
  }
}
