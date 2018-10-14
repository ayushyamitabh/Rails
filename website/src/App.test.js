import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// TODO: Find a better approach to no-undef in tests
it('renders without crashing', () => { // eslint-disable-line no-undef
  const div = document.createElement('div'); // eslint-disable-line no-undef
  ReactDOM.render(<App />, div); // eslint-disable-line
  ReactDOM.unmountComponentAtNode(div);
});
