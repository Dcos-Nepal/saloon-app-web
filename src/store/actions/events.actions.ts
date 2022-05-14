const EventActions = {
  toggleWeekends() {
    return {
      type: 'TOGGLE_WEEKENDS'
    }
  },
  toggleCompleted() {
    return {
      type: 'TOGGLE_COMPLETED'
    }
  }
}

export default EventActions;
