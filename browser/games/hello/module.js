import { createLogger } from '../../modules/logging.js';

const log = createLogger('HelloWorld');
class HelloWorld {
  constructor() { }

  get Title() {
    return 'Hello World';
  }


  async setup(theGame, world) {
    log.debug('Setup Hello World');
    this._theGame = theGame;
    this._world = world;

    this._canvasLayerId = theGame.createId('canvas layer');
    this._styleModelId = theGame.createId('style model');
    this._textModelId = theGame.createId('text model');
  }

  async defineModels(modelBuilder) {
    modelBuilder.defineStyleModel()
      .id(this._styleModelId)
      .backgroundColor('#000000');
    modelBuilder.defineTextModel()
      .id(this._textModelId)
      .text('Hello World');
  }

  async defineLayers(layerBuilder) {
    layerBuilder.defineBackgroundLayer()
      .modelId(this._styleModelId);
    layerBuilder.defineCanvasLayer(this)
      .id(this._canvasLayerId);

  }

  async definePieces(pieceBuilder) {
    pieceBuilder.definePiece()
      .modelId(this._textModelId)
      .parentId(this._canvasLayerId)
      .kind(this._gamePieceKindId)
      .data(game);
  }
}

export const game = new HelloWorld();
