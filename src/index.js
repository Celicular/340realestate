import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App";
import store from "./redux/store";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import ReactGA from "react-ga4";

ReactGA.initialize("G-XRKGZZK5YK");
// ReactGA.send("pageview")

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <HashRouter>
        <App />
      </HashRouter>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
