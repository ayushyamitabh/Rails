import {
  Button, Card, Icon, Input, message, Modal,
} from 'antd';
import React, { PureComponent } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import './Signin.css';

/* eslint no-undef: 0 */
/* eslint react/prop-types: 0 */
/* eslint no-console: 0 */

export default class Signin extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      loading: false,
      visible: false,
    };
    this.signin = this.signin.bind(this);
    this.showModal = this.showModal.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  forgotPassword = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  signin() {
    const { email, password } = this.state;
    const { location, history } = this.props;
    if (email === '' || password === '') {
      message.error('Looks like you\'re missing something.');
      return;
    }
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((user) => {
        if (user) {
          if (location.state !== undefined) {
            history.push(location.state.from || '/dashboard');
          } else {
            history.push('/dashboard');
          }
        }
      })
      .catch((err) => {
        message.error(err.message);
      });
  }

  render() {
    const {
      email, password, loading, visible,
    } = this.state;
    const { history } = this.props;
    const user = firebase.auth().currentUser;
    if (user) {
      history.push('/dashboard');
    }
    return (
      <div className="signin">
        <h1 className="title">Rails</h1>
        <h5 className="tag-line">Keep students on track</h5>
        <Card
          className="signin-card"
          title="Sign In"
        >
          <div>
            <Input
              required
              size="large"
              placeholder="E-Mail"
              prefix={<Icon type="mail" />}
              style={{ marginTop: 10 }}
              type="email"
              value={email}
              onChange={(e) => { this.setState({ email: e.target.value }); }}
            />
            <Input
              required
              size="large"
              placeholder="Password"
              prefix={<Icon type="ellipsis" />}
              style={{ marginTop: 10 }}
              type="password"
              value={password}
              onChange={(e) => { this.setState({ password: e.target.value }); }}
            />
            <Button icon="check-circle" size="large" block style={{ marginTop: 10 }} onClick={this.signin} loading={loading} type="primary">
              <p style={{ margin: 0, display: 'inline', marginLeft: 10 }}>Sign In</p>
            </Button>
            <Button size="large" block style={{ marginTop: 10 }} href="/signup">
              <p style={{ margin: 0, display: 'inline' }}>Don&#39;t have an account? Sign Up.</p>
            </Button>
            <Button size="large" block style={{ marginTop: 10 }} onClick={this.showModal}>
              <p style={{ margin: 0, display: 'inline' }}>Forgot Password?</p>
            </Button>
            <Modal
              title="Forgot password"
              className="forgot-password-modal"
              visible={visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <p className="forgot-password-label">Please enter your E-mail address:</p>
              <Input
                required
                size="large"
                placeholder="E-Mail"
                prefix={<Icon type="mail" />}
                style={{ marginTop: 10 }}
                type="email"
                value={email}
                onChange={(e) => { this.setState({ email: e.target.value }); }}
              />
            </Modal>
          </div>
        </Card>
      </div>
    );
  }
}
