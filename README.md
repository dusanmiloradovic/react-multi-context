# React Multi Context
If you want to use React Context to separate the state from components, it can be challenging to manage contexts for the multiple data sources. If you store the data in one context, every update to the context will re-render all the components. This small utility library will help you create the nested contexts dynamically, and pull the data up in separate contexts.
## Installation

```sh
npm install react-multiple-contexts
```
## Use
You need to create a root React Context and pass it as a parameter to MultiContext.
You will use this context to add inner Contexts, and to set their values.

```js
import MultiContext from 'react-multiple-contexts';
const rootContext = React.createContext(null);
...

export default () => (
  <MultiContext rootContext={rootContext}>
    <App />
  </MultiContext>
);
```
To create the inner context, use the MultiContext function _addInnerContext_.
It has only one parameter, the id of the inner context, and the optional second parameter if we want to pass the existing context:

```js
    const rc = useContext(rootContext);
    ...
    Context1 = rc.addInnerContext(":a");
```

Why we need the id? The whole idea of this library is to separate the data from the components, and lift it up in __separate__ contexts.
When we need to update the context data, from inside our outside the component, we need the id. We do it with the root context function _setInnerState_:

```js

 <button onClick={ev => rc.setInnerState(":b", x=>x?x+1:2)}>
    :b
 </button>
```


The first argument of this function is the context id. Another is the  state function, that takes the existing context state and produces the new one.


Every adding of the new context to the provider causes the redraw. To avoid this, we can add the multiple inner contexts at once:

```js
rc.addMultipleInnerContexts([":c", ":d"], [contextC, contextD]);
```



[Example:](https://codesandbox.io/s/heuristic-lumiere-eyzbn)

```js
import React, { useContext, useEffect } from "react";
import MultiContext from "react-multiple-contexts";

const rootContext = React.createContext(null);
const context1 = React.createContext(null);
const context2 = React.createContext(null);

const B = () => {
  const value1 = useContext(context1);
  return (
    <div>
      B=
      {value1}
    </div>
  );
};

const C = () => {
  const value2 = useContext(context2);
  return (
    <div>
      C=
      {value2}
    </div>
  );
};

function App() {
  const rc = useContext(rootContext);
  useEffect(() => {
    rc.addMultipleInnerContexts([":b", ":c"], [context1, context2]);
  });
  return (
    <div className="App">
      <B />
      <C />
      <button
        onClick={() =>
          rc.setInnerState(":b", value => {
            console.log("current value " + value);
            return value ? value + 1 : 1;
          })
        }
      >
        Increase B
      </button>
      <button
        onClick={() => rc.setInnerState(":c", value => (value ? value + 2 : 1))}
      >
        Increase C
      </button>
    </div>
  );
}

export default () => (
  <MultiContext rootContext={rootContext}>
    <App />
  </MultiContext>
);
```

