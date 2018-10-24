import React, { PureComponent } from 'react';
import { Layout } from 'antd';
import PropTypes from 'prop-types';
import { DashboardHeader, Notification } from '..';

import './Dashboard.css';

const { Content } = Layout;
class Dashboard extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      loggedIn: true,
      drawerVisible: false,
    };
  }

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { children } = this.props;
    const { loggedIn, visible, onClose } = this.state;
    return (
      <Layout className="Container" style={{ height: '100%' }}>
        {loggedIn && <DashboardHeader showDrawer={this.showDrawer} />}
        <Layout style={{ height: '100%' }}>
          <Content style={{ height: '100%' }}>{children}</Content>
        </Layout>
        <Notification notificationVisible={visible} onClose={this.onClose} />
      </Layout>
    );
  }
}
export default Dashboard;
