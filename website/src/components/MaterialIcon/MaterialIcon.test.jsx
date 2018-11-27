import React from 'react';
import renderer from 'react-test-renderer';
import {
  shallow,
  configure,
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MaterialIcon } from '..';
import '../../utils/tests/test.css';

configure({ adapter: new Adapter() });

describe('MaterialIcon', () => {
  it('Expect MaterialIcon to return an icon with a settings cog', () => {
    expect(renderer.create(<MaterialIcon type="settings" />).toJSON()).toMatchSnapshot();
  });

  it('Expect MaterialIcon to return an icon with a settings cog with a custom class', () => {
    expect(renderer.create(<MaterialIcon className="customClassnpm" type="settings" />).toJSON()).toMatchSnapshot();
  });

  it('should contains a i tag with corresponding classname and type with text type argument(settings)', () => {
    expect(shallow(<MaterialIcon className="customClassnpm" type="settings" />).contains(<i style={null} className="customClassnpm material-icons">settings</i>)).toBe(true);
  });

  it('should have a class name called customClassnpm(from argument)', () => {
    expect(shallow(<MaterialIcon className="customClassnpm" type="settings" />).exists('.customClassnpm')).toBe(true);
  });
});
