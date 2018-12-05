import React from 'react';
import renderer from 'react-test-renderer';
import {
  configure,
  shallow,
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import moment from 'moment';
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

/* Enzyme */
const wrapper = shallow(<EventSummary event={event} />);
describe('EventSummary shallow', () => {
  it('Course should exist', () => {
    expect(wrapper.find('.course').closest('.EventSummary').length).toBe(1);
  });
  it('Eventname should exist', () => {
    expect(wrapper.find('.eventName').closest('.EventSummary').length).toBe(1);
  });
  it('Due date should exist', () => {
    expect(wrapper.find('.dueDate').closest('.EventSummary').length).toBe(1);
  });
  it('Event values are correct', () => {
    const dd = moment(event.dueDate).format('hh:mm A');
    expect(wrapper.containsAllMatchingElements([
      <span className="course">CSC 59929</span>,
      <span className="eventName">Project Presentation</span>,
      <span className="dueDate">{dd}</span>,
    ])).toBe(true);
  });
});
