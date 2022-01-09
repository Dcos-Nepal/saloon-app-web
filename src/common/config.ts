export const endpoints = {
  auth: {
    signup: "/signup",
    signin: "/signin",
    resetPassword: "/reset-password",
    changePassword: "/change-password",
  },
  admin: {
    home: "/",
    client: {
      list: "/clients",
      add: "/clients/add",
    },
    referral: {
      program: "/referral-program",
    },
    schedules: {
      calendar: "/schedules",
    },
    requests: {
      list: "/requests",
    },
    quotes: {
      list: "/quotes",
    },
  },
};
