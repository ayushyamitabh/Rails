import {
  Button, Card, Icon, Input, Select, Radio, message, Progress, Alert,
} from 'antd';
import React, { PureComponent } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import './Signup.css';

/* eslint linebreak-style: ["error", "windows"] */
/* eslint no-undef: 0 */
/* eslint react/prop-types: 0 */
/* eslint no-console: 0 */

export default class Signup extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      name: '',
      password: '',
      type: '',
      universities: '',
      loading: false,
      collegeOptions: [],
      strengthColor: 'red',
    };
    this.signup = this.signup.bind(this);
    this.getColleges = this.getColleges.bind(this);
    this.passwordInputHandler = this.passwordInputHandler.bind(this);
  }

  componentDidMount() {
    const { match } = this.props;
    this.setState({
      type: match.params.type,
    });
  }

  getColleges(collegeName) {
    const prefix = 'https://api.data.gov/ed/collegescorecard/v1/schools/?fields=school.name&per_page=20&school.name=';
    const name = encodeURI(collegeName);
    const suffix = '&school.operating=1&latest.student.size__range=1..&latest.academics.program_available.assoc_or_bachelors=true&school.degrees_awarded.predominant__range=1..3&school.degrees_awarded.highest__range=2..4&api_key=EvH8zAC2Qq6JywcjnHmNHwBnzGkOwSsVHsjXf2bK';
    fetch(prefix + name + suffix)
      .then(res => res.json())
      .then((result) => {
        this.setState({
          collegeOptions: result.results,
        });
      });
  }

  signup() {
    this.setState({ loading: true });
    const { history } = this.props;
    const {
      universities, name, password, type, email, strengthColor,
    } = this.state;
    const reqData = {
      universities,
      name,
      password,
      type,
      email,
    };
    if (!universities || !name || !password || !type || !email) {
      message.error("Looks like you're missing something.");
      this.setState({ loading: false });
      return;
    }
    if (universities === [] || name === '' || password === '' || type === '' || email === '') {
      message.error("Looks like you're missing something.");
      this.setState({ loading: false });
      return;
    }
    if (password.length < 6) {
      message.error('Password must be at least 6 characters long.');
      this.setState({ loading: false });
      return;
    }
    if (strengthColor !== 'green') {
      message.error('Password not strong enough');
      this.setState({ loading: false });
      return;
    }
    fetch('https://us-central1-rails-students.cloudfunctions.net/signup', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reqData),
    })
      .then((result) => {
        if (result.status === 200) {
          firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then((user) => {
              if (user) {
                message.success('Signed Up. Redirecting..');
                if (type === 'student') {
                  history.push('/join/class');
                }
                if (type === 'teacher') {
                  history.push('/create/class');
                }
              }
            });
        } else {
          this.setState({ loading: false });
          message.error(result.message ? result.message : 'Something went wrong.');
        }
      })
      .catch((err) => {
        console.log('Signup Err', err);
        this.setState({ loading: false });
      });
  }

  passwordInputHandler(e) {
    const hasNumber = value => new RegExp(/[0-9]/).test(value);
    const hasMixed = value => new RegExp(/[a-z]/).test(value) && new RegExp(/[A-Z]/).test(value);
    const hasSpecial = value => new RegExp(/[!#@$%^&*)(+=._-]/).test(value);
    let strength = 0;
    if (hasNumber(e.target.value)) strength += 1;
    if (hasSpecial(e.target.value)) strength += 1;
    if (hasMixed(e.target.value)) strength += 1;
    if (strength === 0) this.setState({ strengthColor: 'red', password: e.target.value });
    if (strength === 1) this.setState({ strengthColor: 'orange', password: e.target.value });
    if (strength === 2) this.setState({ strengthColor: 'yellow', password: e.target.value });
    if (e.target.value.length >= 6 && strength === 3) this.setState({ strengthColor: 'green', password: e.target.value });
    else if (e.target.value.length < 6 && strength === 3) this.setState({ strengthColor: 'lightgreen', password: e.target.value });
  }

  render() {
    const {
      type, name, loading, collegeOptions, password, strengthColor,
    } = this.state;
    const { history } = this.props;
    const user = firebase.auth().currentUser;
    if (user) {
      history.push('/dashboard');
    }
    return (
      <div className="signup">
        <h1 className="title">Rails</h1>
        <Card className="signup-card" title="Sign Up">
          <div>
            <Radio.Group
              value={type}
              buttonStyle="solid"
              onChange={(e) => {
                this.setState({ type: e.target.value });
              }}
              className="user-type-radio"
            >
              <Radio.Button value="student">Student</Radio.Button>
              <Radio.Button value="teacher">Teacher</Radio.Button>
            </Radio.Group>
            <Select
              size="large"
              mode="multiple"
              onSearch={this.getColleges}
              prefix={<Icon type="bank" />}
              placeholder="University"
              style={{ width: '100%' }}
              onChange={e => this.setState({ universities: e })}
            >
              {collegeOptions.map(element => (
                <Select.Option key={element['school.name']}>{element['school.name']}</Select.Option>
              ))}
            </Select>
            <Input
              size="large"
              placeholder="Full Name"
              prefix={<Icon type="user" />}
              style={{ marginTop: 10 }}
              value={name}
              onChange={(e) => {
                this.setState({ name: e.target.value });
              }}
            />
            <Input
              size="large"
              placeholder="E-Mail"
              prefix={<Icon type="mail" />}
              style={{ marginTop: 10 }}
              type="email"
              onChange={(e) => {
                this.setState({ email: e.target.value });
              }}
            />
            <Input
              size="large"
              placeholder="Password"
              prefix={<Icon type="ellipsis" />}
              style={{ marginTop: 10 }}
              type="password"
              onChange={this.passwordInputHandler}
            />

            <Progress
              format={(p, sp) => `${Math.round((p / 100) * 6)}/6`}
              percent={100 * (password.length / 6)}
              strokeColor={strengthColor}
            />
            {strengthColor !== 'green' ? (
              <Alert
                message="Password must be 6 or more characters and contain: Uppercase letter (A-Z), Lowercase letter (a-z), Digit (0-9), Special character (~`!@#$%^&*()+=_-{}[]\ "
                type="error"
              />
            ) : null}
            <Button
              icon="check-circle"
              size="large"
              block
              style={{ marginTop: 10 }}
              onClick={this.signup}
              loading={loading}
              type="primary"
            >
              <p style={{ margin: 0, display: 'inline', marginLeft: 10 }}>Sign Up</p>
            </Button>
            <Button size="large" block style={{ marginTop: 10 }} href="/signin">
              <p style={{ margin: 0, display: 'inline' }}>Already have an account? Sign In.</p>
            </Button>
          </div>
        </Card>
      </div>
    );
  }
}
