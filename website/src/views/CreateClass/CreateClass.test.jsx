import React from 'react';
import renderer from 'react-test-renderer';
import {
  configure,
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { CreateClass } from '..';

configure({ adapter: new Adapter() });

describe('CreateClass', () => {
  it('Render CreateClass without any eror', () => {
    expect(renderer.create(<CreateClass />).toJSON()).toMatchSnapshot();
  });
});
