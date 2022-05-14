export function weekendsVisible(weekendsVisible = true, action: { type: any }) {
  switch (action.type) {

    case 'TOGGLE_WEEKENDS':
      return !weekendsVisible;

    default:
      return weekendsVisible;
  }
}

export function completedVisible(completedVisible = true, action: { type: any }) {
  switch (action.type) {

    case 'TOGGLE_COMPLETED':
      return !completedVisible;

    default:
      return completedVisible;
  }
}   
