import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import configureStore from "./store";
import App from "./App";
import { useDispatch } from "react-redux";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

const store = configureStore();

root.render(
  <Provider store={store}>
    <StrictMode>
      <App />
    </StrictMode>
  </Provider>
);
