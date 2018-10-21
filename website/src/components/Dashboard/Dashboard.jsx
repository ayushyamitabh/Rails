import React, { PureComponent } from 'react';
import {
  Layout,
} from 'antd';
import PropTypes from 'prop-types';
import { DashboardHeader } from '..';

import './Dashboard.css';

const { Content } = Layout;
class Dashboard extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      loggedIn: true,
    };
  }

  render() {
    const {
      children,
    } = this.props;
    const {
      loggedIn,
    } = this.state;
    return (
      <Layout className="Container" style={{ height: '100%' }}>
        {loggedIn && <DashboardHeader />}
        <Layout style={{ height: '100%' }}>
          <Content style={{ height: '100%' }}>
            {children}
          </Content>
        </Layout>
      </Layout>
    );
  }
}
export default Dashboard;
