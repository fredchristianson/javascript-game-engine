import { BuildClickHandler } from '../../modules/event.js';
import { createLogger } from '../../modules/logging.js';

const log = createLogger('inputHandler');
class ActionInputHandler {
    constructor() {
        this._actions = null;
        this._dom = null;
        this._clickActions = null;
    }

    reset() {
        this._actions = [];
        this._clickActions = [];
        this._dom?.removeListeners();
        this._dom = null;
    }

    listen(gameManager) {
        const renderer = gameManager.GameRenderer;
        this._dom = renderer.RootDOM;
        BuildClickHandler().listenTo(this._dom)
            .onClick(this, this.handleClick)
            .build();
    }

    handleClick(target, currentTarget, type, event) {
        log.debug('click');
        const targetEntity = this._getTargetEntity(target);
        if (targetEntity) {
            for (const action of this._clickActions) {
                action.entityClicked(targetEntity);
            }
        }
    }

    addClickAction(action) {
        this._clickActions.push(action);
    }

    _getTargetEntity(target) {
        let element = target?.HTMLElement;
        while (element != null && element._renderData == null) {
            element = element.parentNode;
        }
        return element?._renderData?.entity;
    }
}


const inputHandler = new ActionInputHandler();

export { inputHandler };