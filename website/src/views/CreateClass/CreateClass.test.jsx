import React from 'react';
import renderer from 'react-test-renderer';
import {
  shallow,
  configure,
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { CreateClass } from '..';

configure({ adapter: new Adapter() });

const sampleFunction = () => {

};

describe('CreateClass Snapshot Test', () => {
  it('Render CreateClass without any error', () => {
    expect(renderer.create(<CreateClass />).toJSON()).toMatchSnapshot();
  });
  it('Render button without error', () => {
    const component = renderer.create(
      <CreateClass type="setting" onClick={sampleFunction} />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

const wrapper = shallow(<CreateClass />);
describe('CreateClass Enzyme Test', () => {
  it('Title tag should exists', () => {
    expect(wrapper.find('.title').closest('.create-class-page').length).toBe(1);
  });
  it('Create-card should exists', () => {
    expect(wrapper.exists('.create-card')).toBe(true);
  });
});
