
import { createLogger } from "./logging.js";
const log = createLogger("Timer");

export async function sleepMSecs(msecs) {
    log.debug("Timer sleep msecs", msecs);
    await new Promise(r => setTimeout(r, msecs));
    log.debug("Timer done", msecs);
}


export async function sleepSeconds(seconds) {
    await sleepMSecs(seconds * 1000);
}

export const TIMER = {
    sleepMSecs,
    sleepSeconds
}
