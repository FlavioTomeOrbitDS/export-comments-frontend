const PROXY_CONFIG = [
  {
    context: ["/api/*"],
    target: "https://exportcomments.com",
    secure: false,
    logLevel: "debug",
  },
];
