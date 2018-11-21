import React, { PureComponent } from 'react';
import {
  Layout,
} from 'antd';
import PropTypes from 'prop-types';
import firebase from 'firebase/app';
import { ProfileInfo, HeaderIcons } from '..';
import './DisplayHeader.css';

const { Header } = Layout;

class DashboardHeader extends PureComponent {
  static propTypes = {
    showDrawer: PropTypes.func,
    teacher: PropTypes.bool,
  }

  static defaultProps = {
    showDrawer: () => console.log('Never passed showDrawer'),
    teacher: false,
  }

  render() {
    const {
      showDrawer,
      teacher,
    } = this.props;

    const {
      currentUser,
    } = firebase.auth();

    const TeacherIcons = [
      {
        type: 'add_circle',
        onClick: () => console.log('add event'),
        key: 'add_circle',
      },
      {
        type: 'add_alert',
        onClick: () => console.log('add notification'),
        key: 'add_alert',
      },
    ];

    const Icons = [
      {
        type: 'notifications_active',
        onClick: showDrawer,
        key: 'notifications_active',
      },
      {
        type: 'settings',
        onClick: () => { window.location = '/dashboard/profile'; },
        key: 'settings',
      },
    ];
    if (teacher) {
      Icons.unshift(...TeacherIcons);
    }
    return (
      <Header className="Header">
        <ProfileInfo
          name={currentUser ? currentUser.displayName : 'User Name'}
          email={currentUser ? currentUser.email : 'email@domain.com'}
        />
        <HeaderIcons Icons={Icons} />
      </Header>
    );
  }
}

export default DashboardHeader;
