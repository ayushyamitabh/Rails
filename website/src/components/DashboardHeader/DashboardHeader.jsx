import React, { Component } from 'react';
import {
  Layout,
} from 'antd';
import PropTypes from 'prop-types';
import { ProfileInfo, HeaderIcons } from '..';
import './DisplayHeader.css';

const { Header } = Layout;

class DashboardHeader extends Component {
  static PropTypes = {
    showDrawer: PropTypes.func
  }
  static defaultProps = {
    showDrawer: () => console.log("Never passed showDrawer")
  }
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {
      showDrawer
    } = this.props;
    return (
      <Header className="Header">
        <ProfileInfo name="User Name" email="jdoe@gmail.com" />
        <HeaderIcons showDrawer={showDrawer} />
      </Header>
    );
  }
}
export default DashboardHeader;
