import { Enum } from '../../modules/helpers.js';

class LayerType extends Enum {
    constructor(name) {
        super(name);
    }
}

const LAYER_TYPE = {
    UNKNOWN: new LayerType('unknown'),
    BACKGROUND: new LayerType('background'),
    INPUT: new LayerType('input'),  // handles mouse & touch
    FOREGROUND: new LayerType('foreground'), // topmost 
    HTML: new LayerType('html'), // only html rendering
    CANVAS: new LayerType('canvas') // 2d and webGL rendering
};

export { LAYER_TYPE, LayerType };