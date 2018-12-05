import React, { Component } from 'react';
import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/auth';
import {
  Drawer, Icon, Input, Button, message, Switch,
} from 'antd';
import PropTypes from 'prop-types';
import { ChatFeed } from 'react-chat-ui';
import './ViewEventDrawer.css';
import moment from 'moment';

class ViewEventDrawer extends Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
  };

  static defaultProps = {
    onClose: () => console.log('no close function passed'),
  };

  constructor(props) {
    super(props);
    this.state = {
      eventData: null,
      file: null,
      loading: false,
      newMessage: '',
      enterToSend: false,
      displayName: 'YOUR_NAME',
    };
    this.sendMessage = this.sendMessage.bind(this);
    this.fileHandler = this.fileHandler.bind(this);
    this.submitFile = this.submitFile.bind(this);
  }

  componentWillReceiveProps(nxtPrps) {
    if (nxtPrps.eventData) {
      const nxted = nxtPrps.eventData;
      if (nxted.allowDiscussion && nxted.discussions) {
        const { displayName } = firebase.auth().currentUser;
        nxted.discussions.forEach((ed, i) => {
          ed.senderName = ed.fromName;
          ed.id = (ed.fromName === displayName) ? 0 : ed.fromName;
          nxted.discussions[i] = ed;
        });
      }
      this.setState({
        eventData: nxted,
      });
    }
  }

  fileHandler(e = new Event()) {
    if (e.target.files[0]) {
      this.setState({ file: e.target.files[0] });
      message.info('Click submit again to confirm.', 4);
    }
  }

  submitFile() {
    this.setState({ loading: true });
    const { eventData, file } = this.state;
    const { university, classUid, eventUid } = eventData;
    const { displayName, uid, email } = firebase.auth().currentUser;
    const upl = firebase.storage().ref(`${university}/${classUid}/${eventUid}/${displayName}.${file.name.split('.')[file.name.split('.').length - 1]}`).put(file);
    upl.on(firebase.storage.TaskEvent.STATE_CHANGED,
      () => {
        // uploading
      }, (err) => {
        console.log(err);
        message.error(err.message);
        this.setState({ loading: false });
      }, () => {
        upl.snapshot.ref.getDownloadURL()
          .then((durl) => {
            const reqData = {
              university,
              classUid,
              eventUid,
              uid,
              name: displayName,
              email,
              fileUrl: durl,
              fileName: `${displayName}.${file.name.split('.')[file.name.split('.').length - 1]}`,
            };
            fetch('https://us-central1-rails-students.cloudfunctions.net/addsubmission', {
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
                if (result.message === 'Added submission.') {
                  this.setState({ loading: false });
                }
              })
              .catch((err) => {
                message.error(err.message);
                console.log(err);
                this.setState({ loading: false });
              });
          })
          .catch((err) => {
            message.error(err.message);
            console.log(err);
            this.setState({ loading: false });
          });
      });
  }

  sendMessage() {
    this.setState({ loading: true });
    const { newMessage, eventData } = this.state;
    const ma = newMessage.split('\n');
    const mas = ma.join('');
    if (newMessage && mas.length > 0 && newMessage.length > 0) {
      const { university, classUid, eventUid } = eventData;
      const { uid, displayName, email } = firebase.auth().currentUser;
      const reqData = {
        university,
        classUid,
        eventUid,
        uid,
        email,
        name: displayName,
        message: newMessage,
      };
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
            const getEventReqData = { eventUid, classUid, uid };
            fetch(
              'https://us-central1-rails-students.cloudfunctions.net/geteventdetails',
              {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(getEventReqData),
              },
            )
              .then(res => res.json())
              .then((getEventResult) => {
                if (getEventResult.message === 'Found event') {
                  const nxted = getEventResult.eventData;
                  nxted.university = university;
                  nxted.classUid = classUid;
                  nxted.eventUid = eventUid;
                  nxted.discussions.forEach((ed, i) => {
                    ed.senderName = ed.fromName;
                    ed.id = (ed.fromName === displayName) ? 0 : ed.fromName;
                    nxted.discussions[i] = ed;
                  });
                  this.setState({
                    eventData: nxted,
                    loading: false,
                    newMessage: '',
                  });
                }
              })
              .catch((err) => {
                console.log(err);
                message.error(err.message);
              });
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
      eventData, file, loading, newMessage, enterToSend, displayName,
    } = this.state;
    return (
      <Drawer
        title={eventData ? eventData.title : 'Loading event...'}
        placement="right"
        width="500"
        closable
        onClose={onClose}
        visible={visible}
      >
        {
          eventData
            ? (
              <div className="view-event-container">
                <h4>Due Date</h4>
                <p>{`${moment(eventData.dueDate).toDate().toDateString()} at ${moment(eventData.dueDate).toDate().toLocaleTimeString()}`}</p>
                <h4>Description</h4>
                <Input.TextArea
                  className="select-input"
                  value={eventData.description}
                />
                {
                  eventData.hasFile
                    ? <Button href={eventData.fileUrl} block icon="download" type="primary">Download Instructions</Button>
                    : null
                }
                {
                  eventData.allowSubmission === 'true' || eventData.allowSubmission === true
                    ? (
                      <div>
                        <h4 className="select-input">Submission</h4>
                        <input
                          disabled={loading}
                          onChange={this.fileHandler}
                          type="file"
                          id="file-submit"
                          className="hidden"
                        />
                        <p className="select-input">
                          If you have multiple files - we recommend using a compressed file.
                        </p>
                        <Button
                          loading={loading}
                          icon="upload"
                          block
                          onClick={file ? this.submitFile : () => {
                            document.getElementById('file-submit').click();
                          }}
                        >
                          Submit
                          {file ? ` ${file.name}` : ''}
                        </Button>
                        {
                          file ? (
                            <div>
                              <Button
                                className="select-input"
                                loading={loading}
                                icon="upload"
                                type="danger"
                                block
                                onClick={() => {
                                  document.getElementById('file-submit').click();
                                }}
                              >
                                Change File
                              </Button>
                              <p>
                                Will be uploaded as
                                {` '${moment(eventData.dueDate) < moment.now() ? '[LATE]' : ''}${displayName}.${file.name.split('.')[file.name.split('.').length - 1]}'`}
                              </p>
                            </div>
                          ) : null
                        }
                      </div>
                    )
                    : null
                }
                {
                  eventData.allowDiscussion === 'true' || eventData.allowDiscussion === true
                    ? (
                      <div className="discussion-container">
                        <h4 className="select-input">Discussion</h4>
                        <ChatFeed
                          centered
                          messages={eventData.discussions ? eventData.discussions : [{ message: 'No messages yet.' }]}
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
              </div>
            )
            : (
              <div className="select-input">
                <Icon type="loading" />
              </div>
            )
        }
      </Drawer>
    );
  }
}

export default ViewEventDrawer;
