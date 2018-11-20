import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, mount, render, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Button, Card, Icon } from 'antd';
import { IconButton } from '..';

configure({ adapter: new Adapter() });

const sampleFunction = () => {

}
describe("IconButton", () => {
  it('Render IconButon without any errors', () => { // eslint-disable-line no-undef
    const component = renderer.create(
      <IconButton type="setting" onClick={sampleFunction}/>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot(); // eslint-disable-line no-undef
  });
 it('should have a class name called IconButton', () => {
  expect(shallow(<IconButton type="setting" onClick={sampleFunction}/>).exists('.IconButton')).toBe(true)
});
})
