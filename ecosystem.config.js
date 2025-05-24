module.exports = {
    apps: [
        {
            name: 'unions-front',
            port: 5000,
            exec_mode: 'cluster',
            instances: '1',
            cwd: './frontend',
            script: '.output/server/index.mjs',
            args: 'preview',
        },
        {
            name: 'unions-back',
            cwd: './backend',
            script: 'npm',
            args: 'start',
        },
    ],
}