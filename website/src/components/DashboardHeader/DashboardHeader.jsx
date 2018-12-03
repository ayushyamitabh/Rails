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
        onClick: showDrawer,
        key: 'add_circle',
      },
    ];

    const Icons = [
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
