import React from 'react';
import renderer from 'react-test-renderer';
import {
  shallow,
  configure,
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter } from 'react-router-dom';
import { HeaderIcons } from '..';

configure({ adapter: new Adapter() });

describe('Headerlcons', () => {
  it('Render Headerlcons without any eror', () => {
    const component = renderer.create(
      <MemoryRouter>
        <HeaderIcons />
      </MemoryRouter>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

const wrapper = shallow(<HeaderIcons />);
describe('HeaderIcons shallow', () => {
  it('HeaderIcons container should exist', () => {
    expect(wrapper.exists('.HeaderIcons')).toBe(true);
  });
  it('Signout button exists', () => {
    expect(wrapper.exists('.logout-icon')).toBe(true);
  });
});
