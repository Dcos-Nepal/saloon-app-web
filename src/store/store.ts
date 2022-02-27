import { createStore, applyMiddleware, compose } from 'redux';

import rootReducer from './reducers/index';
import createSagaMiddleware from 'redux-saga';
import { addJobRequestSaga, fetchJobRequestSaga, fetchJobRequestsSaga, updateJobRequestSaga } from './sagas/job-reqs.saga';
import { addQuoteSaga, fetchQuoteSaga, fetchQuotesSaga, updateQuoteSaga, updateQuoteStatusSaga } from './sagas/quotes.saga';
import {
  addClientSaga,
  addWorkerSaga,
  userSignInSaga,
  addPropertySaga,
  fetchWorkerSaga,
  fetchClientSaga,
  updateWorkerSaga,
  updateClientSaga,
  fetchClientsSaga,
  fetchWorkersSaga,
  userRegisterSaga,
  resetPasswordSaga,
  fetchPropertySaga,
  forgotPasswordSaga,
  updatePropertySaga,
  fetchPropertiesSaga,
  verifyUserEmailSaga
} from './sagas';
import { addJobSaga, fetchJobsSaga, fetchJobSaga, updateJobSaga } from './sagas/jobs.saga';
import { addLineItemSaga, fetchLineItemsSaga, fetchLineItemSaga, updateLineItemSaga } from './sagas/lineItems.saga';
import { addInvoiceSaga, fetchInvoiceSaga, fetchInvoicesSaga, updateInvoiceSaga } from './sagas/invoices.saga';
import { fetchSchedulesSaga } from './sagas/schedules.saga';
import { fetchVisitsSaga } from './sagas/visits.saga';

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
sagaMiddleware.run(addWorkerSaga);
sagaMiddleware.run(updateWorkerSaga);
sagaMiddleware.run(fetchWorkerSaga);
sagaMiddleware.run(userRegisterSaga);
sagaMiddleware.run(userSignInSaga);
sagaMiddleware.run(verifyUserEmailSaga);
sagaMiddleware.run(forgotPasswordSaga);
sagaMiddleware.run(resetPasswordSaga);
sagaMiddleware.run(addJobRequestSaga);
sagaMiddleware.run(fetchJobRequestSaga);
sagaMiddleware.run(updateJobRequestSaga);
sagaMiddleware.run(fetchJobRequestsSaga);
sagaMiddleware.run(addPropertySaga);
sagaMiddleware.run(fetchPropertySaga);
sagaMiddleware.run(updatePropertySaga);
sagaMiddleware.run(fetchPropertiesSaga);
sagaMiddleware.run(addLineItemSaga);
sagaMiddleware.run(fetchLineItemsSaga);
sagaMiddleware.run(fetchLineItemSaga);
sagaMiddleware.run(updateLineItemSaga);
sagaMiddleware.run(addClientSaga);
sagaMiddleware.run(fetchClientsSaga);
sagaMiddleware.run(updateClientSaga);
sagaMiddleware.run(fetchClientSaga);
sagaMiddleware.run(fetchWorkersSaga);
sagaMiddleware.run(fetchQuotesSaga);
sagaMiddleware.run(addQuoteSaga);
sagaMiddleware.run(fetchQuoteSaga);
sagaMiddleware.run(updateQuoteSaga);
sagaMiddleware.run(updateQuoteStatusSaga);
sagaMiddleware.run(addJobSaga);
sagaMiddleware.run(fetchJobsSaga);
sagaMiddleware.run(updateJobSaga);
sagaMiddleware.run(fetchJobSaga);
sagaMiddleware.run(fetchInvoicesSaga);
sagaMiddleware.run(addInvoiceSaga);
sagaMiddleware.run(fetchInvoiceSaga);
sagaMiddleware.run(updateInvoiceSaga);
sagaMiddleware.run(fetchSchedulesSaga);
sagaMiddleware.run(fetchVisitsSaga);
