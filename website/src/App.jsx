import React, { PureComponent } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Home, Signin, Signup } from './views';
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
            <Route path="/dashboard" component={null} />
          </Dashboard>
        </div>
      </Router>
    );
  }
}

const FirebaseApp = withFirebase(App);
export { App, FirebaseApp };
