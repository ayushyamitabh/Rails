import React, { PureComponent } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import 'material-design-icons/iconfont/material-icons.css';


class MaterialIcon extends PureComponent {
  static propTypes = {
    type: PropTypes.string.isRequired,
    className: PropTypes.string,
    style: PropTypes.string,
  }

  static defaultProps = {
    className: null,
    style: null,
  }

  render() {
    const {
      style, className, type,
    } = this.props;
    return (
      <i style={style} className={classnames(className, 'material-icons')}>{type}</i>
    );
  }
}
export default MaterialIcon;
