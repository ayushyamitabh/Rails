const reqData = {
  university: 'CUNY City College',
  classUid: '-LSW4JxPDBTsfzF5xf_D',
  uid: '1kgD5qD6GLXCbvY4aGvqckQEJe02',
};

function getclassdetails(input) {
  const fetchData = fetch('https://us-central1-rails-students.cloudfunctions.net/getclassdetails', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
    },
    body: JSON.stringify(input),
  }).then(result => result.status);
  return fetchData;
}

describe('getclassdetails api should work', () => {
  test('The getclassdetails api should return 200', async () => { // requir async, since javascipt will not wait for api completed
    // await mean to wait which process to be done, await only can be use in async function
    const data = await getclassdetails(reqData);
    expect(data).toBe(200); // check th status
  });
});
