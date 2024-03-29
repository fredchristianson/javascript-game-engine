import { LOGLEVELS, LogWriter, HTMLFormatter, createLogger } from '/modules/logging.js';
const log = createLogger('TestLogging', LOGLEVELS.DEBUG);

class TestLogWriter extends LogWriter {
  constructor(htmlContainer) {
    super(LOGLEVELS.DEBUG, new HTMLFormatter());
    this._container = htmlContainer;
  }
  _write(_logMessage, formattedMessage) {
    this._container.append(formattedMessage);
  }
}

function changeLevel(event) {
  const levelName = event.target.value;
  const level = LOGLEVELS.get(levelName);
  if (level != null) {
    log.setLevel(level);
  }
}
function reverseMessage(message) {
  // reverse the message
  return `---reverse='${message.split('').reverse()
    .join('')}'---`;
}

class TestLogging {
  constructor() { }

  start(theGame, worldElement) {
    this._theGame = theGame;
    this._worldElement = worldElement;

    this._writeButton = worldElement.querySelector('.test-log');
    this._endButton = worldElement.querySelector('button.test-end');
    this._message = worldElement.querySelector('.test-message');
    this._levelButton = worldElement.querySelector('.test-level-select');
    this._writeButton.addEventListener('click', this.writeMessages.bind(this));
    this._levelButton.addEventListener('input', changeLevel);
    this._endButton.addEventListener('click', () => {
      this._theGame.run('test-launcher');
    });
    this._htmlWriter = new TestLogWriter(worldElement.querySelector('.test-messages'));
  }

  writeMessages() {
    const message = this._message.value;
    // reverseMessage will only be called if DEBUG level
    log.debug(message, () => {
      return reverseMessage(message);
    });
    log.info(message);
    log.warn(message);
    log.error(message);
    log.always(message);
    log.never(message);
  }
}

export const game = new TestLogging();

export default game;
