import React from 'react';
import ReactDOM from 'react-dom';
import App from './src/App';

const root = document.createElement('div');
document.body.appendChild(root);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  root,
);
