export const getServices = () => {
  return [
    { label: 'Melasma Treatment', value: 'Melasma Treatment', isActive: true },
    { label: 'Acne Treatment', value: 'Acne Treatment', isActive: true },
    { label: 'Freckles', value: 'Freckles', isActive: true },
    { label: 'Microblading', value: 'Microblading', isActive: true },
    { label: 'Hair Transplant', value: 'Hair Transplant', isActive: true }
  ]
};

export const getAppointmentTypes = () => {
  return [
    { label: 'CONSULTATION', value: 'CONSULTATION', isActive: true },
    { label: 'TREATMENT', value: 'TREATMENT', isActive: true },
    { label: 'FOLLOW UP', value: 'FOLLOW UP', isActive: true },
    { label: 'MAINTAINANCE', value: 'MAINTAINANCE', isActive: true }
  ]
};
