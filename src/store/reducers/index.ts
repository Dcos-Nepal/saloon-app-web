import { combineReducers } from 'redux';
import authReducer from './auth.reducer';
import clientsReducer from './clients.reducer';
import { eventsById, weekendsVisible } from './events.reducer';
import jobRequestReducer from './job-reqs.reducer';
import propertiesReducer from './properties.reducer';
import jobsReducer from './jobs.reducer';
import quotesReducer from './quotes.reducer';
import workersReducer from './workers.reducer';
import invoicesReducer from './invoices.reducer';
import visitsReducer from './visits.reducer';

export default combineReducers({
  auth: authReducer,
  clients: clientsReducer,
  jobs: jobsReducer,
  workers: workersReducer,
  properties: propertiesReducer,
  jobRequests: jobRequestReducer,
  visits: visitsReducer,
  quotes: quotesReducer,
  invoices: invoicesReducer,
  weekendsVisible,
  eventsById
});
