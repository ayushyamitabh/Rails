import React from 'react';
import renderer from 'react-test-renderer';
import {
  shallow,
  configure,
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { IconButton } from '..';


configure({ adapter: new Adapter() });
const sampleFunction = () => {
};

describe('IconButton', () => {
  it('Render IconButon without any errors', () => {
    const component = renderer.create(
      <IconButton type="setting" onClick={sampleFunction} />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('should have a type called settings', () => {
    const sampleFunctionMock = jest.fn(sampleFunction);
    const wrapper = shallow(<IconButton type="settings" onClick={sampleFunctionMock} />);
    expect(wrapper.find({ type: 'settings' }).length).toBe(1);
    wrapper.find('button').simulate('click');
    expect(sampleFunctionMock.mock.calls.length).toBe(1);
  });
  it('should have a type called add_box', () => {
    const sampleFunctionMock = jest.fn(sampleFunction);
    const wrapper = shallow(<IconButton type="add_box" onClick={sampleFunctionMock} />);
    expect(wrapper.find({ type: 'add_box' }).length).toBe(1);
    wrapper.find('button').simulate('click');
    expect(sampleFunctionMock.mock.calls.length).toBe(1);
  });
  it('should have a type called add_alert', () => {
    const sampleFunctionMock = jest.fn(sampleFunction);
    const wrapper = shallow(<IconButton type="add_alert" onClick={sampleFunctionMock} />);
    expect(wrapper.find({ type: 'add_alert' }).length).toBe(1);
    wrapper.find('button').simulate('click');
    expect(sampleFunctionMock.mock.calls.length).toBe(1);
  });
  it('should have a type called exit_to_app', () => {
    const sampleFunctionMock = jest.fn(sampleFunction);
    const wrapper = shallow(<IconButton type="exit_to_app" onClick={sampleFunctionMock} />);
    expect(wrapper.find({ type: 'exit_to_app' }).length).toBe(1);
    wrapper.find('button').simulate('click');
    expect(sampleFunctionMock.mock.calls.length).toBe(1);
  });
  it('should have a type called notifications_active', () => {
    const sampleFunctionMock = jest.fn(sampleFunction);
    const wrapper = shallow(<IconButton type="notifications_active" onClick={sampleFunctionMock} />);
    expect(wrapper.find({ type: 'notifications_active' }).length).toBe(1);
    wrapper.find('button').simulate('click');
    expect(sampleFunctionMock.mock.calls.length).toBe(1);
  });
});
