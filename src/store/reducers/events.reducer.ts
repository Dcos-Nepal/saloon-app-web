import { hashById } from "utils";

export function weekendsVisible(weekendsVisible = true, action: { type: any }) {
  switch (action.type) {

    case 'TOGGLE_WEEKENDS':
      return !weekendsVisible;

    default:
      return weekendsVisible;
  }
}        

export function eventsById(eventsById: any = {}, action: { type: any; plainEventObjects: any; plainEventObject: { id: any }; eventId: string | number }) {
  switch (action.type) {

    case 'RECEIVE_EVENTS':
      return hashById(action.plainEventObjects)

    case 'CREATE_EVENT':
    case 'UPDATE_EVENT':
      return {
        ...eventsById,
        [action.plainEventObject.id]: action.plainEventObject
      }

    case 'DELETE_EVENT':
      eventsById = {...eventsById} // copy
      delete eventsById[action.eventId];
      return eventsById;

    default:
      return eventsById;
  }
}
