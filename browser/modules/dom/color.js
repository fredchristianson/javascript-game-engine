import { ENSURE } from '../assert.js';

class HSLColor {
    constructor(hue, saturation, level, alpha) {
        this._hue = ENSURE.inRange(hue, [0, 360], 0, 'hue must be 0-360');
        this._saturation = ENSURE.inRange(saturation, [0, 1.0], 1, 'saturation must be 0-1.0');
        this._level = ENSURE.inRange(level, [0, 1.0], 1, 'level must be 0-1.0');
        this._alpha = ENSURE.inRange(alpha, [0, 1.0], 1, 'alpha must be 0-1.0');
        this._html = null;
    }

    toHTML() {
        if (this._html == null) {
            this._html = `hsla(${this._hue}, ${this._saturation}, ${this._level}, ${this._alpha})`;
        }
        return this._html;
    }
}

export function HSL(hue, saturation, level, alpha = 1) {
    return new HSLColor(hue, saturation, level, alpha);
}