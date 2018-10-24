import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { MaterialIcon } from '..';
import './ProfileInfo.css';

class ProfileInfo extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }

  render() {
    const {
      name,
      email,
    } = this.props;

    return (
      <div className="ProfileInfo">
        <MaterialIcon style={{ color: 'black' }} className="ProfileImage" type="account_circle" />
        <div className="rightSide">
          <p className="name">{name}</p>
          <p className="email">{email}</p>
        </div>
      </div>
    );
  }
}
export default ProfileInfo;
