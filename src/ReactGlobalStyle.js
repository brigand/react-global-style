const React = require('react');

// polyfill WeakMap if it's not defined.
require('./WeakMap');

// ed = elementData, we use getEd a lot
// WeakMap for edge cases where many elements are targeted
// Not a big deal if it's shimmed as Map
export let ed = new WeakMap();
export const getEd = (element = document.body) => {
  if (ed.has(element)) {
    return ed.get(element);
  }

  const classCounts = {};
  const styleLevels = {};

  const incrClassCount = (key) => {
    if (classCounts[key] !== undefined) {
      classCounts[key] = classCounts[key] + 1;
    } else {
      classCounts[key] = 1;
    }
  };

  const decrClassCount = (key) => {
    classCounts[key] = classCounts[key] - 1;
  };

  const addStyleLevel = (key, value) => {
    if (styleLevels[key] !== undefined) {
      styleLevels[key] = styleLevels[key].concat([value]);
    } 
    else {
      const items = [value];
      if (element.style[key]) items.unshift(element.style[key]);
      styleLevels[key] = items;
    }
  }

  const removeStyleLevel = (key, value) => {
    if (styleLevels[key] !== undefined) {
      const styles = styleLevels[key];
      const newStyles = styles.slice(0, -1);

      styleLevels[key] = newStyles;
    }
  }

  const data = {
    classCounts,
    styleLevels,

    incrClassCount,
    decrClassCount,

    addStyleLevel,
    removeStyleLevel,
  };
  ed.set(element, data);
  return data;
};

// Private. Used for the unit tests.
export const reset = () => {
  ed = new WeakMap()
};

const splitClasses = (classes) => {
  if (!classes) return [];
  if (Array.isArray(classes)) return classes.filter(Boolean);
  return classes.split(/\s+/g).filter(Boolean);
}

export default class ReactGlobalStyle extends React.Component {
  el() {
    let el = document.body;
    if (typeof this.props.el === 'string') {
      el = document.querySelector(this.props.el);
    }
    if (typeof this.props.el === 'object' && this.props.el) {
      el = this.props.el;
    }
    return el;
  }
  ed() {
    return getEd(this.el());
  }
  updateClasses(classes, oldClasses) {
    classes.forEach((a) => {
      if (oldClasses.indexOf(a) === -1) {
        this.ed().incrClassCount(a);
        this.el().classList.add(a);
      }
    });

    oldClasses.forEach((b) => {
      if (classes.indexOf(b) === -1) {
        this.ed().decrClassCount(b);
        if (!this.ed().classCounts[b]) {
          this.el().classList.remove(b);
        }
      }
    });
  }
  updateStyles(style, oldStyle) {
    if (!style) style = {};
    if (!oldStyle) oldStyle = {};
    const el = this.el();
    const ed = this.ed();

    Object.keys(style).forEach((a) => {
      // Check if this is a new style
      if (!oldStyle[a] && oldStyle[a] !== 0) {
        ed.addStyleLevel(a, style[a]);
        el.style[a] = style[a];
      }
    });

    Object.keys(oldStyle).forEach((b) => {
      // Remove the style by peeling back a layer
      if (!style[b] && style[b] !== 0) {
        ed.removeStyleLevel(b);
        const levels = ed.styleLevels[b];
        if (levels && levels.length) {
          el.style[b] = levels[levels.length - 1];
        } else {
          el.style[b] = '';
        }
      }
    });
  }
  componentDidMount() {
    this.updateClasses(splitClasses(this.props.className), []);
    this.updateStyles(this.props.style, {});
  }
  componentWillReceiveProps(nextProps) {
    this.updateClasses(
      splitClasses(nextProps.className),
      splitClasses(this.props.className)
    );
    this.updateStyles(nextProps.style, this.props.style);
  }
  componentWillUnmount() {
    this.updateClasses([], splitClasses(this.props.className));
    this.updateStyles({}, this.props.style);
  }
  render() { return null; }
}
