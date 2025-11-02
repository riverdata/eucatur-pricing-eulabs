const Routes = {
  base: "/",
  signIn: "/sign-in",
  dashboard: {
    list: "/dashboard"
  },
  precificacao: {
    list: "/precificacao/list",
    edit: "/precificacao/:id/edit",
    duplicate: "/precificacao/:id/duplicate",
    create: "/precificacao"
  },
  simulator: {
    list: "/simulator"
  },
  adminpainel: {
    list: "/adminpainel"
  },
  user: {
    list: "/user/list",
    edit: "/user/:id/edit",
    create: "/user/create",
    active: "/user/account-active",
    forgotPassword: "/user/forgot-password",
  },
  department: {
    list: "/department/list",
    edit: "/department/:id/edit",
    create: "/department/create",
  }
};

export default Routes;
