export const getServices = () => {
  return [
    { label: 'Melasma Treatment', value: 'Melasma Treatment', isActive: true },
    { label: 'Acne Treatment', value: 'Acne Treatment', isActive: true },
    { label: 'Freckles', value: 'Freckles', isActive: true },
    { label: 'Microblading', value: 'Microblading', isActive: true },
    { label: 'Hair Transplant', value: 'Hair Transplant', isActive: true }
  ];
};

export const getAppointmentTypes = () => {
  return [
    { label: 'CONSULTATION', value: 'CONSULTATION', isActive: true },
    { label: 'TREATMENT', value: 'TREATMENT', isActive: true },
    { label: 'FOLLOW UP', value: 'FOLLOW UP', isActive: true },
    { label: 'MAINTAINANCE', value: 'MAINTAINANCE', isActive: true }
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
    {label: 'Select Type', value: '', isActive: true},
    {label: 'Left', value: 'Left', isActive: true},
    {label: 'Right', value: 'Right', isActive: true},
    {label: 'Front', value: 'Front', isActive: true},
    {label: 'Back', value: 'Back', isActive: true},
    {label: 'Other', value: 'Other', isActive: true}
  ];
}
