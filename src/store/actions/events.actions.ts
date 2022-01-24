import {
  requestEventCreate, requestEventDelete,
  requestEventsInRange, requestEventUpdate
} from "utils/fake-event-requests"

const EventActions = {
  toggleWeekends() {
    return {
      type: 'TOGGLE_WEEKENDS'
    }
  },

  requestEvents(startStr: string, endStr: string) {
    return async (dispatch: any) => {
      const plainEventObjects = await requestEventsInRange(startStr, endStr)
      dispatch({
        type: 'RECEIVE_EVENTS',
        plainEventObjects
      })
    }
  },

  createEvent(plainEventObject: any) {
    return async (dispatch: any) => {
      const newEventId = await requestEventCreate(plainEventObject)
      dispatch({
        type: 'CREATE_EVENT',
        plainEventObject: {
          id: newEventId,
          ...plainEventObject
        }
      })
    }
  },

  updateEvent(plainEventObject: any) {
    return async (dispatch: any) => {
      await requestEventUpdate(plainEventObject)
      dispatch({
        type: 'UPDATE_EVENT',
        plainEventObject
      })
    }
  },

  deleteEvent(eventId: string) {
    return async (dispatch: (arg0: { type: string; eventId: any }) => void) => {
      await requestEventDelete(eventId)
      dispatch({
        type: 'DELETE_EVENT',
        eventId
      })
    }
  }
}

export default EventActions;
