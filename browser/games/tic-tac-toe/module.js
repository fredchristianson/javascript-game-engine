class TicTacToe {
  constructor() {}

  start(theGameApp, worldElement) {
    const buttons = worldElement.querySelectorAll('button');
    for (let button of buttons) {
      button.addEventListener('click', (event) => {
        theGameApp.run('launcher');
      });
    }
  }
}

export const game = new TicTacToe();
