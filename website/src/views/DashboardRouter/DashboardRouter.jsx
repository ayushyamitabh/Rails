import React, { PureComponent } from 'react';
import {
  BrowserRouter as Router, Route,
} from 'react-router-dom';
import { DashboardHome, Profile } from '..';
import { Layout } from 'antd';
import { DashboardHeader, Notification } from '../../components';
import { WithProtectedView } from '../../hoc';

class DashboardRouter extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
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
    const { visible } = this.state;
    return (
      <Layout className="Container" style={{ height: '100%' }}>
        <DashboardHeader showDrawer={this.showDrawer} />
        <Layout style={{ height: '100%' }}>
          <Router>
            <div>
              <Route exact path="/dashboard" component={DashboardHome} />
              <Route exact path="/dashboard/profile" component={Profile} />
            </div>
          </Router>
        </Layout>
        <Notification notificationVisible={visible} onClose={this.onClose} />
      </Layout>
    );
  }
}

const ProtectedDashboardRouter = WithProtectedView(DashboardRouter);
export { ProtectedDashboardRouter, DashboardRouter };
