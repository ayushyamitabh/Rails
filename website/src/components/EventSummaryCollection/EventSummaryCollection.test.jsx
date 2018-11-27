import React from 'react';
import renderer from 'react-test-renderer';
import {
  configure,
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { EventSummaryCollection } from '..';

configure({ adapter: new Adapter() });
const classArray = {
  date: 'Oct. 24',
  events: [
    {
      course: 'CSC 342',
      eventName: 'Review of First Exam',
      dueTime: '3:30pm',
      color: '#d83a42',
      key: 0,
    },
    {
      course: 'CSC 220',
      eventName: 'Homework 1',
      dueTime: '5:00pm',
      color: '#62c4f9',
      key: 1,
    },
  ],
};

describe('EventSummaryCollection', () => {
  it('Render EventSummaryCollection without any eror', () => {
    expect(renderer.create(<EventSummaryCollection event={classArray} />)
      .toJSON()).toMatchSnapshot();
  });
});
