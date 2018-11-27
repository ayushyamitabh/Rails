import React from 'react';
import renderer from 'react-test-renderer';
import {
  configure,
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { EventSummary } from '..';

configure({ adapter: new Adapter() });

describe('EventSummary', () => {
  it('Render EventSummary without any eror', () => {
    expect(renderer.create(<EventSummary course="CS103" eventName="Final exam" dueDate="Friday" />).toJSON()).toMatchSnapshot();
  });
});
