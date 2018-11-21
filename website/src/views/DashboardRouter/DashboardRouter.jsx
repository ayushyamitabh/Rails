import React, { PureComponent } from 'react';
import {
  BrowserRouter as Router, Route,
} from 'react-router-dom';
import { DashboardHome, Profile } from '..';
import { Layout } from 'antd';
import firebase from 'firebase/app';
import 'firebase/auth';
import { DashboardHeader, Notification } from '../../components';
import { WithProtectedView } from '../../hoc';
import './Dashboard.css';

class DashboardRouter extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      teacher: false,
    };
  }

  componentDidMount() {
    if (firebase.auth().currentUser !== undefined) {
      firebase.auth().currentUser
        .getIdToken(true)
        .then((idToken) => {
          const { uid } = firebase.auth().currentUser;
          const reqData = { uid, idToken };
          const profileData = fetch('https://us-central1-rails-students.cloudfunctions.net/getprofile', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(reqData),
          }).then((result) => {
            if (result.status === 200) {
              return result.json();
            }
          }).catch((err) => {
            console.log(err);
          });
          profileData.then((data) => {
            this.setState({ teacher: data.userData.type === 'teacher' });
          });
        });
    }
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
    const { visible, teacher } = this.state;
    return (
      <Layout className="Container" style={{ height: '100%' }}>
        <DashboardHeader teacher={teacher} showDrawer={this.showDrawer} />
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
