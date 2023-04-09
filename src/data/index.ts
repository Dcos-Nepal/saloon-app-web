import { getData } from "utils/storage";

export const DCosmoSkin = '64291e3f63f813458cbad76e';
export const DCosmoHair = '6429202863f813458cbad76f';

export const getServices = () => {
  const currentShopId = getData('shopId') || null
  return [
    { shopId: DCosmoSkin, label: 'Melasma Treatment', value: 'Melasma Treatment', isActive: true },
    { shopId: DCosmoSkin, label: 'Acne Treatment', value: 'Acne Treatment', isActive: true },
    { shopId: DCosmoSkin, label: 'Freckles', value: 'Freckles', isActive: true },
    { shopId: DCosmoSkin, label: 'Microblading', value: 'Microblading', isActive: true },
    { shopId: DCosmoSkin, label: 'Hair Transplant', value: 'Hair Transplant', isActive: true },
    { shopId: DCosmoSkin, label: 'Wrinkles Treatment', value: 'Wrinkles Treatment', isActive: true },
    { shopId: DCosmoSkin, label: 'Hydrafacial', value: 'Hydrafacial', isActive: true },
    { shopId: DCosmoSkin, label: 'Depigmentation', value: 'Depigmentation', isActive: true },

    { shopId: DCosmoHair, label: 'PRP', value: 'PRP', isActive: true },
    { shopId: DCosmoHair, label: 'GFC', value: 'GFC', isActive: true },
    { shopId: DCosmoHair, label: 'Hair Transplant', value: 'Hair Transplant', isActive: true },
    { shopId: DCosmoHair, label: 'Botox', value: 'Botox', isActive: true },
    { shopId: DCosmoHair, label: 'Filler', value: 'Filler', isActive: true },
    { shopId: DCosmoHair, label: 'Laser Hair Removal', value: 'Laser Hair Removal', isActive: true },
    { shopId: DCosmoHair, label: 'Whitening Treatment', value: 'Whitening Treatment', isActive: true },
    { shopId: DCosmoHair, label: 'Minor OT', value: 'Minor OT', isActive: true },
    { shopId: DCosmoHair, label: 'Thread Lifting', value: 'Thread Lifting', isActive: true },
    { shopId: DCosmoHair, label: 'Low-Level Laser (Light) Therapy', value: 'Low-Level Laser (Light) Therapy', isActive: true }
  ].filter((s) => s.shopId === currentShopId);
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

export const getShopsOptions = () => {
  return [
    { label: 'Skin', value: DCosmoSkin, isActive: true },
    { label: 'Hair', value: DCosmoHair, isActive: true },
  ];
};