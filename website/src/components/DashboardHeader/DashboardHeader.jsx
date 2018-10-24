import React, { Component } from 'react';
import {
  Layout,
} from 'antd';
import PropTypes from 'prop-types';
import firebase from 'firebase/app';
import 'firebase/auth';
import { ProfileInfo, HeaderIcons } from '..';
import './DisplayHeader.css';

const { Header } = Layout;

class DashboardHeader extends Component {
  static PropTypes = {
    showDrawer: PropTypes.func,
  }

  static defaultProps = {
    showDrawer: () => console.log('Never passed showDrawer'),
  }

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {
      showDrawer,
    } = this.props;
    return (
      <Header className="Header">
        <ProfileInfo name={firebase.auth().currentUser ? firebase.auth().currentUser.displayName : 'User Name'} email={firebase.auth().currentUser ? firebase.auth().currentUser.email : 'email@domain.com'} />
        <HeaderIcons showDrawer={showDrawer} />
      </Header>
    );
  }
}
export default DashboardHeader;
