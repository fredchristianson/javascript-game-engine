import { ClickHandlerBuilder, EventHandlerBuilder } from "./event/event-builder.js";

export function BuildEventHandler() {
    return new EventHandlerBuilder();
}

export function BuildClickHandler() {
    return new ClickHandlerBuilder();
}

export const EVENT = {
    BuildEventHandler,
    BuildClickHandler
};
