import React from "react";

const RootContext = React.createContext({
  addInnerContext: contextId => {},
  getInnerContext: contextId => {},
  removeInnerContext: contextId => {},
  setInnerState: (contextId, state) => {},
  getInnerState: contextId => {}
});

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.addInnerContext = this.addInnerContext.bind(this);
    this.getInnerContext = this.getInnerContext.bind(this);
    this.setInnerState = this.setInnerState.bind(this);
    this.getInnerState = this.getInnerState.bind(this);
    this.removeInnerContext = this.removeInnerContext.bind(this);

    this.state = {
      innerContexts: {},
      root: {
        addInnerContext: this.addInnerContext,
        getInnerContext: this.getInnerContext,
	removeInnerContext:this.removeInnerContext,
        setInnerState: this.setInnerState,
        getInnerState: this.getInnerState
      }
    };
  }

  addInnerContext(contextId) {
    let ctx = React.createContext(null);
    this.setState((state, props) => {
      let ex =
        state.innerContexts[contextId] &&
        state.innerContexts[contextId].context;
      if (ex) return {};

      let st = { ...state.innerContexts };
      st[contextId] = { context: ctx, state: null };
      return { innerContexts: st };
    });
    return ctx;
  }

  removeInnerContext(contextId) {
    this.setState((state, props) => {
      if (!state.innetContexts[contextId]) return null;
      let st = { ...state.innerContexts };
      delete st[contextId];
      return { innerContexts: st };
    });
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
    this.setState((state, props) => {
      let st = { ...state.innerContexts };
      st[contextId].state = stateF(st[contextId].state);
      return { innerContexts: st };
    });
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
