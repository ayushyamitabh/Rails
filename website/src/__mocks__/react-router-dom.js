import React from 'react';
const rrd = require('react-router-dom');
rrd.BrowserRouter = ({children}) => <div>{children}</div>
module.exports = rrd;
// this is a manual mock of Jest, which it redefine the browserRouter, since it will conflict with memory router.
