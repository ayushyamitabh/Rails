const reqData = {
  universityName: 'CUNY City College',
  classUid: '-LRsKoLsK3AAh8ixYSQm',
  studentEmail: 'student@email.com',
};
// check wiki for any misunderstandng of this function
function getData() {
  const fetchData = fetch('https://us-central1-rails-students.cloudfunctions.net/requestclass', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
    },
    body: JSON.stringify(reqData),
  }).then(result => result.status);
  return fetchData;
}

test('The Request Class API should works', async () => { // requir async, since javascipt will not wait for api completed
  const data = await getData();
  // await mean to wait which process to be done, await only can be use in async function
  expect(data).toBe(202); // check th status
});
