import React from 'react';
import renderer from 'react-test-renderer';
import firebase from 'firebase';
import { Profile } from './Profile';
import '../../utils/tests/test.css';

describe('Profile View', () => {
  it('Expect the Profile page to match snap shot', () => { // eslint-disable-line no-undef
    jest.spyOn(firebase, 'auth')
      .mockImplementation(() => ({
        currentUser: {
          displayName: 'testDisplayName',
          email: 'test@test.com',
          emailVerified: true,
          getIdToken: () => new Promise(((resolve) => {
            setTimeout(() => {
              resolve(1234);
            }, 0);
          })),
        },
      }));

    const component = renderer.create(
      <Profile />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot(); // eslint-disable-line no-undef
  });
});
