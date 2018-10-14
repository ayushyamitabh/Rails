/* eslint-disable react/prefer-stateless-function */
import React, { PureComponent } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Home } from './views';
import './App.css';

class App extends PureComponent {
  render() {
    return (
      <Router>
        <div style={{ width: '100%', height: '100%' }}>
          <Route exact path="/" component={Home} />
          {/* Example for route
            <Route path="/...." component={ComponentName} />
          */}
        </div>
      </Router>
    );
  }
}

export default App;
