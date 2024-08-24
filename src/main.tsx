import ReactDOM from "react-dom/client";
// import App from "./App";
import { App } from "./app";

import { StoreContext, RootStore } from "./store";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StoreContext.Provider value={RootStore}>
    <App />
  </StoreContext.Provider>
);
