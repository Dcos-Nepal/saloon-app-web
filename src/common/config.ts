export const endpoints = {
  privacy: 'privacy-policy',
  profile: 'profile',
  setting: 'setting',
  auth: {
    signUp: '/signUp',
    signIn: '/signIn',
    verifyEmail: '/verify-email/:token',
    resetPassword: '/reset-password',
    changePassword: '/change-password/:pwdToken'
  },
  booking: {
    add: '/booking'
  },
  admin: {
    home: '/dashboard',
    client: {
      list: 'clients',
      add: 'add',
      detail: ':id',
      edit: ':id/edit'
    },
    packageClient: {
      list: 'package-clients',
      add: 'add',
      detail: ':id',
      edit: ':id/edit'
    },
    order: {
      list: 'orders',
      add: 'add',
      detail: ':id',
      edit: ':id/edit'
    },
    worker: {
      add: 'add',
      detail: ':id',
      list: 'workers',
      edit: ':id/edit'
    },
    lineItems: {
      list: 'line-items'
    },
    services: {
      list: 'services'
    },
    referral: {
      program: 'referral-program'
    },
    schedules: {
      calendar: 'schedules'
    },
    requests: {
      add: 'add',
      detail: ':id',
      list: 'requests',
      edit: ':id/edit'
    },
    quotes: {
      add: 'add',
      detail: ':id',
      list: 'quotes',
      edit: ':id/edit'
    },
    visits: {
      add: 'add',
      list: 'visits',
      detail: ':id',
      edit: ':id/edit'
    },
    invoices: {
      add: 'add',
      list: 'invoices',
      detail: ':id',
      edit: ':id/edit'
    }
  }
};
