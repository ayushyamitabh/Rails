import React, { PureComponent } from 'react';
import { Drawer, Card } from 'antd';
import PropTypes from 'prop-types';

class Notification extends PureComponent {
  static propTypes = {
    notificationVisible: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
  }

  static defaultProps = {
    onClose: () => console.log('no close function passed'),
  }

  render() {
    const {
      notificationVisible,
      onClose,
    } = this.props;
    return (
      <Drawer
        title="Create New Event"
        placement="right"
        width="500"
        closable
        onClose={onClose}
        visible={notificationVisible}
      >
        asdf
      </Drawer>
    );
  }
}

export default Notification;
