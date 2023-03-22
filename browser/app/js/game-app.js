/* 
 *This singleton is the top-level module that controls everything.
 *
 */
import { createLogger, configureLogOutput } from '../../modules/logging.js';
import { resourceManager } from '../../modules/net.js';
import { ENV } from '../../modules/env.js';
import { documentDOM } from '/modules/dom.js';
import { STRING } from '../../modules/helpers.js';

const log = createLogger('GameApp');

class GameApplication {
  constructor() {
    configureLogOutput();
    log.debug('GameApplication running');
  }

  async run(name) {
    log.info(`GameAppRunning game ${name}`);
    this._worldDOM = documentDOM.shadowDOM('#world');
    const gameHtml = await resourceManager.getGameResource(name, 'html'); //await fetch(`/games/${name}/game.html`);
    const gameStyle = await resourceManager.getGameResource(name, 'css'); //await fetch(`/games/${name}/game.html`);
    if (STRING.isString(gameHtml)) {
      this._worldDOM.append(gameHtml);
    } else {
      log.warn(`game ${name} does not have html`);
    }
    if (STRING.isString(gameStyle)) {
      this._worldDOM.addStyle(gameStyle);
    } else {
      log.warn(`game ${name} does not have style`);
    }

    const gameModule = await resourceManager.getGameModule(name);//  await import(`/games/${name}/js/game.js`);
    await ENV.loadGameEnvironment(name);
    const game = gameModule.game ?? gameModule.test ?? gameModule.launcher ?? gameModule.default;
    game.start(this, this._worldDOM);
  }
}

export const theGameApp = new GameApplication();

export default theGameApp;
