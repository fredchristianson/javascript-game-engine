/* 
 *This singleton is the top-level module that controls everything.
 *
 */
import { GameManager } from '../../core/game.js';
import { createLogger, configureLogOutput } from '../../modules/logging.js';
import { documentDOM } from '/modules/dom.js';

const log = createLogger('GameApp');

/**
 * helper function to get shadowDOM by selector
 *
 * @param {String} selector CSS selector of element to use as shadow host
 * @returns {DOMBase} a DOM or null if selector not found
 */
function shadowDOM(selector) {
  const dom = documentDOM.shadowDOM(selector);
  if (dom == null) {
    log.warn('Cannot find selector ', selector);
  }
  return dom;
}

class GameMain {
  constructor() {
    configureLogOutput();
    log.debug('GameApplication running');
    this._gameManager = null;
  }

  async run(name) {
    log.info(`GameApp running game ${name}`);
    this._gameManager = new GameManager();
    this._gameManager.setWorld(shadowDOM('#world'));
    this._gameManager.setCoreControls(shadowDOM('#app .controls .engine'));
    this._gameManager.setGameControls(shadowDOM('#app .controls .game'));
    this._gameManager.setCoreStatus(shadowDOM('#app .status .engine'));
    this._gameManager.setGameStatus(shadowDOM('#app .status .game'));
    this._gameManager.run(name);

  }
}

export { GameMain };
