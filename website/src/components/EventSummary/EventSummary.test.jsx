import React from 'react';
import renderer from 'react-test-renderer';
import {
  configure,
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { EventSummary } from '..';

configure({ adapter: new Adapter() });

const event = {
  title: 'Project Presentation',
  course: 'CSC 59929',
  start: new Date('2018-12-04T21:41:00'),
  dueDate: new Date('2018-12-04T23:41:00'),
  priority: 2,
};
describe('EventSummary', () => {
  it('Render EventSummary without any eror', () => {
    expect(renderer.create(<EventSummary event={event} />).toJSON()).toMatchSnapshot();
  });
});
