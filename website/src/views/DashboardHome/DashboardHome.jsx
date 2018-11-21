import React, { PureComponent } from 'react';
import { EventSummaryCollection } from '../../components';
import './DashboardHome.css';

class DashboardHome extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const classArray = [
      {
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
        key: 'Oct. 24',
      },
      {
        date: 'Oct. 25',
        events: [
          {
            course: 'CSC 342',
            eventName: 'First Exam',
            dueTime: '3:30pm',
            color: '#d83a42',
            key: 2,

          },
          {
            course: 'CHEM 103',
            eventName: 'Lab Report',
            dueTime: '7:00pm',
            color: '#62c4f9',
            key: 3,

          },
        ],
        key: 'Oct. 25',

      },
      {
        date: 'Oct. 30',
        events: [
          {
            course: 'MATH 203',
            eventName: 'Quiz',
            dueTime: '12:00pm',
            color: '#d83a42',
            key: 4,

          },
          {
            course: 'CSC 301',
            eventName: 'Midterm',
            dueTime: '6:30pm',
            color: '#d83a42',
            key: 5,

          },
          {
            course: 'PHY 201',
            eventName: 'Lab Report',
            dueTime: '11:59pm',
            color: '#62c4f9',
            key: 6,

          },
        ],
        key: 'Oct. 30',

      },
      {
        date: 'Oct. 31',
        events: [
          {
            course: 'CSC 59929',
            eventName: 'Outline of Research Paper',
            dueTime: '6:30pm',
            color: '#62c4f9',
            key: 7,

          },
        ],
        key: 'Oct. 31',

      },
    ];
    return (
      <div className="DashboardHome">
        {classArray.map(event => (
          <EventSummaryCollection key={event.key} event={event} />
        ))}
      </div>
    );
  }
}
export default DashboardHome;
