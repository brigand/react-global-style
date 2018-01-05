
[![Build Status](https://travis-ci.org/brigand/react-global-style.svg?branch=master)](https://travis-ci.org/brigand/react-global-style)

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

// className can be an array
<ReactGlobalStyle className={['foo', 'bar']} />

// `style` is also supported
<ReactGlobalStyle style={{color: 'black'}} />
```

## Contributing

Any help is appreciated! For big changes, file an issue before sending a pull request.

To run the project:

```sh
yarn # or npm install

# Single test run
npm run test

# Tests in watch mode
npm run test -- --watch
```

Make your changes, and then send a pull request. Please keep coverage at 100%.

If you want to test it in a real project, `npm run build` creates the `lib` directory. Then you can `npm link` this into your project.


<!-- -->
