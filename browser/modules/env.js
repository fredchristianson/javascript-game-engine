// ENV is a singleton that provides environment properties wherever it they are needed.
//
// Properties can come from multiple sources.
// if multiple sources have the same property, they are prioritized in this order
//  1) Set with Environment.set()
//  1) Url parameters: This url http://localhost:4263?env=dev&performance=hi
//                      sets properties for "env", and "performance"
//  2) /games/game/CURRENT-GAME/env.json
//  3) /env-local.json:  load env.json if it exists.
//                  this file should not be in git.  create if you need.
//  4) /env.json:  load the env.json file if it exists
//                  this file is the same for everyone.
//
// in the future we will add the ability to listen to change events.
// for example, logging levels may change when a new game is loaded

class Environment {
  constructor() {}

  get(name, defaultValue) {
    // return the property with the given name or default if not set;
  }

  set(name, value) {
    // set the property name
  }
}

export const ENV = new Environment();
