import React from 'react';
import renderer from 'react-test-renderer';
import {
  shallow,
  configure,
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { NotFound } from '..';
import '../../utils/tests/test.css';

configure({ adapter: new Adapter() });

describe('NotFound View', () => {
  it('Expect the NotFound page to match snap shot', () => { // eslint-disable-line no-undef
    const component = renderer.create(
      <NotFound />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot(); // eslint-disable-line no-undef
  });

  /* enzyme testing */
  const wrapper = shallow(<NotFound />);

  it('should contains a sub Title', () => {
    expect(wrapper.contains(<h2 className="subTitle">404 Page Not Found</h2>)).toBe(true);
  });

  it('should have a class called home-button', () => {
    expect(wrapper.exists('.home-button')).toBe(true);
  });
});
