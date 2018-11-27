import React from 'react';
import renderer from 'react-test-renderer';
import {
  configure,
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { DashboardHome } from '..';

configure({ adapter: new Adapter() });


describe('DashboardHome', () => {
  it('Render DashboardHome without any eror', () => {
    expect(renderer.create(<DashboardHome />).toJSON()).toMatchSnapshot();
  });
});
