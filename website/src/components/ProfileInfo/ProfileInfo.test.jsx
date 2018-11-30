import React from 'react';
import renderer from 'react-test-renderer';
import {
  shallow,
  configure,
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { ProfileInfo } from '..';

configure({ adapter: new Adapter() });

describe('ProfileInfo', () => {
  it('Render ProfileInfo without any eror', () => {
    expect(renderer.create(<ProfileInfo name="test full name" email="test@gmail.com" />).toJSON()).toMatchSnapshot();
  });

  /* enzyme testing */
  const wrapper = shallow(<ProfileInfo name="test full name" email="test@gmail.com" />);

  it('should display name', () => {
    expect(wrapper.exists('.name')).toBe(true);
  });

  it('should display email', () => {
    expect(wrapper.exists('.email')).toBe(true);
  });

  it('should display logo', () => {
    expect(wrapper.exists('.header-logo')).toBe(true);
  });

  it('name should be inside of a div', () => {
    expect(wrapper.find('.name').parent().is('div')).toBe(true);
  });

  it('email should be inside of a div', () => {
    expect(wrapper.find('.email').parent().is('div')).toBe(true);
  });

  it('email should be type of div', () => {
    expect(wrapper.type()).toBe('div');
  });
});
