export const endpoints = {
  auth: {
    signup: "/signup",
    signin: "/signin",
    verifyEmail: "/verify-email/:token",
    resetPassword: "/reset-password",
    changePassword: "/change-password/:pwdToken",
  },
  booking: {
    add: "/booking",
  },
  admin: {
    home: "/dashboard",
    client: {
      list: "clients",
      add: "add",
      detail: ":id",
      edit: ":id/edit",
    },
    worker: {
      list: "workers",
      add: "add",
    },
    referral: {
      program: "referral-program",
    },
    schedules: {
      calendar: "schedules",
    },
    requests: {
      add: "add",
      list: "requests",
    },
    quotes: {
      add: "add",
      detail: ":id",
      list: "quotes",
      edit: ":id/edit",
    },
    jobs: {
      add: "add",
      list: "jobs",
      detail: ":id",
      edit: ":id/edit",
    },
    invoices: {
      add: "add",
      list: "invoices",
      detail: ":id",
      edit: ":id/edit",
    },
  },
};
