import { ASSERT } from '/modules/assert.js';
import { LauncherGameImplementation } from '/core/game/launcher-game-implementation.js';
import { Game } from '/core/game/game.js';
import { createLogger } from '../../../modules/logging.js';

const log = createLogger('TestLauncher');

class TestLauncher extends LauncherGameImplementation {
  constructor() {
    super();
  }
}

export function createGame(theApplication) {
  ASSERT.notNull(
    theApplication,
    'createGame parameter theApplication cannot be null'
  );
  const implementation = new TestLauncher();
  const game = new Game(theApplication, implementation);
  return game;
}


