import React from "react";

const RootContext = React.createContext({
  addInnerContext: contextId => {},
  getInnerContext: contextId => {},
  addMultipleInnerContexts: contextIds => {},
  removeMultipleInnerContexts: contextIds => {},
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
    this.addMultipleInnerContexts = this.addMultipleInnerContexts.bind(this);
    this.removeMultipleInnerContexts = this.removeMultipleInnerContexts.bind(
      this
    );

    this.state = {
      innerContexts: {},
      root: {
        addInnerContext: this.addInnerContext,
        getInnerContext: this.getInnerContext,
        removeInnerContext: this.removeInnerContext,
        setInnerState: this.setInnerState,
        getInnerState: this.getInnerState,
        addMultipleInnerContexts: this.addMultipleInnerContexts,
        removeMultipleInnerContexts: this.removeMultipleInnerContexts
      }
    };
  }
  removeMultipleInnerContexts(contextIds) {
    this.setState((state, props) => {
      let st = { ...state.innerContexts };
      for (let k of contextIds) {
        delete st[k];
      }
      return { innerContexts: st };
    });
  }
  addMultipleInnerContexts(contextIds, optContexts) {
    //avoid redraws by doing adding and removing more contexts at once
    let contexts = {};
    this.setState((state, props) => {
      let st = { ...state.innerContexts };
      for (let j = 0; j < contextIds.length; j++) {
        let k = contextIds[j];
        let ex = state.innerContexts[k] && state.innerContexts[k].context;
        if (ex) continue;
        let ctx = optContexts[j] ? optContexts[j] : React.createContext(null);
        st[k] = { context: ctx, state: null };
        contexts[k] = ctx;
      }
      return { innerContexts: st };
    });
    return contexts;
  }
  addInnerContext(contextId, optContext) {
    let ctx = optContext ? optContext : React.createContext(null);
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
      if (!state.innerContexts[contextId]) return null;
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
