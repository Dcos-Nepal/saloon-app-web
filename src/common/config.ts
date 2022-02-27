export const endpoints = {
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
    worker: {
      add: 'add',
      detail: ':id',
      list: 'workers',
      edit: ':id/edit'
    },
    lineItems: {
      list: 'line-items'
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
    jobs: {
      add: 'add',
      list: 'jobs',
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
