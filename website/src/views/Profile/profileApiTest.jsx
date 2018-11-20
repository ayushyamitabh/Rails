const fake_data =     {
        "message" : "User profile found",
        "userData" : {
            "displayName": "Full Name",
            "email": "fullname@email.com",
            "type": "student",
            "universities": {
                "CUNY City College" : {
                    "classUid1" : {
                        "name": "CSC 59939 (L)",
                        "description" : "Topics In Software Engineering",
                        "instructorName" : "Teacher Name",
                        "meetingTimes" : {
                            "from": "18:30",
                            "to": "21:00"
                        },
                        "meetingDays" : {
                            "Monday": false,
                            "Tuesday": false,
                            "Wednesday": true,
                            "Thursday": false,
                            "Friday": false,
                            "Saturday": false,
                            "Sunday": false,
                        },
                        "events" : {
                            "eventUid" : {
                                "postedDate" : "2018-11-06T23:37:04.888Z",
                                "dueDate" : "2018-12-06T23:37:04.888Z",
                                "title" : "First Release",
                                "description" : "asdfkaljsdfas",
                                "priority" : 2,
                            }
                        }
                    },
                    "classUid2" : {
                        "name": "CSC 59999 (L)",
                        "description" : "Topics In Software Engineering",
                        "instructorName" : "Teacher Name",
                        "meetingTimes" : {
                            "from": "18:30",
                            "to": "21:00"
                        },
                        "meetingDays" : {
                            "Monday": false,
                            "Tuesday": false,
                            "Wednesday": true,
                            "Thursday": false,
                            "Friday": false,
                            "Saturday": false,
                            "Sunday": false,
                        },
                        "events" : {
                            "eventUid" : {
                                "postedDate" : "2018-11-06T23:37:04.888Z",
                                "dueDate" : "2018-12-06T23:37:04.888Z",
                                "title" : "First Release",
                                "description" : "asdfkaljsdfas",
                                "priority" : 2,
                            }
                        }
                    }
                },
                "CUNY Baruch College" : {
                    "classUid1" : {
                        "name": "CSC 59939 (L)",
                        "description" : "Topics In Software Engineering",
                        "instructorName" : "Teacher Name",
                        "meetingTimes" : {
                            "from": "18:30",
                            "to": "21:00"
                        },
                        "meetingDays" : {
                            "Monday": false,
                            "Tuesday": false,
                            "Wednesday": true,
                            "Thursday": false,
                            "Friday": false,
                            "Saturday": false,
                            "Sunday": false,
                        },
                        "events" : {
                            "eventUid" : {
                                "postedDate" : "2018-11-06T23:37:04.888Z",
                                "dueDate" : "2018-12-06T23:37:04.888Z",
                                "title" : "First Release",
                                "description" : "asdfkaljsdfas",
                                "priority" : 2,
                            }
                        }
                    },
                    "classUid2" : {
                        "name": "CSC 59999 (L)",
                        "description" : "Topics In Software Engineering",
                        "instructorName" : "Teacher Name",
                        "meetingTimes" : {
                            "from": "18:30",
                            "to": "21:00"
                        },
                        "meetingDays" : {
                            "Monday": false,
                            "Tuesday": false,
                            "Wednesday": true,
                            "Thursday": false,
                            "Friday": false,
                            "Saturday": false,
                            "Sunday": false,
                        },
                        "events" : {
                            "eventUid" : {
                                "postedDate" : "2018-11-06T23:37:04.888Z",
                                "dueDate" : "2018-12-06T23:37:04.888Z",
                                "title" : "First Release",
                                "description" : "asdfkaljsdfas",
                                "priority" : 2,
                            }
                        }
                    }
                }
            }
        }
    }
    window.fetch('https://us-central1-rails-students.cloudfunctions.net/getprofile', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reqData),
        })
    .then((res) => {
        if (res.status === 200) {
           // success case
           console.log(res)
        } else {
            // check for other codes if needed,
            // can otherwise just show the message
            message.info(res.message); // import { message } from 'antd';
        }
    })
    .catch((err) => {
        // Error sending request. Client side should handle
    });

const getName = data => data.userData.displayName;
const getEmail = data => data.userData.email;
const getUniversities = (data) => {
  let result = [];
  for (let university in data.userData.universities) {
    //console.log(university); // loop each university
    let name = university;
    result.push({name:university,course:data.userData.universities[university]});
  }
  return result;
}
console.log(getName(fake_data))
console.log(getEmail(fake_data))
console.log(getUniversities(fake_data));
