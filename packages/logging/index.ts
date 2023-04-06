import pino from 'pino';

export default pino({
    transport: {
        target: 'pino/file',
        options: {
            destination: 'logs.log',
            mkdir: true
        }
    }
});
