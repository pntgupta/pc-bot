const envConfig = require('./config/environment');

module.exports = {
  apps: [
    {
      name: envConfig.appName,
      script: 'app.js',
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '200M',
      output:
        envConfig.logger.level !== 'error' ? './logs/pm2/out.log' : '/dev/null',
      error: './logs/pm2/error.log',
      log: '/dev/null'
    }
  ]
};
