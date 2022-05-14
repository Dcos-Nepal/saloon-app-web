import { combineReducers } from 'redux';
import authReducer from './auth.reducer';
import clientsReducer from './clients.reducer';
import jobRequestReducer from './job-reqs.reducer';
import propertiesReducer from './properties.reducer';
import jobsReducer from './jobs.reducer';
import quotesReducer from './quotes.reducer';
import workersReducer from './workers.reducer';
import lineItemsReducer from './lineItems.reducer';
import invoicesReducer from './invoices.reducer';
import { completedVisible, weekendsVisible } from './events.reducer';
import scheduleReducer from './schedules.reducer';
import visitsReducer from './visits.reducer';

export default combineReducers({
  auth: authReducer,
  clients: clientsReducer,
  jobs: jobsReducer,
  workers: workersReducer,
  lineItems: lineItemsReducer,
  properties: propertiesReducer,
  jobRequests: jobRequestReducer,
  visits: visitsReducer,
  quotes: quotesReducer,
  invoices: invoicesReducer,
  schedules: scheduleReducer,
  weekendsVisible,
  completedVisible
});
