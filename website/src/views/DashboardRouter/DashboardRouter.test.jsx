import React from 'react';
import renderer from 'react-test-renderer';
import {
  configure,
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import firebase from 'firebase';
import { MemoryRouter } from 'react-router-dom';
import { DashboardRouter } from '..';

configure({ adapter: new Adapter() });


describe('DashboardRouter', () => {
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
  it('Render DashboardRouter without any eror', () => {
    const component = renderer.create(
      <MemoryRouter>
        <DashboardRouter />
      </MemoryRouter>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
