import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import formReducer from "./features/form";
import newsReducer from "./features/news";

import App from "./Components/App";

const store = configureStore({
  reducer: {
    form: formReducer,
    news: newsReducer,
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <App />
  </Provider>
  // </React.StrictMode>
);
