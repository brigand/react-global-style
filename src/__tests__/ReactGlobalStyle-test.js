import ReactGlobalStyle, {
  reset,
  getEd,

  incrClassCount,
  decrClassCount,
  addStyleLevel,
  removeStyleLevel,
} from '../ReactGlobalStyle';
import {shallow} from 'enzyme';

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
});



