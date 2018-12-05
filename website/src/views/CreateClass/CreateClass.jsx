import React, { PureComponent } from 'react';
import firebase from 'firebase/app';
import {
  Input, Button, Card, TimePicker, Checkbox, Select, message, Alert, List,
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
      days: [],
      fromTime: '',
      toTime: '',
      approvedEmails: [],
      parsedEmails: '',
      collegeOptions: [],
      validatedEmails: true,
      loading: false,
      mode: 'create',
      classUid: '',
      pendingEmails: [],
    };
    this.getColleges = this.getColleges.bind(this);
    this.processEmailList = this.processEmailList.bind(this);
    this.sendCreateClass = this.sendCreateClass.bind(this);
    this.dropStudent = this.dropStudent.bind(this);
  }

  componentDidMount() {
    const path = window.location.pathname.toString().split('/');
    path.forEach((p, i) => { path[i] = decodeURI(p); });
    if (path[2] === 'edit') {
      this.setState({
        mode: 'edit',
        collegeOptions: [{ 'school.name': path[3] }],
        selectedUniversity: path[3],
        classUid: path[4],
        loading: true,
      });
      const reqData = {
        university: path[3],
        classUid: path[4],
        uid: firebase.auth().currentUser.uid,
      };
      fetch('https://us-central1-rails-students.cloudfunctions.net/getclassdetails', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
        body: JSON.stringify(reqData),
      })
        .then(res => res.json())
        .then((result) => {
          message.info(result.message);
          if (result.message === 'Found class.') {
            const {
              description, meetingDays, meetingTimes, name, approvedEmails, pendingEmails,
            } = result.classData;
            const parseDays = [];
            Object.keys(meetingDays).forEach((d) => {
              if (meetingDays[d] === 'true' || meetingDays[d] === true) parseDays.push(d);
            });
            let parsedEmails = '';
            if (approvedEmails) parsedEmails = approvedEmails.join(', ');
            this.setState({
              className: description,
              sectionCode: name,
              fromTime: meetingTimes.from,
              toTime: meetingTimes.to,
              days: parseDays,
              loading: false,
              parsedEmails,
              approvedEmails,
              pendingEmails,
            });
          } else {
            message.warn('Go back to dashboard.');
          }
        })
        .catch((err) => {
          this.setState({ loading: false });
          console.log(err);
          message.error(err);
        });
    }
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
    const { value } = e.target;
    this.setState({ parsedEmails: value });
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
      validatedEmails,
      selectedUniversity,
      className,
      sectionCode,
      days,
      fromTime,
      toTime,
      approvedEmails,
      mode,
      classUid,
      pendingEmails,
    } = this.state;
    this.setState({ loading: true });
    if (validatedEmails === false) {
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
      university: selectedUniversity,
      classUid,
      classData: {
        name: sectionCode,
        description: className,
        instructorUid: firebase.auth().currentUser.uid,
        instructorName: firebase.auth().currentUser.displayName,
        approvedEmails,
        pendingEmails,
        meetingTimes: {
          from: fromTime,
          to: toTime,
        },
        meetingDays,
      },
    };
    const API_URL = (mode === 'edit') ? 'https://us-central1-rails-students.cloudfunctions.net/editclass' : 'https://us-central1-rails-students.cloudfunctions.net/createclass';
    fetch(API_URL,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
        body: JSON.stringify(reqData),
      }).then(res => res.json())
      .then((result) => {
        message.info(result.message);
        this.setState({ loading: false });
      })
      .catch((err) => {
        console.log('Create class err', err);
        this.setState({ loading: false });
      });
  }

  dropStudent(email) {
    this.setState({ loading: true });
    if (window.confirm('Are you want to reject this student?')) {
      const { pendingEmails } = this.state;
      const indexOfEmail = pendingEmails.indexOf(email);
      pendingEmails.splice(indexOfEmail, 1);
      this.setState({ pendingEmails });
      this.sendCreateClass();
    }
  }

  approveStudent(email) {
    this.setState({ loading: true });
    const { selectedUniversity, classUid } = this.state;
    const { uid } = firebase.auth().currentUser;
    const reqData = {
      universityName: selectedUniversity,
      classUid,
      studentEmail: email,
      uid,
    };
    fetch('https://us-central1-rails-students.cloudfunctions.net/approveclass',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
        body: JSON.stringify(reqData),
      })
      .then(res => res.json())
      .then((result) => {
        if (result.message === 'Approved and added student to class.') { message.info(result.message, 4, () => { window.location.reload(); }); } else message.info(result.message);
        this.setState({ loading: false });
      })
      .catch((err) => {
        console.log(err);
        message.error(err.message);
        this.setState({ loading: false });
      });
  }

  render() {
    const daysOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const {
      collegeOptions, className, sectionCode, selectedUniversity, validatedEmails, loading, mode, toTime, fromTime, days, parsedEmails, pendingEmails,
    } = this.state;
    return (
      <div className="create-class-page">
        <h1 className="title">Rails</h1>
        <Card
          className="create-card"
          title={mode === 'edit' ? 'Edit Class' : 'Create Class'}
          extra={<Button href="/dashboard" type="danger">Back to  Dashboard</Button>}
        >
          <Select
            disabled={mode === 'edit'}
            showSearch
            size="large"
            onSearch={this.getColleges}
            placeholder="University/College"
            value={selectedUniversity}
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
            disabled={selectedUniversity === '' || loading}
            className="create-class-input"
            size="large"
            placeholder="Class Name: Topics in Software Engineering"
            value={className}
            onChange={e => this.setState({ className: e.target.value })}
          />
          <Input
            disabled={selectedUniversity === '' || loading}
            className="create-class-input"
            size="large"
            placeholder="Class Code: CSC 59939 (L) [0001]"
            value={sectionCode}
            onChange={e => this.setState({ sectionCode: e.target.value })}
          />
          <p className="create-class-days-label">Meeting Days</p>
          <Checkbox.Group
            disabled={selectedUniversity === '' || loading}
            className="create-class-days create-class-input"
            options={daysOptions}
            value={days}
            onChange={e => this.setState({ days: e })}
          />
          <p className="create-class-days-label">Meeting Times</p>
          <div className="time-container">
            <TimePicker
              disabled={selectedUniversity === '' || loading}
              placeholder={mode === 'edit' ? fromTime : 'From Time'}
              className="create-class-input"
              onChange={e => this.setState({ fromTime: e ? e.format('HH:mm') : '' })}
              style={{ marginRight: 20 }}
              minuteStep={5}
              format="HH:mm"
            />
            <TimePicker
              disabled={selectedUniversity === '' || loading}
              placeholder={mode === 'edit' ? toTime : 'To Time'}
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
            disabled={selectedUniversity === '' || loading}
            className="create-class-input"
            placeholder="Pre-approved e-mails, separate e-mails with commas"
            autosize
            value={parsedEmails}
            onChange={this.processEmailList}
          />
          {
            mode === 'edit'
              ? (
                <div className="select-input">
                  <h4>Pending Students</h4>
                  <List
                    className="email-list"
                    dataSource={pendingEmails}
                    renderItem={item => (
                      <List.Item>
                        <div className="email-list-item">
                          <p>{item}</p>
                          <Button className="email-list-button" onClick={() => { this.dropStudent('requested', item); }} type="warn" icon="delete" />
                          <Button className="email-list-button" onClick={() => { this.approveStudent(item); }} type="warn" icon="check" />
                        </div>
                      </List.Item>
                    )}
                  />
                </div>
              )
              : null
          }
          <Button
            className="create-class-input"
            block
            disabled={selectedUniversity === '' || loading}
            loading={loading}
            type="primary"
            onClick={this.sendCreateClass}
          >
            {mode === 'edit' ? 'Edit' : 'Create'}
            {' Class'}
          </Button>
        </Card>
      </div>
    );
  }
}

const ProtectedCreateClass = WithProtectedView(CreateClass);
export { CreateClass, ProtectedCreateClass };
