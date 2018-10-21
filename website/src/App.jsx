/* eslint-disable react/prefer-stateless-function */
import React, { PureComponent } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Home, SamplePage } from './views';
import { Dashboard } from './components';
import './App.css';

class App extends PureComponent {
  render() {
    return (
      <Router>
        <div style={{ height: '100%' }}>
          <Route exact path="/" component={Home} />
          <Route path="/sample" component={SamplePage} />
          <Dashboard>
            <Route path="/dashboard" component={SamplePage} />
          </Dashboard>
        </div>
        {/* Example for route
            <Route path="/...." component={ComponentName} />
          */}
      </Router>
    );
  }
}

export default App;
