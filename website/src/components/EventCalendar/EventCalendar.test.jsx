import React from 'react';
import renderer from 'react-test-renderer';
import {
  configure,
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import MockDate from 'mockdate';
import { EventCalendar } from '..';

configure({ adapter: new Adapter() });
const myEventsList = [
  {
    eventName: 'Project Presentation',
    title: 'CSC 59929',
    start: new Date('2018-12-04T21:42:00'),
    end: new Date('2018-12-04T23:45:00'),
    priority: 2,
  },
  {
    eventName: 'Lab Due',
    title: 'CSC 59928',
    start: new Date('2018-12-04T21:45:00'),
    end: new Date('2018-12-04T23:45:00'),
    priority: 1,
  },
];

// mock date to return the same time so we always render the same
// calendar range


describe('EventSummaryCollection', () => {
  it('Snapshot test of EventCalendar in the default agenda view', () => {
    MockDate.set(1543820242000);
    expect(renderer.create(<EventCalendar events={myEventsList} />)
      .toJSON()).toMatchSnapshot();
    MockDate.reset();
  });
});
