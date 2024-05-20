import React from 'react';
import ReactDOM from "react-dom/client";
import App from './App';

export const PROJECT_URL = "https://github.com/gnmyt/myspeed";
export const WEB_URL = "https://myspeed.dev";
export const PROJECT_WIKI = "https://docs.myspeed.dev";
export const DONATION_URL = "https://ko-fi.com/gnmyt";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
