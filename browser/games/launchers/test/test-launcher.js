import { createLogger, LogWriter } from '../../../modules/logging.js';

const log = createLogger('TestLauncher');

let theGame = null;
function handleButton(event) {
  const button = event.target;
  const gameName = button.dataset['name'];
  theGame.run(gameName);
}

class TestLauncher {
  constructor() { }

  start(game, worldElement) {
    theGame = game;
    const buttons = worldElement.querySelectorAll('button');
    for (const button of buttons) {
      button.addEventListener('click', handleButton);
    }
  }
}

class TestWriter extends LogWriter {
  constructor() {
    super();
  }

  _write
}

export const game = new TestLauncher();

export default game;

