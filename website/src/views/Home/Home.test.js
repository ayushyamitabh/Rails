import React from 'react';
import renderer from 'react-test-renderer';
import { Home } from '..';
import { shallow, mount, render, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Button, Card, Icon } from 'antd';

configure({ adapter: new Adapter() });

describe('Home Page', () => {
  it('Should render home page without any errors', () => { // eslint-disable-line no-undef
    expect(renderer.create(<Home />).toJSON()).toMatchSnapshot();
  });
  it('should contains a h1 tag with class name Title with text Rails', () => {
  expect(shallow(<Home />).contains(<h1 className="title">Rails</h1>)).toBe(true)
 })
 it('should contains a button with classname home-button and link to signup', () => {
   const component = <Button className="home-button" href="/signup">Get Started<Icon type="right-circle" theme="filled" /></Button>
 expect(shallow(<Home />).contains(component)).toBe(true)
})
 it('should have a class name home-button', () => {
  expect(shallow(<Home />).exists('.home-button')).toBe(true)
})
})
