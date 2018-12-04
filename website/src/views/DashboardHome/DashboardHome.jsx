import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { EventCalendar } from '../../components';
import './DashboardHome.css';

class DashboardHome extends PureComponent {
  static propTypes = {
    userData: PropTypes.shape({}).isRequired,
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
        courses.push(course);
      });
    }
    return courses;
  }

  extractEvents = (courses) => {
    let courseList = [];
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
            title,
            priority,
          };
          eventItems.push(eventItem);
        });
      });
      return eventItems;
    });
    // map returns an array the entire array gets saved
    // to the first iterator take it out
    return eventList[0];
  }

  render() {
    const { userData } = this.props;
    const myEventsList = userData ? this.extractEvents(this.extractCourses()) : [];
    return (
      <div className="DashboardHome">
        <EventCalendar events={myEventsList} />
      </div>
    );
  }
}
export default DashboardHome;
