const reqData = {
  uid: 'JhaI6ZCZpBO1DwnEZFfwDvCqdvl2',
  eventUid: 'eventUID1',
  classUid: '-LRsKoLsK3AAh8ixYSQm',
};

function geteventdetails(input) {
  const fetchData = fetch('https://us-central1-rails-students.cloudfunctions.net/geteventdetails', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
    },
    body: JSON.stringify(input),
  }).then(result => result.status);
  return fetchData;
}

describe('geteventdetails api should work', () => {
  test('The geteventdetails api should return 200', async () => { // requir async, since javascipt will not wait for api completed
    // await mean to wait which process to be done, await only can be use in async function
    const data = await geteventdetails(reqData);
    expect(data).toBe(200); // check th status
  });
});
