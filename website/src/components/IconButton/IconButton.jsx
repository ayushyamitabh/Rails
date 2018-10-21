import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './IconButton.css';
import { MaterialIcon } from '..';
import 'material-design-icons/iconfont/material-icons.css';

class IconButton extends PureComponent {
  static propTypes = {
    type: PropTypes.string.isRequired,
    onClick: PropTypes.func,
  }

  static defaultProps = {
    onClick: null,
  }

  render() {
    const {
      type,
      onClick,
    } = this.props;

    return (
      <button type="button" onClick={onClick} className="IconButton">
        <MaterialIcon type={type} />
      </button>
    );
  }
}
export default IconButton;
