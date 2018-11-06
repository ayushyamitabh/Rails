## API DOCUMENTATION

Table of Contents: 
1. [General Notes](#general-notes)
2. [Client Side Notes](#how-to-handle-response-on-client-side)
3. [Sign Up](#sign-up)
4. [Join Class](#join-class)
5. [Create Class](#create-class)
6. [Request Class](#request-class-permission)
7. [Approve Class](#approve-class-permission)


### General Notes

1. All responses from the API will have a `message` value - this should be shown as the notification if needed
2. All data should be sent in the body of the request
3. All request should use the POST method
4. Error Codes:  
   a. `400` - Error - may have `error` value
   b. `200` - Success

### How to handle response on client side

```jsx
fetch(<API_URL>, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: <REQUEST_DATA>,
    })
.then((res) => {
    if (res.status === 200) {
       // success case
    } else {
        // check for other codes if needed,
        // can otherwise just show the message
        message.info(res.message); // import { message } from 'antd';
    }
})
.catch((err) => {
    // Error sending request. Client side should handle
});
```

---

### Sign Up

Use to signup a new user

**API:** https://us-central1-rails-students.cloudfunctions.net/signup  
**Expected Request:**

```json
{
  "email": "test@email.com",
  "name": "Full Test Name",
  "password": "password",
  "type": "student"
}
```
---

### Get Classes

Use to get classes for a certain university

**API:** https://us-central1-rails-students.cloudfunctions.net/getclasses  
**Expected Request:**

```json
{
  "universityName": "CUNY City College"
}
```

**Expected Response:**

Data will contain `approvedEmails` list - use this to check whether the request permission class should be shown. The `key` for each class is also the `classUid`.

```json
{
    "message": "Classes found.",
    "classList": {
        "-LQ_3KhLHrb54nT_MvMB": {
            "approvedEmails": [
                "1@email.com",
                "2@email.com",
                "student@email.com"
            ],
            "description": "Topics in Software Engineering",
            "instructorName": "Full Test Name",
            "meetingTimes": {
                "from": "10:00",
                "to": "13:00"
            },
            "name": "CSC 59939 (L)"
        }
    }
}
```

---

### Join Class

Use this to join a class if the user is pre-approved. Backend also checks for approved status.

**API:** https://us-central1-rails-students.cloudfunctions.net/joinclass  
**Expected Request:**

```json
{
    "universityName": "CUNY City College",
    "classUid": "-LQ_3KhLHrb54nT_MvMB",
	"studentData": {
    	"email": "student@email.com",
    	"uid": "b74c0Ed7sSbLf552CrsGW80t18e2"
	}
}
```

---

### Create Class

Use this to create new class. Backend checks to make sure user is a teacher.

**API:** https://us-central1-rails-students.cloudfunctions.net/createclass  
**Expected Request:**

The `uid` should be the user's UID, this is to make sure the user has proper priviledges. All `classData` is used for the university data as is - adding extra fields will be reflected in the database. `approvedEmails` is not a required field.

```json
{
  "uid": "XCRZgzLysNOaI9pN8neyU5AQxiT2",
  "universityName": "CUNY City College",
  "classData": {
    "name": "CSC 59939 (L)",
    "description": "Topics in Software Engineering",
    "instructorUid": "XCRZgzLysNOaI9pN8neyU5AQxiT2",
    "instructorName": "Full Test Name",
    "approvedEmails": ["1@email.com", "2@email.com"],
    "meetingTimes": {
      "from": "18:30",
      "to": "21:00"
    },
    "meetingDays" : {
        "Monday": "false",
        "Tuesday": "false",
        "Wednesday": "true",
        "Thursday": "false",
        "Friday": "false",
        "Saturday": "false",
        "Sunday": "false"
    }
  }
}
```  

---

### Request Class Permission

Use this as a student to request permission for a class if not preapproved.

**API:** https://us-central1-rails-students.cloudfunctions.net/requestclass  
**Expected Request:**

```json
{
    "universityName": "CUNY City College",
    "classUid": "-LQ_3KhLHrb54nT_MvMB",
    "studentEmail": "student@email.com"
}
```

---

### Approve Class Permission

Use this as an instructor to approve permission for a student.

**API:** https://us-central1-rails-students.cloudfunctions.net/approveclass  

**Expected Request:**  

The `uid` field should be the instructor's UID.

```json
{
  "universityName": "CUNY City College",
  "classUid": "-LQ_3KhLHrb54nT_MvMB",
  "studentEmail": "student@email.com",
  "uid": "XCRZgzLysNOaI9pN8neyU5AQxiT2"
}
```
