module.exports = {
  apps: [
    {
      name: "stronger",
      script: "npm",
      args: "start",
      cwd: "/var/www/stronger",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
