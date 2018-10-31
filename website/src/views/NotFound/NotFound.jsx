import React from 'react';
import { Button, Icon } from 'antd';
import './NotFound.css';

const NotFound = () => (
  <div className="home">
    <h1 className="title">Rails</h1>
    <h5 className="tag-line">You've fallen off track</h5>
    <h2 className="subTitle">404 Page Not Found</h2>
    <Button className="home-button" href="/">
      Get Back on track
      <Icon type="right-circle" theme="filled" />
    </Button>
  </div>
);
export default NotFound;
