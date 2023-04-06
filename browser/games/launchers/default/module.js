import { API } from '../../../modules/net.js';
import { HSL } from '../../../modules/color.js';
import { RENDERER_TYPE, ACTION_TYPE } from '../../../core/game.js';
import { HTML } from '../../../modules/dom.js';

class Launcher {
  constructor() {
    this._theGame = null;
    this._worldDOM = null;
    this._boardLayer = null;
    this._board = null;
    this._backgroundHue = 0;
  }


  async setup(theGame, world) {
    this._theGame = theGame;
    this._world = world;
  }

  async defineRenderers(rendererBuilder) {

    this._pieceRenderer = rendererBuilder.defineRenderer()
      .rendererType(RENDERER_TYPE.HTML_TEMPLATE)
      .templateSelector('#game-select-template')
      .buildOne();
  }

  async defineLayers(layerBuilder) {
    layerBuilder.defineBackgroundLayer()
      .templateSelector('#background-layer')
      .renderer(this, this.renderBackground);
    this._boardLayer = layerBuilder.defineHtmlLayer(this)
      .templateSelector('#action-layer')
      .buildOne();

  }

  async defineAreas(areaBuilder) {
    // need the board instance so call build()
    this._board = areaBuilder.defineBoard()
      .parent(this._boardLayer)
      .attach('.game.list')
      .buildOne();
  }

  async definePieces(pieceBuilder) {
    const games = await API.getGames();

    for (const game of games.filter((g) => g.type == 'game')) {
      pieceBuilder.definePiece()
        .parent(this._board)
        .templateSelector('#game-select-template')
        .kind('game')
        .data({
          '.title': game.name,
          '.description': game.description,
          'li': HTML.dataValue('name', game.name)
        })
        .renderer(this._pieceRenderer);
    }
  }

  async defineActions(actionBuilder) {
    actionBuilder.defineAction()
      .actionType(ACTION_TYPE.TIMER)
      .periodMilliseconds(50)
      .handler(this, this.changeBackgroundColor);
    actionBuilder.defineAction()
      .actionType(ACTION_TYPE.CLICK)
      .forKind('game')
      .handler(this, this.launchGame);

  }

  launchGame(piece) {
    const gameName = piece.Data.Name;
    this._theGame.run(gameName);
  }

  changeBackgroundColor() {
    this._backgroundHue = (this._backgroundHue + 1) % 360;
  }

  renderBackground(layer, htmlElement) {
    htmlElement.setStyle('background-color', HSL(this._backgroundHue, 100, 50).toHTML());
  }
}

export const game = new Launcher();

export default game;
