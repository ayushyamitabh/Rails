
import React from 'react';
import renderer from 'react-test-renderer';
import { SampleComponent } from '..';

test('Expect SampleComponent to return a div with its name', () => { // eslint-disable-line no-undef
  const component = renderer.create(
    <SampleComponent />,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot(); // eslint-disable-line no-undef
});
