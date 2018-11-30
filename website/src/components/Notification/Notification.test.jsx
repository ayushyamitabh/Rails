import React from 'react';
import renderer from 'react-test-renderer';
import { Drawer, Card } from 'antd';
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

  it('Drawer should display correctly', () => {
    expect(wrapper.type()).toBe(Drawer);
  });
});
