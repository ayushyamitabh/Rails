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

  it('should have a class called name', () => {
    expect(wrapper.exists('.name')).toBe(true);
  });

  it('should have a class called email', () => {
    expect(wrapper.exists('.email')).toBe(true);
  });

  it('Name should pass into the component without error', () => {
    expect(wrapper.contains(<p className="name">test full name</p>));
  });

  it('NEmail should pass into the component without errort', () => {
    expect(wrapper.contains(<p className="email">test@gmail.com</p>));
  });

  it('should have a class called logo', () => {
    expect(wrapper.exists('.header-logo')).toBe(true);
  });

  it('class name should be inside of a div', () => {
    expect(wrapper.find('.name').parent().is('div')).toBe(true);
  });

  it('class email should be inside of a div', () => {
    expect(wrapper.find('.email').parent().is('div')).toBe(true);
  });

  it('Type of wrapper should be div', () => {
    expect(wrapper.type()).toBe('div');
  });
});
