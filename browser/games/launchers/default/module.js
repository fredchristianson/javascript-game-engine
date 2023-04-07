import { API } from '../../../modules/net.js';
import { HSL } from '../../../modules/color.js';
import { HTML } from '../../../modules/dom.js';
import { createLogger } from '../../../modules/logging.js';
const log = createLogger('Launcher');


class Launcher {
  constructor() {
    this._theGame = null;
    this._worldDOM = null;
    this._backgroundHue = 0;
    this._gamePieceKindId = null;
    this._pieceModelId = null;
    this._boardId = null;
    this._boardLayerId = null;
    this._backgroundLayerId = null;
  }


  async setup(theGame, world) {
    log.debug('Setup default game launcher');
    this._theGame = theGame;
    this._world = world;

    this._gamePieceKindId = theGame.createId('gamePiece');
    this._pieceModelId = theGame.createId('Piece Model');
    this._boardId = theGame.createId('board');
    this._boardLayerId = theGame.createId('board layer');
    this._backgroundLayerId = theGame.createId('background layer');
  }


  async defineLayers(layerBuilder) {
    layerBuilder.defineBackgroundLayer()
      .id(this._backgroundLayerId)
      .templateSelector('#background-layer')
      .beforeRender(this, this.beforeRender);
    layerBuilder.defineHtmlLayer(this)
      .id(this._boardLayerId)
      .templateSelector('#action-layer');

  }

  async defineModels(modelBuilder) {
    modelBuilder.defineHtmlModel()
      .id(this._pieceModelId)
      .templateSelector('#game-select-template')
      .templateValues((pieceData) => {
        return {
          '.title': pieceData.name,
          '.description': pieceData.description,
          'li': HTML.dataValue('name', pieceData.name)
        };
      });
  }

  async defineAreas(areaBuilder) {
    // need the board instance so call build()
    areaBuilder.defineBoard()
      .id(this._boardId)
      .parentId(this._boardLayerId)
      .attachSelector('.game.list');
  }

  async definePieces(pieceBuilder) {
    const games = await API.getGames();

    for (const game of games.filter((g) => g.type == 'game')) {
      pieceBuilder.definePiece()
        .modelId(this._pieceModelId)
        .modelId(8)
        .parentId(this._boardId)
        .templateSelector('#game-select-template')
        .kind(this._gamePieceKindId)
        .data(game);
    }
  }

  async defineActions(actionBuilder) {
    actionBuilder.defineTimer()
      .periodMilliseconds(50)
      .handler(this, this.changeBackgroundColor);
    actionBuilder.defineClick()
      .forKind(this._gamePieceKindId)
      .handler(this, this.launchGame);

  }

  launchGame(piece) {
    const gameName = piece.Data.name;
    this._theGame.run(gameName);
  }

  changeBackgroundColor() {
    this._backgroundHue = (this._backgroundHue + 1) % 360;
  }

  beforeRender(layer) {
    layer.DOM.setStyle('background-color', HSL(this._backgroundHue, 100, 50).toHTML());
  }

}

export const game = new Launcher();

export default game;
