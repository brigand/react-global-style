import React from 'react';
import {mount} from 'enzyme';
import ReactGlobalStyle, {
  reset,
  getEd,

  incrClassCount,
  decrClassCount,
  addStyleLevel,
  removeStyleLevel,
} from '../ReactGlobalStyle';

const setup = () => {
  reset();
  return getEd();
};

describe(`classCounts`, () => {
  it(`works for first run`, () => {
    const ed = setup();
    expect([...ed.classCounts]).toEqual([]);
    ed.incrClassCount(`foo`);
    expect([...ed.classCounts]).toEqual([[`foo`, 1]]);
  });

  it(`works for second run`, () => {
    const ed = setup();
    ed.incrClassCount(`foo`);
    ed.incrClassCount(`foo`);
    expect([...ed.classCounts]).toEqual([[`foo`, 2]]);
  });

  it(`removes`, () => {
    const ed = setup();
    ed.incrClassCount(`foo`);
    ed.incrClassCount(`foo`);
    ed.decrClassCount(`foo`);
    expect([...ed.classCounts]).toEqual([[`foo`, 1]]);
  });
});

describe(`styleLevels`, () => {
  it(`works for first run`, () => {
    const ed = setup();
    expect([...ed.styleLevels]).toEqual([]);
    ed.addStyleLevel(`color`, `red`);
    expect([...ed.styleLevels]).toEqual([[`color`, [`red`]]]);
  });

  it(`works for multiple levels`, () => {
    const ed = setup();
    expect([...ed.styleLevels]).toEqual([]);
    ed.addStyleLevel(`color`, `red`);
    ed.addStyleLevel(`width`, `5px`);
    ed.addStyleLevel(`color`, `blue`);
    expect([...ed.styleLevels]).toEqual([
      [`color`, [`red`, `blue`]],
      [`width`, [`5px`]],
    ]);
    ed.removeStyleLevel(`color`);
    expect([...ed.styleLevels]).toEqual([
      [`color`, [`red`]],
      [`width`, [`5px`]],
    ]);
  });
});


describe(`ReactGlobalStyle`, () => {
  it(`doesn't error`, () => {
    mount(<ReactGlobalStyle />);
  });

  it(`className adds`, () => {
    const el = document.createElement('div');
    const w = mount(<ReactGlobalStyle className="foo" el={el} />);
    expect(el.className).toBe(`foo`);
  });

  it(`className removes on className change`, () => {
    const el = document.createElement('div');
    const w = mount(<ReactGlobalStyle className="foo" el={el} />);
    w.setProps({el, className: ''});
    expect(el.className).toBe(``);
  });

  it(`className removes on unmount`, () => {
    const el = document.createElement('div');
    const w = mount(<ReactGlobalStyle className="foo" el={el} />);
    w.unmount();
    expect(el.className).toBe(``);
  });

  it(`className barage of changes`, () => {
    const el = document.createElement('div');
    const w = mount(<ReactGlobalStyle className="foo" el={el} />);
    w.setProps({el, className: `bar`});
    w.setProps({el, className: `bar baz`});
    w.setProps({el, className: `quux bar`});
    // Note that the order is reversed from the previous setProps
    // becuase we use classList and don't remove the unchanging 'bar'
    expect(el.className).toBe(`bar quux`);
  });

});


