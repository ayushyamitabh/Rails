import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import './EventSummary.css';

class EventSummary extends PureComponent {
  static propTypes = {
    event: PropTypes.shape({
      course: PropTypes.string,
      title: PropTypes.string,
      eventName: PropTypes.string,
      dueDate: PropTypes.instanceOf(Date),
      description: PropTypes.string,
      priority: PropTypes.number,
    }).isRequired,
  }

  priorityColor = () => {
    const {
      event,
    } = this.props;
    const {
      priority,
    } = event;
    const colors = ['#9E9E9E', '#03A9F4', '#F44336'];
    const color = colors[priority];
    return color;
  }

  render() {
    const {
      event,
    } = this.props;

    const time = moment(event.dueDate).format('hh:mm A');
    return (
      <div style={{ backgroundColor: this.priorityColor() }} className="EventSummary">
        <span className="course">{event.course}</span>
        <span className="eventName">{event.title}</span>
        <span className="dueDate">{time}</span>
      </div>
    );
  }
}

export default EventSummary;
