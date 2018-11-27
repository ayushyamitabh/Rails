import React from 'react';
import renderer from 'react-test-renderer';
import {
  configure,
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { JoinClass } from '..';

configure({ adapter: new Adapter() });


describe('JoinClass', () => {
  it('Render JoinClass without any eror', () => {
    expect(renderer.create(<JoinClass />).toJSON()).toMatchSnapshot();
  });
});
