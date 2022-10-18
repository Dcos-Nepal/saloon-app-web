import { createStore, applyMiddleware, compose } from 'redux';

import rootReducer from './reducers/index';
import createSagaMiddleware from 'redux-saga';
import { addQuoteSaga, fetchQuoteSaga, fetchQuotesSaga, updateQuoteSaga, updateQuoteStatusSaga } from './sagas/quotes.saga';
import {
  addClientSaga,
  fetchClientSaga,
  fetchClientsSaga
} from './sagas';
import { fetchLineItemsSaga, fetchLineItemSaga, updateLineItemSaga } from './sagas/lineItems.saga';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: any;
  }
}

// Create Saga middleware
const sagaMiddleware = createSagaMiddleware();

// Devtools and middleware definition
const reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
const middleware =
  window.__REDUX_DEVTOOLS_EXTENSION__ && process.env.NODE_ENV === 'development'
    ? compose(applyMiddleware(sagaMiddleware), reduxDevTools)
    : applyMiddleware(sagaMiddleware);

// Create Store
export const store = createStore(rootReducer, middleware);

// Run defined Sagas here
sagaMiddleware.run(fetchLineItemsSaga);
sagaMiddleware.run(fetchLineItemSaga);
sagaMiddleware.run(updateLineItemSaga);
sagaMiddleware.run(addClientSaga);
sagaMiddleware.run(fetchClientsSaga);
sagaMiddleware.run(fetchClientSaga);
sagaMiddleware.run(fetchQuotesSaga);
sagaMiddleware.run(addQuoteSaga);
sagaMiddleware.run(fetchQuoteSaga);
sagaMiddleware.run(updateQuoteSaga);
sagaMiddleware.run(updateQuoteStatusSaga);
