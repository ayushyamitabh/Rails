// Approve Class APi test
// note.. this one failed, I think I lack of information how to this work
// check wifi for insturction for getting the data from API
import firebase from 'firebase';

const reqData = {
  universityName: 'CUNY City College',
  classUid: '-LRsKoLsK3AAh8ixYSQm',
  studentEmail: 'student6@gmail.com',
  uid: 'OvpZeN52EQXlXv2uCETVfsMpJcm2',
};
// check wiki for any misunderstandng of this function
function getData() {
  const fetchData = fetch('https://us-central1-rails-students.cloudfunctions.net/approveclass', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
    },
    body: JSON.stringify(reqData),
  }).then(res => res.json())
    .then((result) => {
      console.log(result.message);
      return result.status;
    });
  return fetchData;
}

// regular jest test (matcher)
describe('Approve Api test', () => {
  it('The Approve Class API should works', async () => { // requir async, since javascipt will not wait for api completed
    jest.spyOn(firebase, 'auth')
      .mockImplementation(() => ({
        currentUser: {
          displayName: 'Teacher Liu',
          email: 'liuteacher@email.com',
          type: 'teacher',
          emailVerified: true,
          getIdToken: () => new Promise(((resolve) => {
            setTimeout(() => {
              resolve(1234);
            }, 0);
          })),
        },
      }));
    const data = await getData();
    // await mean to wait which process to be done, await only can be use in async function
    expect(data).toBe(200); // check th status
  });
});
