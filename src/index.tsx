import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";

// UI Styles
import "bootstrap/js/dist/dropdown";
import "bootstrap/js/dist/modal";
import "bootstrap/dist/css/bootstrap.min.css";
import "assets/scss/style.css"
import "./index.css";

// Redux/Saga/Store
import { store } from "store/store";
import { Provider } from "react-redux";
import { Loader } from "common/components/atoms/Loader";

// Lazy loading the component
const App = React.lazy(() => import("./App"));
const ErrorBoundary = React.lazy(() => import("common/components/ErrorBoundary"));

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "box-icon": any;
    }
  }
}

ReactDOM.render(
  <Suspense fallback={<Loader isLoading={true} />}>
    <ErrorBoundary>
      <React.StrictMode>
        <Provider store={store}>
          <Suspense fallback={<Loader isLoading={true} />}>
            <App />
          </Suspense>
        </Provider>
      </React.StrictMode>
    </ErrorBoundary>
  </Suspense>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
