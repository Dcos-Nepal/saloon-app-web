export const getServices = () => {
  return [
    { label: 'Melasma Treatment', value: 'Melasma Treatment', isActive: true },
    { label: 'Acne Treatment', value: 'Acne Treatment', isActive: true },
    { label: 'Freckles', value: 'Freckles', isActive: true },
    { label: 'Microblading', value: 'Microblading', isActive: true },
    { label: 'Hair Transplant', value: 'Hair Transplant', isActive: true },
    { label: 'Wrinkles Treatment', value: 'Wrinkles Treatment', isActive: true },
    { label: 'Hair Transplant', value: 'Hair Transplant', isActive: true },
    { label: 'Hydrafacial', value: 'Hydrafacial', isActive: true }
  ];
};

export const getAppointmentTypes = () => {
  return [
    { label: 'CONSULATION', value: 'CONSULATION', isActive: true },
    { label: 'TREATMENT', value: 'TREATMENT', isActive: true },
    { label: 'FOLLOW UP', value: 'FOLLOW UP', isActive: true },
    { label: 'MAINTAINANCE', value: 'MAINTAINANCE', isActive: true }
  ];
};


export const getPaymentTypes = () => {
  return [
    { label: 'CASH', value: 'CASH', isActive: true },
    { label: 'CHEQUE', value: 'CHEQUE', isActive: true },
    { label: 'ONLINE', value: 'ONLINE', isActive: true }
  ];
};

export const getAppoinmentVeriation = () => {
  return [
    { label: 'REGULAR', value: 'REGULAR', isActive: true },
    { label: 'IN 15 DAYS', value: 'IN 15 DAYS', isActive: true },
    { label: 'MONTHLY', value: 'MONTHLY', isActive: true }
  ];
}

export const getPhotoTypes = () => {
  return [
    { label: 'Select Type', value: '', isActive: true },
    { label: 'Left', value: 'Left', isActive: true },
    { label: 'Right', value: 'Right', isActive: true },
    { label: 'Front', value: 'Front', isActive: true },
    { label: 'Back', value: 'Back', isActive: true },
    { label: 'Other', value: 'Other', isActive: true }
  ];
}

export const getClientTags = () => {
  return [
    { label: 'VIP', value: 'VIP', isActive: true },
    { label: 'REGULAR', value: 'REGULAR', isActive: true },
    { label: 'MONTHLY', value: 'MONTHLY', isActive: true },
    { label: '15 DAYS', value: '15 DAYS', isActive: true }
  ]
}

export const getBookingStatus = () => {
  return [
    { label: 'BOOKED', value: 'BOOKED', isActive: true },
    { label: 'RE_SCHEDULED', value: 'RE_SCHEDULED', isActive: true },
    { label: 'VISITED', value: 'VISITED', isActive: true },
    { label: 'NOT_VISITED', value: 'NOT_VISITED', isActive: true },
    { label: 'PNR', value: 'PNR', isActive: true },
    { label: 'CANCELLED', value: 'CANCELLED', isActive: true }
  ]
}