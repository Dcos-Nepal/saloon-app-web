import { combineReducers } from 'redux';
import authReducer from './auth.reducer';
import clientsReducer from './clients.reducer';
import quotesReducer from './quotes.reducer';
import lineItemsReducer from './lineItems.reducer';
import { completedVisible, weekendsVisible } from './events.reducer';
import scheduleReducer from './schedules.reducer';
import servicesReducer from './services.reducer';
import ordersReducer from './orders.reducer';

export default combineReducers({
  auth: authReducer,
  clients: clientsReducer,
  lineItems: lineItemsReducer,
  services: servicesReducer,
  quotes: quotesReducer,
  orders: ordersReducer,
  schedules: scheduleReducer,
  weekendsVisible,
  completedVisible
});
