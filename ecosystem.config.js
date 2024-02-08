module.exports = {
    apps : [{
      name: "app-server",
      script: "./bin/www",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      }
    }]
  }