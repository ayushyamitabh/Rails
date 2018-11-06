import React, { PureComponent } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Icon } from 'antd';
import firebase from 'firebase/app';
import 'firebase/auth';


function WithProtectedView(Component) {
  return class extends PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        signedin: null,
      };
      this.authStateListener = this.authStateListener.bind(this);
      if (firebase.app()) this.authStateListener();
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

    render() {
      const {
        signedin,
      } = this.state;
      const {
        ...props
      } = Component;
      const {
        pathname,
      } = this.props.location;
      if (signedin !== null) {
        return (
          (
            <Route
              {...props}
              render={() => (
                signedin ? <Component {...props} />
                  : (
                    <Redirect to={{
                      pathname: '/signin',
                      state: { from: pathname },
                    }}
                    />
                  ))}
            />
          )
        );
      }
      return (
        <div style={{
          width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center',
        }}
        >
          <Icon className="protected-view-loading" type="loading" theme="outlined" />
        </div>
      );
    }
  };
}

export default WithProtectedView;
