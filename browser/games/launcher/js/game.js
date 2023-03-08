class Launcher {
  constructor() {}

  start(theGame, worldElement) {
    const buttons = worldElement.querySelectorAll('button');
    for (let button of buttons) {
      button.addEventListener('click', (event) => {
        const button = event.target;
        const gameName = button.dataset['name'];
        theGame.run(gameName);
      });
    }
  }
}

export const game = new Launcher();

export default game;
