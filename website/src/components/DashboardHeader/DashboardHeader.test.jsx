import React from 'react';
import renderer from 'react-test-renderer';
import {
  configure, shallow,
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter } from 'react-router-dom';
import firebase from 'firebase';
import DashboardHeader from './DashboardHeader';

configure({ adapter: new Adapter() });

describe('DashboardHeader', () => {
  it('Expect DashboardHeader to match snapshot', () => {
    jest.spyOn(firebase, 'auth')
      .mockImplementation(() => ({
        currentUser: {
          displayName: 'testDisplayName',
          email: 'test@test.com',
        },
      }));
    const component = renderer.create(
      <MemoryRouter>
        <DashboardHeader showDrawer={() => {}} teacher />
      </MemoryRouter>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
