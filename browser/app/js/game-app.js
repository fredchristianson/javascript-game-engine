/* 
 *This singleton is the top-level module that controls everything.
 *
 */
import { createLogger } from '../../modules/logging/logger.js';
import { resourceManager } from '../../modules/net.js';
import { ENV } from '../../modules/env.js';
const log = createLogger('GameApp');

class GameApplication {
  constructor() {
    log.debug('GameApplication running');
  }

  async run(name) {
    log.info(`GameAppRunning game ${name}`);
    const gameHtml = await resourceManager.getGameResource(name, 'game.html'); //await fetch(`/games/${name}/game.html`);
    const world = document.getElementById('world');
    const html = await gameHtml;
    world.innerHTML = html;

    const gameModule = await resourceManager.getGameModule(name);//  await import(`/games/${name}/js/game.js`);
    await ENV.loadGameEnvironment(name);
    const game = gameModule.game;
    game.start(this, world);
  }
}

export const theGameApp = new GameApplication();

export default theGameApp;
