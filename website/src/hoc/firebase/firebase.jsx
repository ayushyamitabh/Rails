import React, { PureComponent } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

function withFirebase(App) {
  return class extends PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        signedin: false,
      };
      this.firebaseListener = null;
      this.authStateListener = this.authStateListener.bind(this);
      this.signoutHandler = this.signoutHandler.bind(this);
      if (firebase.app()) this.authStateListener();
    }

    componentDidMount() {
      // if (firebase.app()) this.authStateListener();
    }

    componentWillUnmount() {
      if (this.firebaseListener) {
        this.firebaseListener();
      }
      this.authStateListener = undefined;
    }

    authStateListener() {
      this.firebaseListener = firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.setState({ signedin: true });
        } else {
          this.setState({ signedin: false });
        }
      });
    }

    signoutHandler() {
      console.log('Signing out');
      firebase.auth().signOut();
      this.setState({ signedin: false });
    }

    render() {
      const {
        signedin,
      } = this.state;
      return (
        <App
          {...this.props}
          signoutHandler={this.signoutHandler}
          signedin={signedin}
        />
      );
    }
  };
}

export default withFirebase;
