import env from './env.json'

export default () => {
    return env[
        process.env.NODE_ENV || 'development'
    ]
}