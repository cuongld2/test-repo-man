module.exports = {
        apps : [
            {
            name: 'authenSvc',
            script: 'authenSvc.js',
            instances: 1,
            autorestart: true,
            watch: true,
            max_memory_restart: '512M',
            env: {
                SERVICE_NAME: 'authenSvc',
                NODE_ENV: 'development',
                PORT: 3001
            }
            },
            {
            name: 'userSvc',
            script: 'userSvc.js',
            instances: 1,
            autorestart: true,
            watch: true,
            max_memory_restart: '512M',
            env: {
                SERVICE_NAME: 'userSvc',
                NODE_ENV: 'development',
                PORT: 3002
            }
            },
            {
            name: 'blogSvc',
            script: 'blogSvc.js',
            instances: 1,
            autorestart: true,
            watch: true,
            max_memory_restart: '512M',
            env: {
                SERVICE_NAME: 'blogSvc',
                NODE_ENV: 'development',
                PORT: 3003
            }
            },
            {
            name: 'authorSvc',
            script: 'authorSvc.js',
            instances: 1,
            autorestart: true,
            watch: true,
            max_memory_restart: '512M',
            env: {
                SERVICE_NAME: 'authorSvc',
                NODE_ENV: 'development',
                PORT: 3004
            }
            }
        ]
        };
