import { combineReducers } from "redux";
import authReducer from "./auth.reducer";
import clientsReducer from "./clients.reducer";
import { eventsById, weekendsVisible } from "./events.reducer";
import jobRequestReducer from "./job-reqs.reducer";
import quotesReducer from "./quotes.reducer";
import workersReducer from "./workers.reducer";

export default combineReducers({
  auth: authReducer,
  clients: clientsReducer,
  workers: workersReducer,
  jobRequests: jobRequestReducer,
  quotes: quotesReducer,
  weekendsVisible,
  eventsById
});
