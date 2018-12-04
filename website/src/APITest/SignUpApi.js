export function SignUpApi(input) {
  const fetchData = fetch('https://us-central1-rails-students.cloudfunctions.net/signup', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
    },
    body: JSON.stringify(input),
  }).then(result => result);
  return fetchData;
}
