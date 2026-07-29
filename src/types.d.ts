import '@7h3laughingman/foundry-types/client/client.d.mts'

import { SIRENDARK}  from '@/config';

declare global {
    var sirendark: {
        config: typeof SIRENDARK,
        debug: LoggerFn,
        error: LoggerFn,
        log: LoggerFn,
        warn: LoggerFn,
    }
}
