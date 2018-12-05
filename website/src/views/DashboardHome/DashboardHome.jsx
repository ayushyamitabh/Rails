import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { EventCalendar } from '../../components';
import './DashboardHome.css';

class DashboardHome extends PureComponent {
  static propTypes = {
    userData: PropTypes.shape({}),
    viewEvent: PropTypes.func,
  }

  static defaultProps = {
    userData: null,
    viewEvent: () => {},
  }

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  extractCourses = () => {
    const {
      userData,
    } = this.props;
    const {
      universities,
    } = userData;
    const courses = [];
    if (universities) {
      Object.keys(universities).forEach((university) => {
        const course = universities[university];
        Object.keys(course).forEach((c) => {
          course[c].university = university;
        });
        courses.push(course);
      });
    }
    return courses;
  }

  extractEvents = (courses) => {
    let courseList = [];
    const { viewEvent } = this.props;
    courseList = courses.map(course => course);
    const eventList = courseList.map((course) => {
      const eventItems = [];
      Object.keys(course).forEach((key) => {
        Object.keys(course[key].events).forEach((eventKey) => {
          const {
            description,
            dueDate,
            title,
            priority,
          } = course[key].events[eventKey];
          const eventItem = {
            course: course[key].name,
            description,
            start: moment(dueDate).subtract(15, 'minutes').toDate(),
            dueDate: moment(dueDate).toDate(),
            university: course[key].university,
            title,
            priority,
            eventUid: eventKey,
            classUid: key,
            viewEvent,
          };
          eventItems.push(eventItem);
        });
      });
      return eventItems;
    });
    const sendEvList = [];
    eventList.forEach((el) => {
      sendEvList.push(...el);
    });
    return sendEvList;
  }

  render() {
    const { userData, viewEvent } = this.props;
    const myEventsList = userData ? this.extractEvents(this.extractCourses()) : [];
    return (
      <div className="DashboardHome">
        <EventCalendar viewEvent={viewEvent} events={myEventsList} />
      </div>
    );
  }
}
export default DashboardHome;
