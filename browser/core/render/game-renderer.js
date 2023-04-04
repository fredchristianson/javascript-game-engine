const RENDER_HTML = `
<div class='game-render-root>
    <div id='game-render-style'></div>
    <div id='game-render-layers'></div>
</div>
`;

class GameRenderer {
    constructor(gameManager) {
        this._gameManager = gameManager;
        this._layers = [];
        this._worldDOM = null;
        this._templateDOM = null;
        this._styleDOM = null;
    }

    setupLayers(worldDOM, layers, templateDOM, styleDOM) {
        this._worldDOM = worldDOM;
        this._layers = layers;
        this._templateDOM = templateDOM;
        this._styleDOM = styleDOM;
        this._createDOM();
    }

    _createDOM() {
        this._worldDOM.removeAllChildren();
        this._htmlRenderer = this._worldDOM.parseString(RENDER_HTML);
        this._worldDOM.append(this._htmlRenderer);
        this._gameRenderStyle = this._worldDOM.first('#game-render-style');
        this._gameRenderLayers = this._worldDOM.first('#game-render-layers');
        if (this._styleDOM != null) {
            this._gameRenderStyle.append(this._styleDOM);
        }
        this._gameRenderLayers.setStyle('background-color', '#ff0000');
    }
}

export { GameRenderer };