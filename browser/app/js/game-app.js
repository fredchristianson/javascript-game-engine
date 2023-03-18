/* 
    This singleton is the top-level module that controls everything.

*/
import { createLogger } from "../../modules/logging/logger.js";
const log = createLogger("GameApp");

class GameApplication {
  constructor() {
    log.debug('GameApplication running');
  }

  async run(name) {
    log.info(`GameAppRunning game ${name}`);
    const gameHtml = await fetch(`/games/${name}/game.html`);
    const world = document.getElementById('world');
    const html = await gameHtml.text();
    world.innerHTML = html;

    const gameModule = await import(`/games/${name}/js/game.js`);
    const game = gameModule.game;
    game.start(this, world);
  }
}

export const theGameApp = new GameApplication();

export default theGameApp;
