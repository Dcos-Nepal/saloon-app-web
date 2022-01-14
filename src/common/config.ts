export const endpoints = {
  auth: {
    signup: "/signup",
    signin: "/signin",
    verifyEmail: "/verify-email/:token",
    resetPassword: "/reset-password",
    changePassword: "/change-password/:pwdToken",
  },
  admin: {
    home: "/dashboard",
    client: {
      list: "clients",
      add: "add",
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
      list: "requests",
    },
    quotes: {
      list: "quotes",
    },
    jobs: {
      list: "jobs",
    }
  },
};
