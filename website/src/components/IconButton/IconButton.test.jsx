import React from 'react';
import renderer from 'react-test-renderer';
import {
  shallow,
  configure,
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { IconButton } from '..';

configure({ adapter: new Adapter() });

const sampleFunction = () => {

};
describe('IconButton', () => {
  it('Render IconButon without any errors', () => {
    const component = renderer.create(
      <IconButton type="setting" onClick={sampleFunction} />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('should have a class name called IconButton', () => {
    expect(shallow(<IconButton type="setting" onClick={sampleFunction} />).exists('.IconButton')).toBe(true);
  });
});
