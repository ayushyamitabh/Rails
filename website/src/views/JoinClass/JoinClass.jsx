import React, { Component } from 'react';
import firebase from 'firebase/app';
import {
  Button, Card, Select, message, Table, Modal, Alert,
} from 'antd';
import './JoinClass.css';
import 'firebase/auth';
import { WithProtectedView } from '../../hoc';


class JoinClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedUniversity: '',
      collegeOptions: [],
      classOptions: [],
      loading: false,
      showModal: false,
      selectedClass: {},
    };

    this.getColleges = this.getColleges.bind(this);
    this.getClasses = this.getClasses.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openClassModal = this.openClassModal.bind(this);
    this.confirmClass = this.confirmClass.bind(this);
  }

  getColleges(collegeName) {
    this.setState({ loading: true });
    const prefix = 'https://api.data.gov/ed/collegescorecard/v1/schools/?fields=school.name&per_page=20&school.name=';
    const name = encodeURI(collegeName);
    const suffix = '&school.operating=1&latest.student.size__range=1..&latest.academics.program_available.assoc_or_bachelors=true&school.degrees_awarded.predominant__range=1..3&school.degrees_awarded.highest__range=2..4&api_key=EvH8zAC2Qq6JywcjnHmNHwBnzGkOwSsVHsjXf2bK';
    fetch(prefix + name + suffix)
      .then(res => res.json())
      .then((result) => {
        this.setState({
          collegeOptions: result.results,
          loading: false,
        });
      });
  }

  getClasses(su) {
    const selectedUniversity = su.split('-')[0];
    this.setState({ selectedUniversity, loading: true });
    const reqData = { universityName: selectedUniversity, userEmail: firebase.auth().currentUser.email };
    fetch('https://us-central1-rails-students.cloudfunctions.net/getclasses',
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
        if (result.classList) {
          const classes = result.classList;
          const classOptions = [];
          Object.keys(classes).forEach((c) => {
            classes[c].uid = c;
            classes[c].time = `${classes[c].meetingTimes.from} to ${classes[c].meetingTimes.to}`;
            if (classes[c].meetingDays) {
              const daysArr = [];
              Object.keys(classes[c].meetingDays).forEach((day) => {
                if (classes[c].meetingDays[day] === true) daysArr.push(day.substr(0, 2));
              });
              classes[c].days = daysArr.join('-');
              if (daysArr.length === 0) classes[c].days = 'N/A';
            }
            classOptions.push(classes[c]);
          });
          this.setState({ classOptions });
        } else {
          this.setState({ classOptions: [] });
        }
        this.setState({ loading: false });
      });
  }

  openClassModal(rec) {
    this.setState({
      selectedClass: rec,
      showModal: true,
    });
  }

  closeModal() {
    this.setState({
      selectedClass: false,
      showModal: false,
    });
  }

  confirmClass() {
    const { selectedClass, selectedUniversity } = this.state;
    this.setState({ loading: true });
    let API_URL = '';
    let reqData = {};
    if (selectedClass.approved === true) {
      API_URL = 'https://us-central1-rails-students.cloudfunctions.net/joinclass';
      reqData = {
        universityName: selectedUniversity,
        classUid: selectedClass.uid,
        studentData: {
          email: firebase.auth().currentUser.email,
          uid: firebase.auth().currentUser.uid,
        },
      };
    } else {
      API_URL = 'https://us-central1-rails-students.cloudfunctions.net/requestclass';
      reqData = {
        universityName: selectedUniversity,
        classUid: selectedClass.uid,
        studentEmail: firebase.auth().currentUser.email,
      };
    }
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
      }).catch((err) => {
        this.setState({ loading: false });
        console.log(err);
      });
  }

  render() {
    const {
      collegeOptions, loading, classOptions, showModal, selectedClass,
    } = this.state;
    const columns = [
      {
        title: 'Class Code',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Class Name',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: 'Instructor',
        dataIndex: 'instructorName',
        key: 'instructorName',
      },
      {
        title: 'Time',
        dataIndex: 'time',
        key: 'time',
      },
      {
        title: 'Days',
        dataIndex: 'days',
        key: 'days',
      },
    ];
    return (
      <div className="join-class-page">
        <h1 className="title">Rails</h1>
        <Card
          className="join-card"
          title="Join Class"
          extra={<Button href="/dashboard" type="danger">Back to  Dashboard</Button>}
        >
          <Modal
            onCancel={this.closeModal}
            className="class-modal"
            centered
            visible={showModal}
            title={selectedClass.description}
            footer={[
              <Button
                loading={loading}
                key="cancel-button"
                onClick={this.closeModal}
              >
                Cancel
              </Button>,
              <Button
                key="join-button"
                loading={loading}
                type="primary"
                onClick={this.confirmClass}
              >
                {
                  selectedClass.approved
                    ? 'Join Class'
                    : 'Request Permission'
                }
              </Button>,
            ]}
          >
            {
              selectedClass.approved
                ? <Alert message="Pre-approved for this class" type="success" showIcon />
                : <Alert message="Not pre-approved for this class" type="info" showIcon />
            }
            <p className="join-class-label">
              <span>Section Code: </span>
              {selectedClass.name}
            </p>
            <p className="join-class-label">
              <span>Instructor: </span>
              {selectedClass.instructorName}
            </p>
            <p className="join-class-label">
              <span>Time: </span>
              {selectedClass.time}
            </p>
            <p className="join-class-label">
              <span>Day(s): </span>
              {selectedClass.days}
            </p>
          </Modal>
          <Select
            showSearch
            size="large"
            onSearch={this.getColleges}
            placeholder="University/College"
            style={{ width: '100%' }}
            onChange={this.getClasses}
          >
            {
                collegeOptions.map((element, ei) => (
                  <Select.Option key={`${element['school.name']}-${ei}`}>
                    {element['school.name']}
                  </Select.Option>
                ))
            }
          </Select>
          <Table
            className="join-class-table"
            loading={loading}
            columns={columns}
            dataSource={classOptions}
            onRow={rec => ({
              onClick: () => this.openClassModal(rec),
            })}
          />
        </Card>
      </div>
    );
  }
}

const ProtectedJoinClass = WithProtectedView(JoinClass);
export { ProtectedJoinClass, JoinClass };
