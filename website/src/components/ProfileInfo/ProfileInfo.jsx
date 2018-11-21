import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './ProfileInfo.css';
import Logo from '../../resources/logo.svg';

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
        <a href="/dashboard"><img src={Logo} alt="Rails" className="header-logo" /></a>
        <div className="rightSide">
          <p className="name">{name}</p>
          <p className="email">{email}</p>
        </div>
      </div>
    );
  }
}
export default ProfileInfo;
