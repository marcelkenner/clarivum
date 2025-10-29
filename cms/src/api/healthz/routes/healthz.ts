const healthzRoutes = {
  routes: [
    {
      method: "GET",
      path: "/healthz",
      handler: "api::healthz.healthz.status",
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};

export default healthzRoutes;
