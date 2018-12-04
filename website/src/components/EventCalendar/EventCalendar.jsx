import React, { PureComponent } from 'react';
import BigCalendar from 'react-big-calendar';
import PropTypes from 'prop-types';
import { EventSummary } from '..';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './EventCalendar.css';

class EventCalendar extends PureComponent {
  static propTypes = {
    events: PropTypes.arrayOf(PropTypes.shape({
      course: PropTypes.string,
      title: PropTypes.string,
      eventName: PropTypes.string,
      dueDate: PropTypes.instanceOf(Date),
      description: PropTypes.string,
      priority: PropTypes.number,
    })),
    defaultView: PropTypes.oneOf(['month', 'agenda']),
  }

  static defaultProps = {
    events: [],
    defaultView: 'agenda',
  }

  render() {
    const localizer = BigCalendar.momentLocalizer(moment);

    const components = {
      agenda: {
        event: EventSummary,
      },
    };
    return (
      <div className="EventCalendarContainer">
        <BigCalendar
          {...this.props}
          views={['month', 'agenda']}
          localizer={localizer}
          startAccessor="start"
          endAccessor="dueDate"
          components={components}
        />
      </div>
    );
  }
}
export default EventCalendar;
