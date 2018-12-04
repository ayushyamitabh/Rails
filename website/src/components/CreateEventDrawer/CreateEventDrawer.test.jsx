import React from 'react';
import { Drawer } from 'antd';
import {
  shallow,
  configure,
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Notification } from '..';

configure({ adapter: new Adapter() });

describe('Notification', () => {
  /* enzyme testing */
  const wrapper = shallow(<Notification notificationVisible={true} onClose={() => {}} />);

  it('Type of wrapper should be Drawer', () => {
    expect(wrapper.type()).toBe(Drawer);
  });
});
