
Set global styles (e.g. on `document.body`) declaratively.

It's smart enough to not remove class names added in mutlipe places, and to maintain a stack of values for a given style property.


## Install

```sh
npm install --save react-global-style
```

## Usage

```jsx
import ReactGlobalStyle from 'react-global-style';

// `el` defaults to document.body
<ReactGlobalStyle className="foo" el={document.body} />

// `el` can be a selector
<ReactGlobalStyle className="foo" el="#app-root" />

// COMING SOON: style support
<ReactGlobalStyle style={{color: 'black'}} />
```
