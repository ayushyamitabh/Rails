import React, { PureComponent } from 'react';
import firebase from 'firebase';
import {
  Input, Button, Card, TimePicker, Checkbox, Select, message, Alert,
} from 'antd';
import { WithProtectedView } from '../../hoc';
import 'firebase/auth';
import './CreateClass.css';

class CreateClass extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedUniversity: '',
      className: '',
      sectionCode: '',
      days: new Array(7).fill(false),
      fromTime: '',
      toTime: '',
      approvedEmails: [],
      collegeOptions: [],
      validatedEmails: true,
      loading: false,
    };
    this.getColleges = this.getColleges.bind(this);
    this.processEmailList = this.processEmailList.bind(this);
    this.sendCreateClass = this.sendCreateClass.bind(this);
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

  processEmailList(e) {
    function checkEmail(email) {
      const filter = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (!filter.test(email)) return false;
      return true;
    }
    const value = e.target.value;
    const newLineSeparated = value.split('\n');
    const emailList = [];
    newLineSeparated.forEach((email) => {
      const commaSeparated = email.split(',');
      commaSeparated.forEach((cse, i) => {
        commaSeparated[i] = cse.trim();
      });
      emailList.push(...commaSeparated);
    });
    this.setState({ approvedEmails: emailList });
    let validatedEmails = true;
    emailList.forEach((email) => {
      if (!checkEmail(email) && email !== '') {
        validatedEmails = false;
      }
    });
    this.setState({ validatedEmails });
  }

  sendCreateClass() {
    const {
      isValidated, selectedUniversity, className, sectionCode, days, fromTime, toTime, approvedEmails,
    } = this.state;
    this.setState({ loading: true });
    if (isValidated === false) {
      message.error('Looks like one or more of your emails is incorrect.');
      this.setState({ loading: false });
      return;
    }
    if ((selectedUniversity === '') || (className === '') || (sectionCode === '') || (fromTime === '') || (toTime === '')) {
      message.error('Looks like you\'re missing something.');
      this.setState({ loading: false });
      return;
    }
    if (days.length < 1) {
      message.error('You must pick at least one meeting day.');
      this.setState({ loading: false });
      return;
    }
    const meetingDays = {
      Monday: false,
      Tuesday: false,
      Wednesday: false,
      Thursday: false,
      Friday: false,
      Saturday: false,
      Sunday: false,
    };
    days.forEach((day) => {
      meetingDays[day] = true;
    });
    const reqData = {
      uid: firebase.auth().currentUser.uid,
      universityName: selectedUniversity,
      classData: {
        name: sectionCode,
        description: className,
        instructorUid: firebase.auth().currentUser.uid,
        instructorName: firebase.auth().currentUser.displayName,
        approvedEmails,
        meetingTimes: {
          from: fromTime,
          to: toTime,
        },
        meetingDays,
      },
    };
    fetch('https://us-central1-rails-students.cloudfunctions.net/createclass',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
        body: JSON.stringify(reqData),
      }).then(res => res.json())
      .then((result) => {
        message.info(result.message, 3, () => {
          window.location.reload();
        });
      })
      .catch((err) => {
        console.log('Create class err', err);
        this.setState({ loading: false });
      });
  }

  render() {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const {
      collegeOptions, className, sectionCode, selectedUniversity, validatedEmails, loading,
    } = this.state;
    return (
      <div className="create-class-page">
        <h1 className="title">Rails</h1>
        <Card
          className="create-card"
          title="Create Class"
          extra={<Button href="/dashboard" type="danger">Back to  Dashboard</Button>}
        >
          <Select
            showSearch
            size="large"
            onSearch={this.getColleges}
            placeholder="University/College"
            style={{ width: '100%' }}
            onChange={(e) => { this.setState({ selectedUniversity: e }); }}
          >
            {
                collegeOptions.map(element => (
                  <Select.Option key={element['school.name']}>
                    {element['school.name']}
                  </Select.Option>
                ))

            }
          </Select>
          <Input
            disabled={selectedUniversity === ''}
            className="create-class-input"
            size="large"
            placeholder="Class Name: Topics in Software Engineering"
            value={className}
            onChange={e => this.setState({ className: e.target.value })}
          />
          <Input
            disabled={selectedUniversity === ''}
            className="create-class-input"
            size="large"
            placeholder="Class Code: CSC 59939 (L) [0001]"
            value={sectionCode}
            onChange={e => this.setState({ sectionCode: e.target.value })}
          />
          <p className="create-class-days-label">Meeting Days</p>
          <Checkbox.Group
            disabled={selectedUniversity === ''}
            className="create-class-days create-class-input"
            options={days}
            onChange={e => this.setState({ days: e })}
          />
          <p className="create-class-days-label">Meeting Times</p>
          <div className="time-container">
            <TimePicker
              disabled={selectedUniversity === ''}
              placeholder="From Time"
              className="create-class-input"
              onChange={e => this.setState({ fromTime: e ? e.format('HH:mm') : '' })}
              style={{ marginRight: 20 }}
              minuteStep={5}
              format="HH:mm"
            />
            <TimePicker
              disabled={selectedUniversity === ''}
              placeholder="To Time"
              className="create-class-input"
              onChange={e => this.setState({ toTime: e ? e.format('HH:mm') : '' })}
              minuteStep={5}
              format="HH:mm"
            />
          </div>
          <p className="create-class-days-label">Pre-approved Student Emails</p>
          {
            !validatedEmails
              ? <Alert style={{ margin: '10px auto' }} message="Some e-mail(s) might not be formatted properly." type="error" />
              : null
          }
          <Input.TextArea
            disabled={selectedUniversity === ''}
            className="create-class-input"
            placeholder="Pre-approved e-mails, separate e-mails with commas"
            autosize
            onChange={this.processEmailList}
          />
          <Button
            className="create-class-input"
            block
            disabled={selectedUniversity === ''}
            loading={loading}
            type="primary"
            onClick={this.sendCreateClass}
          >
            Create Class
          </Button>
        </Card>
      </div>
    );
  }
}

const ProtectedCreateClass = WithProtectedView(CreateClass);
export { CreateClass, ProtectedCreateClass };
