import { SignUpApi } from './SignUpApi';

export async function SignUpApiRespond(input) {
  const fetchData = await SignUpApi(input);
  return fetchData.status;
}
