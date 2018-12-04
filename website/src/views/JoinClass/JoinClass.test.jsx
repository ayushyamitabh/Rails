import React from 'react';
import renderer from 'react-test-renderer';
import {
  configure,
  shallow,
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { JoinClass } from '..';

configure({ adapter: new Adapter() });


/* Snapshot */
describe('JoinClass', () => {
  it('Render JoinClass without any eror', () => {
    expect(renderer.create(<JoinClass />).toJSON()).toMatchSnapshot();
  });
});

/* Enzyme */
const wrapper = shallow(<JoinClass />);
describe('JoinClass shallow', () => {
  it('Title tag should exists', () => {
    expect(wrapper.find('.title').closest('.join-class-page').length).toBe(1);
  });
  it('Join-card should exists', () => {
    expect(wrapper.exists('.join-card')).toBe(true);
  });
  it('Join-class-table should within the join-card', () => {
    expect(wrapper.find('.join-class-table').parent().is('.join-card')).toBe(true);
  });
});
