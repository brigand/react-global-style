const React = require('react');

// ed = elementData, we use getEd a lot
// WeakMap for edge cases where many elements are targeted
// Not a big deal if it's shimmed as Map
export let ed = new WeakMap();
export const getEd = (element = document.body) => {
  if (ed.has(element)) {
    return ed.get(element);
  }

  const classCounts = new Map();
  const styleLevels = new Map();

  const incrClassCount = (key) => {
    if (classCounts.has(key)) {
      classCounts.set(key, classCounts.get(key) + 1);
    } else {
      classCounts.set(key, 1);
    }
  };

  const decrClassCount = (key) => {
    classCounts.set(key, classCounts.get(key) - 1);
  };

  const addStyleLevel = (key, value, element = document.body) => {
    if (styleLevels.has(key)) {
      styleLevels.set(key, styleLevels.get(key).concat([value]));
    }
    else {
      const items = [value];
      if (element.style[key]) items.unshfit(element.style[key]);
      styleLevels.set(key, items);
    }
  }

  const removeStyleLevel = (key, value) => {
    if (styleLevels.has(key)) {
      const styles = styleLevels.get(key);
      const newStyles = styles.slice(0, -1);

      styleLevels.set(key, newStyles);
    }
    else {
      console.warn(`ReactGlobalStyle: tried to remove style level when none existed. This is a bug, please report it`);
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

export default class ReactGlobalStyle extends React.Component {
  update(style, oldStyle) {
  }
  componentDidMount() {
  }
  render() { return null; }
}

