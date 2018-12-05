const reqData = {
  email: 'Student6@gmail.com',
  name: 'API Test',
  password: '1234567890',
  type: 'student',
  test: true,
};

function SignUpApi(input) {
  const fetchData = fetch('https://us-central1-rails-students.cloudfunctions.net/signup', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
    },
    body: JSON.stringify(input),
  }).then(result => result.status);
  return fetchData;
}

/* To check if a existed userdata on signup page should return 406 */
describe('SignUp APi should work', () => {
  test('The Signup API should return 406 when the user is signuped', async () => { // requir async, since javascipt will not wait for api completed
    // await mean to wait which process to be done, await only can be use in async function
    const data = await SignUpApi(reqData);
    expect(data).toBe(406); // check th status
  });
});
