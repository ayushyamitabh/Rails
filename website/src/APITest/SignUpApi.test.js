// get Class APi test
// check wifi for insturction for getting the data from API
import { SignUpApi } from './SignUpApi';
import { SignUpApiRespond } from './SignUpApiRespond';

const reqData = {
  email: 'Student12@gmail.com',
  name: 'API Test',
  password: '1234567890',
  type: 'student',
};

// regular jest test (matcher)
jest.mock('./SignUpApi');
test('The Signup API should works', async () => { // requir async, since javascipt will not wait for api completed
  SignUpApi.mockResolvedValueOnce({
    status: 200,
  });
  // await mean to wait which process to be done, await only can be use in async function
  const data = await SignUpApiRespond(reqData);
  expect(data).toBe(200); // check th status
});
