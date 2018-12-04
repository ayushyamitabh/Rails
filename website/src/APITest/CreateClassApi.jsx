/* Create Class APi test
// note ...... This one passed,
// but I am worried about the duplicate join class issue on same account
// check wifi for insturction for getting the data from API
   I will remove this from test case, add .test to file name,
   since I am scare that effect to the data. */
const reqData = {
  uid: 'XCRZgzLysNOaI9pN8neyU5AQxiT2',
  universityName: 'CUNY City College',
  classData: {
    name: 'CSC 59939 (L)',
    description: 'Topics in Software Engineering',
    instructorUid: 'XCRZgzLysNOaI9pN8neyU5AQxiT2',
    instructorName: 'Full Test Name',
    approvedEmails: ['1@email.com', '2@email.com'],
    meetingTimes: {
      from: '18:30',
      to: '21:00',
    },
    meetingDays: {
      Monday: 'false',
      Tuesday: 'false',
      Wednesday: 'true',
      Thursday: 'false',
      Friday: 'false',
      Saturday: 'false',
      Sunday: 'false',
    },
  },
};
// check wiki for any misunderstandng of this function
function getData() {
  const fetchData = fetch('https://us-central1-rails-students.cloudfunctions.net/createclass', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
    },
    body: JSON.stringify(reqData),
  }).then(result => result.status);
  return fetchData;
}

// regular jest test (matcher)
test('The Create Class API should works', async () => { // requir async, since javascipt will not wait for api completed
  const data = await getData();
  // await mean to wait which process to be done, await only can be use in async function
  expect(data).toBe(200); // check th status
});
