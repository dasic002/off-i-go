import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router } from "react-router-dom";
import { CurrentUserProvider } from "./contexts/CurrentUserContext";
import { DeviceSizeProvider } from "./contexts/DeviceSizeContext";
import { ProfileDataProvider } from "./contexts/ProfileDataContext";
import { GeoPositionProvider } from "./contexts/GeoPositionContext";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <CurrentUserProvider>
        <ProfileDataProvider>
          <GeoPositionProvider>
            <DeviceSizeProvider>
              <App />
            </DeviceSizeProvider>
          </GeoPositionProvider>
        </ProfileDataProvider>
      </CurrentUserProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
