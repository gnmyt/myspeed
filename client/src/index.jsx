import React from 'react';
import ReactDOM from "react-dom/client";
import App from './App';

export const PROJECT_URL = "https://github.com/gnmyt/myspeed";
export const PROJECT_WIKI = "https://docs.myspeed.dev";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
