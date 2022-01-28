import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import rootReducer from "./reducers/index";
import { fetchClientsSaga, fetchWorkersSaga, forgotPasswordSaga, resetPasswordSaga, userRegisterSaga, userSignInSaga, verifyUserEmailSaga } from "./sagas";
import { fetchJobRequestsSaga, addJobRequestSaga } from "./sagas/job-reqs.saga";
import { fetchQuotesSaga } from "./sagas/quotes.saga";

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: any;
  }
}

// Create Saga middleware
const sagaMiddleware = createSagaMiddleware();

// Devtools and middleware definition
const reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
const middleware = window.__REDUX_DEVTOOLS_EXTENSION__ && process.env.NODE_ENV === "development"
        ? compose(applyMiddleware(sagaMiddleware), reduxDevTools)
        : applyMiddleware(sagaMiddleware);

// Create Store
export const store = createStore(rootReducer, middleware);

// Run defined Sagas here
sagaMiddleware.run(userRegisterSaga);
sagaMiddleware.run(userSignInSaga);
sagaMiddleware.run(verifyUserEmailSaga);
sagaMiddleware.run(forgotPasswordSaga);
sagaMiddleware.run(resetPasswordSaga);
sagaMiddleware.run(addJobRequestSaga);
sagaMiddleware.run(fetchJobRequestsSaga);
sagaMiddleware.run(fetchClientsSaga);
sagaMiddleware.run(fetchWorkersSaga);
sagaMiddleware.run(fetchQuotesSaga);
