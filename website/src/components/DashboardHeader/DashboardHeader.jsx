import React, { Component } from 'react';
import {
  Layout,
} from 'antd';
import { ProfileInfo, HeaderIcons } from '..';
import './DisplayHeader.css';

const { Header } = Layout;

class DashboardHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <Header className="Header">
        <ProfileInfo name="User Name" email="jdoe@gmail.com" />
        <HeaderIcons />
      </Header>
    );
  }
}
export default DashboardHeader;
