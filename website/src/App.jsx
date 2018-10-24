import React, { PureComponent } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Home, Signin, Signup,DashboardHome} from './views';
import { Home, Signin, Signup, CreateClass, JoinClass, DashboardHome } from './views';
import { Dashboard } from './components';
import './App.css';
import withFirebase from './utils/firebase/firebase';

class App extends PureComponent {
  static propTypes = {
    signoutHandler: PropTypes.func,
  }

  static defaultProps = {
    signoutHandler: console.log('No signout handler inputted'),
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
    return (
      <Router>
        <div style={{ height: '100%' }}>
          <Route exact path="/" component={Home} />
          <Dashboard>
            <Route path="/dashboard" component={DashboardHome} />
          </Dashboard>
          <Route path="/signup/:type?" component={Signup} />
          <Route path="/signin" component={Signin} />
          <Route path="/create/class" component={CreateClass} />
          <Route path="/join/class" component={JoinClass} />
          <Route path="/signout" render={this.signout} />
        </div>
      </Router>
    );
  }
}

const FirebaseApp = withFirebase(App);
export { App, FirebaseApp };
