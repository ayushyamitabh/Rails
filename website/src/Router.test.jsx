import React from 'react';
import {
  mount,
  configure,
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import firebase from 'firebase/app';
import { MemoryRouter } from 'react-router-dom';
import { App } from './App';
import {
  Home, Signin, Signup, ProtectedCreateClass, ProtectedJoinClass, NotFound,
  ProtectedDashboardRouter,
} from './views';


configure({ adapter: new Adapter() });
describe('Router Test', () => {
  /* mock Firebase */
  jest.spyOn(firebase, 'auth') // mock the auth function with user is defined
    .mockImplementation(() => ({
      currentUser: {
        displayName: 'testDisplayName',
        email: 'test@test.com',
      },
    }));

  jest.spyOn(firebase, 'app').mockImplementation(() => {
  }); // mock the app firebase app.

  it('/ path should redirect to Home', () => {
    const wrapper = mount(
      /* mount with MemoryRouter, initialEntries is a props for visit different router */
      // path to home
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    expect(wrapper.find(Home)).toHaveLength(1); // 1 for true, this is home page
    expect(wrapper.find(NotFound)).toHaveLength(0); // 0 for false, this is not NotFound
  });

  /* Sign In */
  it('/signin path should redirect to signin', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={['/signin']}>
        <App />
      </MemoryRouter>,
    );
    expect(wrapper.find(Signin)).toHaveLength(1); // check for sign in page
    expect(wrapper.find(NotFound)).toHaveLength(0); // not a 404 page
  });

  /* signup when user is defined */
  it('/signup with defined user, path should redirect to dashboard', () => {
    const wrapper = mount(
      // path to signup
      <MemoryRouter initialEntries={['/signup']}>
        <App />
      </MemoryRouter>,
    );
    // TODO: Fix this don't like this
    expect(wrapper.find(Signup)).toHaveLength(0); // check for sign out page
    expect(wrapper.find(ProtectedDashboardRouter)).toHaveLength(1);
    expect(wrapper.find(NotFound)).toHaveLength(0); // not a 404 page
  });

  /* signup when user is not defined */
  it('/signup with undefined user path should redirect to signup', () => {
    jest.spyOn(firebase, 'auth') // remock auth when current user is undefined
      .mockImplementation(() => ({
        currentUser: undefined,
      }));
    const wrapper = mount(
      // path to signup
      <MemoryRouter initialEntries={['/signup']}>
        <App />
      </MemoryRouter>,
    );

    expect(wrapper.find(Signup)).toHaveLength(1); // check for sign out page
    expect(wrapper.find(ProtectedDashboardRouter)).toHaveLength(0);
    expect(wrapper.find(NotFound)).toHaveLength(0); // not a 404 page
  });

  /* create class */
  it('/create/class path should redirect to signup', () => {
    const wrapper = mount(
      // path to create class
      <MemoryRouter initialEntries={['/create/class']}>
        <App />
      </MemoryRouter>,
    );
    expect(wrapper.find(ProtectedCreateClass)).toHaveLength(1); // check for create page page
    expect(wrapper.find(NotFound)).toHaveLength(0); // not a 404 page
  });

  /* join class */
  it('/join/class path should redirect to signup', () => {
    // path to join class
    const wrapper = mount(
      <MemoryRouter initialEntries={['/join/class']}>
        <App />
      </MemoryRouter>,
    );
    expect(wrapper.find(ProtectedJoinClass)).toHaveLength(1); // check for join page page
    expect(wrapper.find(NotFound)).toHaveLength(0); // not a 404 page
  });

  /* dashboard router */
  it('/dashboard path should redirect to signup', () => {
    // path to dashboard
    const wrapper = mount(
      <MemoryRouter initialEntries={['/dashboard']}>
        <App />
      </MemoryRouter>,
    );
    expect(wrapper.find(ProtectedDashboardRouter)).toHaveLength(1); // check for dashboard page
    expect(wrapper.find(NotFound)).toHaveLength(0); // not a 404 page
  });

  /* 404 page testing */
  it('random path should redirect to NotFound', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={['/notARealPage']}>
        <App />
      </MemoryRouter>,
    );
    expect(wrapper.find(NotFound)).toHaveLength(1); // check for 404 pages
  });
});
