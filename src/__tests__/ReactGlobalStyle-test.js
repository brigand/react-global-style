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

  it(`works with existing styles`, () => {
    document.body.style.color = 'red';
    const ed = setup();
    ed.addStyleLevel('color', 'green');
    expect([...ed.styleLevels]).toEqual([
      ['color', ['red', 'green']],
    ]);
    document.body.style.color = '';
  });
});


describe(`ReactGlobalStyle`, () => {
  it(`doesn't error`, () => {
    mount(<ReactGlobalStyle />);
  });

  it(`works with selector`, () => {
    const el = document.createElement('div');
    el.className = `lk2j5rlkajs1ldakjs`;
    document.body.appendChild(el);
    const w = mount(<ReactGlobalStyle el={`.${el.className}`} />);
    expect(w.instance().el()).toBe(el);
  });

  it(`className list`, () => {
    const el = document.createElement('div');
    const w = mount(<ReactGlobalStyle className={[`foo`]} el={el} />);
    expect(el.className).toBe(`foo`);
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

  it(`sets and removes styles`, () => {
    const el = document.createElement('div');
    const w = mount(<ReactGlobalStyle style={{color: `red`}} el={el} />);
    expect(el.style.color).toBe(`red`);
    w.setProps({el, style: {}});
    expect(el.style.color).toBe(``);
    w.setProps({el, style: undefined});
    expect(el.style.color).toBe(``);
  });

  it(`resets to previous styles`, () => {
    const el = document.createElement('div');
    const w = mount(<ReactGlobalStyle style={{color: `red`}} el={el} />);
    const w2 = mount(<ReactGlobalStyle style={{color: `blue`}} el={el} />);
    expect(el.style.color).toBe('blue');
    w2.setProps({el, style: undefined});
    expect(el.style.color).toBe('red');
  });

  it(`style barage of changes`, () => {
    const el = document.createElement('div');
    const w = mount(<ReactGlobalStyle style={{color: `red`}} el={el} />);
    w.setProps({el, style: {color: 'blue'}});
    w.setProps({el, style: {width: '5em'}});
    w.setProps({el, style: {width: '5em'}});
    w.setProps({el, style: {}});
    expect(el.style.color).toBe('');
    expect(el.style.color).toBe('');
  });

  it(`unmount`, () => {
    const el = document.createElement('div');
    const w = mount(<ReactGlobalStyle clasName="foo" style={{color: `red`}} el={el} />);

    w.unmount();
    expect(el.className).toBe('');
    expect(el.style.color).toBe('');
  });
});
