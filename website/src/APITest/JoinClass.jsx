// join Class APi test
// note ...... This one passed, but I am worried about the duplicate join class issue on same account
// check wifi for insturction for getting the data from API
// I will remove this from test case, add .test to file name, since I am scare that effect to the data.
const reqData = {
  universityName: 'CUNY City College',
  classUid: '-LQ_3KhLHrb54nT_MvMB',
  studentData: {
    email: 'student@email.com',
    uid: 'b74c0Ed7sSbLf552CrsGW80t18e2',
  },
};
// check wiki for any misunderstandng of this function
function getData() {
  const fetchData = fetch('https://us-central1-rails-students.cloudfunctions.net/joinclass', {
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
test('The Join Class API should works', async () => { // requir async, since javascipt will not wait for api completed
  const data = await getData();
  // await mean to wait which process to be done, await only can be use in async function
  expect(data).toBe(200); // check th status
});
