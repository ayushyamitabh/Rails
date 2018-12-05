import React from 'react';
import renderer from 'react-test-renderer';
import {
  shallow,
  configure,
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import firebase from 'firebase/app';
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

  /* enzyme testing */
  const wrapper = shallow(<Signin history={array} />);

  it('should contains a h1 tag with class name Title with text Rails', () => {
    expect(wrapper.contains(<h1 className="title">Rails</h1>)).toBe(true);
  });

  it('should contains a h5 tage with intro of Rails', () => {
    expect(wrapper.contains(<h5 className="tag-line">Keep students on track</h5>)).toBe(true);
  });

  it('should contains a signin card', () => {
    expect(wrapper.exists('.signin-card')).toBe(true);
  });

  it('should contains a forgot password modal', () => {
    expect(wrapper.exists('.forgot-password-modal')).toBe(true);
  });

  it('should contains a forgot password label', () => {
    expect(wrapper.exists('.forgot-password-label')).toBe(true);
  });
});
