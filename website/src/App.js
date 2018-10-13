import './App.css';
import React, { Component } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {Home} from './views';

class App extends Component {
  render() {
    return (
      <Router>
        <div style={{width: '100%', height: '100%'}}>
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
