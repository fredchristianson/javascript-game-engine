/* 
 *This singleton is the top-level module that selects
 *and runs tests.
 *
 */
import { API } from '../../modules/network/api.js';
import { resourceManager } from '/modules/net.js';
import { createLogger } from '../../modules/logging.js';
import { createTestRunner } from '../../modules/test/test-runner.js';
import { HTML } from '../../modules/DOM.js';
import { BuildClickHandler } from '../../modules/event.js';

const log = createLogger('GameTest');

class TestLauncher {
  constructor() {
    this._selectDOM = null;
    this._runDOM = null;
    this._controlDOM = null;
    this._summaryDOM = null;
    this._statusDOM = null;
  }

  async start(application, world) {
    this._application = application;
    this._world = world;
    this._selectDOM = this._world.childDOM('#test-select');
    this._runDOM = this._world.childDOM('#test-run');
    this._runDOM.hide();
    this._selectDOM.show();
    this._controlDOM = this._runDOM.childDOM('.controls');
    this._testStartedTemplate = this._world.childDOM('#test-started-template');
    this._testCompletedTemplate = this._world.childDOM('#test-completed-template');

    BuildClickHandler()
      .listenTo(this._controlDOM)
      .selector('.close')
      .onClick(this, this._onCloseTest)
      .build();

    BuildClickHandler()
      .listenTo(this._selectDOM)
      .selector('ul button')
      .handle((_event) => {
        log.debug('handle');
      })
      .onClick(this, this._handleSelect)
      .build();

    this._summaryDOM = this._runDOM.childDOM('.summary');
    this._statusDOM = this._runDOM.childDOM('.status');
    this.select();
  }

  async cleanup() {
    this._controlDOM.clearListeners();
    this._selectDOM.clearListeners();
  }


  async select() {
    this._runDOM.hide();
    this._selectDOM.show();
    const tests = await API.get('games', { type: 'test' });
    const buttons = tests.data.map((test) => {
      const item = document.createElement('li');
      const button = document.createElement('button');
      button.innerText = test.title;
      button.dataset.name = test.name;
      item.appendChild(button);


      return item;
    });
    const list = this._selectDOM.first('ul');
    list.replaceChildren(...buttons);


  }

  async _handleSelect(button) {
    const name = button.dataset?.name;
    if (name != null) {
      log.debug('select ', name);
      const module = await resourceManager.getGameModule(name, 'test.js');
      if (module != null) {
        this._run(module);
      }
    }
  }

  async _run(module) {
    this._statusDOM.DOMElement.removeAllChildren();
    this._selectDOM.hide();
    this._runDOM.show();
    this._testRunner = createTestRunner(module);

    for await (const testStatus of this._testRunner.run()) {
      this._updateSummary(this._testRunner, testStatus.test);
      if (testStatus.isRunning) {
        this._addRunStatus(testStatus.test);
      } else {
        this._addCompleteStatus(testStatus.test);
      }
    }
    this._updateSummary(this._testRunner, null);
    this._addAllTestsComplete(this._testRunner);
    this._testRunner = null;
    log.debug('test finished');
  }

  _updateSummary(testRunner, currentTest) {
    const values = {
      '.suite-name': testRunner.Name,
      '.success-count': testRunner.SuccessCount,
      '.fail-count': testRunner.FailureCount,
      '.running-test': [currentTest?.Name, new HTML.styleValue('display', 'none')]
    }
    this._summaryDOM.setValues(values);
  }
  _addRunStatus(test) {
    const clone = this._testStartedTemplate.clone();
    const values = {
      '.time': new Date().toLocaleTimeString(),
      '.name': test.Name
    }
    clone.setValues(values);
    this._statusDOM.append(clone);
  }

  _addCompleteStatus(test) {
    const clone = this._testCompletedTemplate.clone();
    const values = {
      '.test-ended': HTML.classValue(test.IsSuccess ? 'success' : 'fail'),
      '.time': new Date().toLocaleTimeString(),
      '.result': test.IsSuccess ? 'success' : 'fail',
      '.name': test.Name,
      'ul': [HTML.styleValue('display', test.IsSuccess ? 'none' : 'block'),
      HTML.repeatValue('li', test.Errors)]
    }
    clone.setValues(values);

    this._statusDOM.append(clone);
  }

  _addAllTestsComplete(runner) {
    const clone = this._testCompletedTemplate.clone();
    const values = {
      '.test-ended': HTML.classValue(runner.FailureCount == 0 ? 'success' : 'fail'),
      '.time': new Date().toLocaleTimeString(),
      '.result': runner.FailureCount == 0 ? 'success' : 'fail',
      '.name': `${runner.Name}  --- All Tests Complete ---`,
      'ul': [HTML.styleValue('display', 'none')]
    }
    clone.setValues(values);

    this._statusDOM.append(clone);
  }

  _onCloseTest() {
    if (this._testRunner != null) {
      this._testRunner.cancel();
      this._testRunner = null;
    }
    this._selectDOM.show();
    this._runDOM.hide();
  }
}

export const launcher = new TestLauncher();
