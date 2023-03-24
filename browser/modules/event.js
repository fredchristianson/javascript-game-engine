import { ClickHandlerBuilder, EventHandlerBuilder } from './event/event-builder.js';
import { InputHandlerBuilder } from './event/input-handler.js';

export function BuildEventHandler() {
    return new EventHandlerBuilder();
}

export function BuildClickHandler() {
    return new ClickHandlerBuilder();
}

export function BuildInputHandler() {
    return new InputHandlerBuilder();
}

export const EVENT = {
    BuildEventHandler,
    BuildClickHandler
};
