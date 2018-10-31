import React, { PureComponent } from 'react';
import {
  BrowserRouter as Router, Route, Redirect, Switch,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Home, Signin, Signup, CreateClass, JoinClass, DashboardHome, NotFound,
} from './views';
import { Dashboard } from './components';
import './App.css';
import withFirebase from './utils/firebase/firebase';

class App extends PureComponent {
  static propTypes = {
    signoutHandler: PropTypes.func,
    signedin: PropTypes.bool,
  }

  static defaultProps = {
    signoutHandler: console.log('No signout handler inputted'),
    signedin: false,
  }

  constructor(props) {
    super(props);
    this.signout = this.signout.bind(this);
  }


  signout() {
    const { signoutHandler } = this.props;
    signoutHandler();
    return <Redirect to="/" />;
  }

  render() {
    const {
      signedin,
    } = this.props;
    return (
      <Router>
        <div style={{ height: '100%' }}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/signup/:type?" component={Signup} />
            <Route path="/signin" component={Signin} />
            <Route path="/create/class" component={CreateClass} />
            <Route path="/join/class" component={JoinClass} />
            <Route path="/signout" render={this.signout} />
            {signedin ? (
              <Dashboard>
                <Route path="/dashboard" component={DashboardHome} />
              </Dashboard>
            ) : null}
            <Route component={NotFound} />
          </Switch>
        </div>
      </Router>
    );
  }
}

const FirebaseApp = withFirebase(App);
export { App, FirebaseApp };
