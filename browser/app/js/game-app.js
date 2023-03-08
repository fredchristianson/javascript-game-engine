/* 
    This singleton is the top-level module that controls everything.

*/

class GameApplication {
  constructor() {
    console.log('GameApplication running');
  }

  async run(name) {
    console.log(`GameAppRunning game ${name}`);
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
