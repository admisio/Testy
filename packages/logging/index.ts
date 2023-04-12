import { createRequire } from 'module';

const require = createRequire(import.meta.url ?? __filename);

const pino = require('pino');

export default pino({
    transport: {
        target: 'pino/file',
        options: {
            destination: 'logs.log',
            mkdir: true
        }
    }
});
