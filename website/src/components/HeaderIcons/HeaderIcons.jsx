import React, {PureComponent} from 'react';
import { IconButton } from '..';
import './HeaderIcons.css';

class HeaderIcons extends PureComponent {
  render(){
    const {
      showDrawer
    } = this.props;
    return(
  <div className="HeaderIcons">
    <IconButton type="add_circle" onClick={() => console.log('Button Circle Clicked')} />
    <IconButton type="add_alert" onClick={() => console.log('Button Bell1 Clicked')} />
    <IconButton type="notifications_active" onClick={() => showDrawer()} />
    <IconButton type="settings" onClick={() => console.log('Button Settings Clicked')} />
  </div>
    )
  }
}

export default HeaderIcons;
