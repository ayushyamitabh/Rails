import React from 'react';
import { Drawer } from 'antd';
import {
  shallow,
  configure,
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { ViewEventDrawer } from '..';

configure({ adapter: new Adapter() });

describe('Notification', () => {
  /* enzyme testing */
  const wrapper = shallow(<ViewEventDrawer visible onClose={() => {}} />);
  it('Type of wrapper should be Drawer', () => {
    expect(wrapper.type()).toBe(Drawer);
  });
});
