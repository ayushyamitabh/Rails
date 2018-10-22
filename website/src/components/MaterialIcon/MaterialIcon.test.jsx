import React from 'react';
import renderer from 'react-test-renderer';
import { MaterialIcon } from '..';
import '../../utils/tests/test.css';

test('Expect MaterialIcon to return an icon with a settings cog', () => { // eslint-disable-line no-undef
  const component = renderer.create(
    <MaterialIcon type="settings" />,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot(); // eslint-disable-line no-undef
});

test('Expect MaterialIcon to return an icon with a settings cog with a custom class', () => { // eslint-disable-line no-undef
  const component = renderer.create(
    <MaterialIcon className="customClassnpm" type="settings" />,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot(); // eslint-disable-line no-undef
});
