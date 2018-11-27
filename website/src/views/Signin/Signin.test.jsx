import React from 'react';
import renderer from 'react-test-renderer';
import {
  configure,
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import firebase from 'firebase';
import { Signin } from '..';

configure({ adapter: new Adapter() });

describe('Signin', () => {
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
  const array = [1, 2, 3];
  it('Render Signin without any eror', () => {
    expect(renderer.create(<Signin history={array} />).toJSON()).toMatchSnapshot();
  });
});
