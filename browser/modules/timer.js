/* do not use Logging.  will cause loop on load */

import { NUMBER, UTIL } from './helpers.js';

export async function sleepMSecs(msecs) {
    log.debug('Timer sleep msecs', msecs);
    await new Promise((r) => {
        setTimeout(r, msecs);
    });
    log.debug('Timer done', msecs);
}


export async function sleepSeconds(seconds) {
    await sleepMSecs(seconds * 1000);
}

class Timer {
    constructor(msecs = null, repeat = false) {
        this._msecs = msecs;
        this._function = null;
        this._timeoutId = null;
        this._repeat = repeat;
    }

    call(func) {
        this._function = func;
        this._start();
        return this;
    }

    cancel() {
        this._msecs = null;
    }

    _start() {
        if (this._timeoutId != null) {
            clearTimeout(this._timeoutId);
            this._timeoutId = null;
        }
        if (!UTIL.isNullish(this._function) && NUMBER.isNumber(this._msecs) && this._msecs > 0) {
            this._timeoutId = setTimeout(() => {
                this._call();
            }, this._msecs);
        }
    }

    async _call() {
        if (this._function) {
            await this._function();
            if (this._repeat) {
                this._start();
            }

        }
    }


}

function repeatMSecs(msecs) {
    return new Timer(msecs, true);
}

function repeatSeconds(secs) {
    return repeatMSecs(1000 * secs);
}

export const TIMER = {
    sleepMSecs,
    sleepSeconds,
    repeatMSecs,
    repeatSeconds,
}
