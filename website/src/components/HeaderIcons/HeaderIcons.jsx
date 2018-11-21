import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase/app';
import PropTypes from 'prop-types';
import 'firebase/auth';
import { IconButton } from '..';
import './HeaderIcons.css';

class HeaderIcons extends PureComponent {
  static propTypes = {
    Icons: PropTypes.arrayOf(PropTypes.shape({
      type: PropTypes.string,
      onClick: PropTypes.func,
    })),
  }

  static defaultProps = {
    Icons: [],
  }

  render() {
    const {
      Icons,
    } = this.props;
    return (
      <div className="HeaderIcons">
        {Icons.map(icon => (
          <IconButton
            key={icon.type}
            type={icon.type}
            onClick={icon.onClick}
          />
        ))}
        <Link to="/signout">
          <IconButton type="exit_to_app" onClick={() => { firebase.auth().signOut(); }} />
        </Link>

      </div>
    );
  }
}

export default HeaderIcons;
