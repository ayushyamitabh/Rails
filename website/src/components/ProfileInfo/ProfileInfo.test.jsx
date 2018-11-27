import React from 'react';
import renderer from 'react-test-renderer';
import {
  configure,
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { ProfileInfo } from '..';

configure({ adapter: new Adapter() });

describe('ProfileInfo', () => {
  it('Render ProfileInfo without any eror', () => {
    expect(renderer.create(<ProfileInfo name="test full name" email="test@gmail.com" />).toJSON()).toMatchSnapshot();
  });
});
