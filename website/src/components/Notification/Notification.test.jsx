import React from 'react';
import renderer from 'react-test-renderer';
import { Notification } from '..';

describe('Notification', () => {
  it('Render Notification without any eror', () => {
    expect(renderer.create(<Notification />).toJSON()).toMatchSnapshot();
  });
});
