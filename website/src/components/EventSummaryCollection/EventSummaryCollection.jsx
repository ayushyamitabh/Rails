import React, { Component } from 'react';
import { EventSummary } from '..';
import PropTypes from 'prop-types';
import './EventSummaryCollection.css';

class EventSummaryCollection extends Component {
  static propTypes = {
    event: PropTypes.object,
  }

  static defaultProps = {
    event: [],
  }

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {
      event,
    } = this.props;
    return (
      <div className="eventWrapper">
        <span className="eventDate">{event.date}</span>
        <div className="events">
          {event.events.map(course => (
            <EventSummary
              course={course.course}
              eventName={course.eventName}
              dueDate={course.dueTime}
              color={course.color}
              key={course.key}
            />))}
        </div>
      </div>
    );
  }
}
export default EventSummaryCollection;
