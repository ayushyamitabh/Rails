import React, { PureComponent } from 'react';
import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/auth';
import {
  Drawer, Icon, Select, Switch, Input, Slider, Button, message, DatePicker, List,
} from 'antd';
import PropTypes from 'prop-types';
import './CreateEventDrawer.css';
import moment from 'moment';
import { ChatFeed } from 'react-chat-ui';

class CreateEventDrawer extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
    eventData: PropTypes.shape({}),
  };

  static defaultProps = {
    onClose: () => console.log('no close function passed'),
    eventData: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      userData: null,
      selectedUni: null,
      selectedClass: null,
      title: null,
      description: null,
      priority: 1,
      discussion: false,
      submission: false,
      uploading: false,
      file: null,
      hasFile: false,
      loading: false,
      dueDate: moment(Date.now()),
      mode: 'create',
      submissions: null,
      discussions: [],
      newMessage: '',
      enterToSend: false,
    };
    this.fileHandler = this.fileHandler.bind(this);
    this.createEvent = this.createEvent.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  componentWillReceiveProps(nxtPrps) {
    if (nxtPrps.userData) this.setState({ userData: nxtPrps.userData });
    if (nxtPrps.eventData) {
      const {
        university, classUid, submissions, title, description, priority, allowDiscussion, allowSubmission, dueDate, hasFile, discussions, eventUid,
      } = nxtPrps.eventData;
      if (nxtPrps.eventData.allowDiscussion && nxtPrps.eventData.discussions) {
        const { displayName } = firebase.auth().currentUser;
        nxtPrps.eventData.discussions.forEach((ed, i) => {
          ed.senderName = ed.fromName;
          ed.id = (ed.fromName === displayName) ? 0 : ed.fromName;
          nxtPrps.eventData.discussions[i] = ed;
        });
      }
      this.setState({
        mode: 'edit',
        selectedUni: university,
        selectedClass: classUid,
        submissions,
        title,
        description,
        priority,
        discussion: allowDiscussion === 'true' || allowDiscussion === true,
        submission: allowSubmission === 'true' || allowSubmission === true,
        discussions,
        dueDate: moment(dueDate),
        hasFile,
        eventUid,
      });
    }
  }

  fileHandler(e = new Event()) {
    e.persist();
    if (e.target.files[0]) {
      this.setState({ file: e.target.files[0] });
    }
  }

  createEvent() {
    this.setState({ loading: true });
    const {
      selectedUni, selectedClass, title, description, priority, discussion, submission, file, dueDate, hasFile, mode,
    } = this.state;
    const {
      eventData,
    } = this.props;
    if (selectedUni && selectedClass && title && description && (priority !== null) && dueDate) {
      const reqData = {
        university: selectedUni,
        classUid: selectedClass,
        eventUid: eventData ? eventData.eventUid : null,
        uid: firebase.auth().currentUser.uid,
        eventData: {
          allowDiscussion: discussion,
          allowSubmission: submission,
          title,
          description,
          priority,
          dueDate,
          postedDate: new Date(Date.now()).toISOString(),
          hasFile: (hasFile || file !== null),
        },
      };
      const API_URL = mode === 'edit' ? 'https://us-central1-rails-students.cloudfunctions.net/editevent' : 'https://us-central1-rails-students.cloudfunctions.net/createevent';
      fetch(API_URL,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reqData),
        }).then(res => res.json())
        .then((result) => {
          message.info(result.message);
          if (result.message === 'Created event.') {
            if (file) {
              this.setState({ uploading: true });
              const spl = file.name.split('.');
              const ext = spl[spl.length - 1];
              const upl = firebase.storage().ref(`${selectedUni}/${selectedClass}/${result.eventUid}/instructions.${ext}`).put(file);
              upl.on(firebase.storage.TaskEvent.STATE_CHANGED,
                (snap) => {
                  // uploading
                }, (err) => {
                  message.error(err.message);
                }, () => {
                  upl.snapshot.ref.getDownloadURL().then((durl) => {
                    reqData.eventData.fileUrl = durl;
                    reqData.eventUid = result.eventUid;
                    fetch('https://us-central1-rails-students.cloudfunctions.net/editevent',
                      {
                        method: 'POST',
                        headers: {
                          Accept: 'application/json',
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(reqData),
                      })
                      .then(res => res.json())
                      .then((updateResult) => {
                        message.info(updateResult.message);
                        this.setState({ loading: false, uploading: false });
                      })
                      .catch((err) => {
                        message.error(err.message);
                        this.setState({ loading: false, uploading: false });
                      });
                  });
                });
            } else {
              this.setState({ loading: false });
            }
          } else {
            this.setState({ loading: false });
          }
        })
        .catch((err) => {
          message.error(err.message);
          this.setState({ loading: false, uploading: false });
        });
    } else {
      message.error('Missing some fields.');
      this.setState({ loading: false });
    }
  }


  sendMessage() {
    this.setState({ loading: true });
    const {
      newMessage, eventUid, selectedUni, selectedClass,
    } = this.state;
    const ma = newMessage.split('\n');
    const mas = ma.join('');
    if (newMessage && mas.length > 0 && newMessage.length > 0) {
      const { uid, displayName, email } = firebase.auth().currentUser;
      const reqData = {
        university: selectedUni,
        classUid: selectedClass,
        eventUid,
        uid,
        email,
        name: displayName,
        message: newMessage,
      };
      console.log(reqData);
      fetch('https://us-central1-rails-students.cloudfunctions.net/addmessage', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqData),
      })
        .then(res => res.json())
        .then((result) => {
          message.info(result.message);
          if (result.message === 'Added comment.') {
            window.location.reload();
          } else {
            this.setState({ loading: false });
          }
        })
        .catch((err) => {
          console.log(err);
          message.error(err.message);
        });
    } else {
      this.setState({ loading: false });
      message.info('Message can\'t be empty.');
    }
  }


  render() {
    const { visible, onClose } = this.props;
    const {
      userData, selectedUni,
      uploading, loading,
      file, mode, submissions,
      title, description,
      priority, selectedClass,
      dueDate, discussion,
      submission, discussions,
      newMessage, enterToSend,
    } = this.state;
    return (
      <Drawer
        title={mode === 'edit' ? `Edit ${title}` : 'Create New Event'}
        placement="right"
        className="drawer-custom"
        closable
        onClose={onClose}
        visible={visible}
      >
        {userData ? (
          <div style={{ width: '100%' }}>
            <Select
              disabled={loading || mode === 'edit'}
              placeholder="Select University"
              value={selectedUni}
              onSelect={v => this.setState({ selectedUni: v })}
              className="select-input"
            >
              {Object.keys(userData.universities).map(uni => (
                <Select.Option key={uni} value={uni}>
                  {uni}
                </Select.Option>
              ))}
            </Select>
            <Select
              value={selectedClass}
              disabled={loading || mode === 'edit'}
              placeholder="Select Class"
              onSelect={v => this.setState({ selectedClass: v })}
              className="select-input"
            >
              {selectedUni ? (
                Object.keys(userData.universities[selectedUni]).map(c => (
                  <Select.Option key={c} value={c}>
                    {userData.universities[selectedUni][c].name}
                  </Select.Option>
                ))
              ) : null}
            </Select>
            <Input
              value={title}
              disabled={loading}
              placeholder="Title"
              className="select-input"
              onChange={e => this.setState({ title: e.target.value })}
            />
            <Input.TextArea
              value={description}
              disabled={loading}
              placeholder="Description"
              className="select-input"
              onChange={e => this.setState({ description: e.target.value })}
            />
            <DatePicker
              value={dueDate}
              placeholder="Due Date & Time"
              disabledDate={c => (c ? new Date(c.toString()) < Date.now() : false)}
              onChange={c => this.setState({ dueDate: c })}
              className="select-input"
              format="MM/DD/YYYY @ HH:mm"
              showToday={false}
              showTime
            />
            <h4 className="select-input">Priority</h4>
            <Slider
              disabled={loading}
              onChange={v => this.setState({ priority: v })}
              dots
              value={priority}
              max={2}
              min={0}

              tipFormatter={(v) => {
                let tip = '';
                if (v === 0) tip = 'Low';
                else if (v === 1) tip = 'Normal';
                else if (v === 2) tip = 'High';
                return tip;
              }}
            />
            <Switch
              checked={discussion}
              disabled={loading}
              onChange={c => this.setState({ discussion: c })}
              className="select-input"
              checkedChildren="Discussion Enabled"
              unCheckedChildren="Discussion Disabled"
            />
            <Switch
              checked={submission}
              disabled={loading}
              onChange={c => this.setState({ submission: c })}
              className="select-input"
              checkedChildren="Submission Enabled"
              unCheckedChildren="Submission Disabled"
            />
            <h4 className="select-input">Add File</h4>
            <input
              disabled={loading}
              onChange={this.fileHandler}
              type="file"
              id="file-to-upload"
              className="hidden"
            />
            <p className="select-input">
              If you have multiple files - we recommend using a compressed file.
            </p>
            <Button
              disabled={loading}
              loading={uploading}
              icon="upload"
              block
              onClick={() => {
                document.getElementById('file-to-upload').click();
              }}
            >
              Upload
            </Button>
            {
              file
                ? <p>{file.name}</p>
                : null
            }
            {
              mode === 'edit'
                ? (
                  <div className="select-input">
                    <h4>Submissions</h4>
                    {
                  submissions
                    ? (
                      <List
                        dataSource={submissions}
                        renderItem={item => <List.Item><Button href={item.fileUrl} block>{item.fileName}</Button></List.Item>}
                      />
                    )
                    : <p>No submissions yet</p>
                }
                  </div>
                )
                : null
            }

            {
                  mode === 'edit' && (discussion === 'true' || discussion === true)
                    ? (
                      <div className="discussion-container">
                        <h4 className="select-input">Discussion</h4>
                        <ChatFeed
                          centered
                          messages={discussions || [{ message: 'No messages yet.' }]}
                          showSenderName
                        />
                        <Input.TextArea
                          disabled={loading}
                          className="select-input"
                          rows={5}
                          placeholder="Add message..."
                          value={newMessage}
                          onChange={e => this.setState({ newMessage: e.target.value })}
                          onPressEnter={enterToSend ? this.sendMessage : null}
                        />
                        <Switch
                          disabled={loading}
                          onChange={c => this.setState({ enterToSend: c })}
                          className="select-input"
                          checkedChildren="Enter To Send"
                          unCheckedChildren="Use Send Button"
                        />
                        {
                          !enterToSend
                            ? <Button loading={loading} block type="primary" icon="right-circle" onClick={this.sendMessage}>Send</Button>
                            : null
                        }
                      </div>
                    )
                    : null
                }
            <Button
              className="select-input"
              disabled={loading}
              loading={loading}
              type="primary"
              icon="check"
              block
              onClick={this.createEvent}
            >
              {mode === 'edit' ? 'Update ' : 'Create '}
              Event
            </Button>
          </div>
        ) : (
          <div>
            <Icon type="loading" />
          </div>
        )}
      </Drawer>
    );
  }
}

export default CreateEventDrawer;
