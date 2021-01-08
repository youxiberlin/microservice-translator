module.exports = {
  apps : [{
      name: 'gateway',
      script: 'app.js',
      cwd: './gateway',
      watch: false,
      kill_timeout: 10000,
      max_memory_restart: '512M',
      instances: 1,
      autorestart: true,
      env: {
        PORT: '3000',
      }
     },
     {
        name: 'translator',
        script: 'app.js',
        cwd: './translator',
        watch: false,
        kill_timeout: 10000,
        max_memory_restart: '512M',
        instances: 1,
        autorestart: true,
        env: {
          PORT: '3001',
          AMQP_URL: process.env.AMQP_URL,
        } 
     },
     {
      name: 'mailer',
      script: 'app.js',
      cwd: './mailer',
      watch: false,
      kill_timeout: 10000,
      max_memory_restart: '512M',
      instances: 1,
      autorestart: true,
      env: {
        PORT: '3002',
        MAIL_HOST: process.env.MAIL_HOST,
        MAIL_PORT: process.env.MAIL_PORT,
        MAIL_USER: process.env.MAIL_USER,
        MAIL_PASS: process.env.MAIL_PASS
      }
     },
     {
        name: 'tms',
        script: 'app.js',
        cwd: './tms',
        watch: false,
        kill_timeout: 10000,
        max_memory_restart: '512M',
        instances: 1,
        autorestart: true,
        env: {
          AMQP_URL: process.env.AMQP_URL,
        }
    },
  ]
};
