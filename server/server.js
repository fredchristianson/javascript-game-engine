/**
 * This is a simple HTTP server with some basic routing.
 * It requires nodeJS 12 or newer.
 * 
 * To run:
 *  >node server.js
 * 
 * There are 2 reasons for this implementation
 * 1. To keep beginners from being frustrated.  Once
 *    additional modules are included (e.g. express),
 *    things are more likely to break.  The only
 *    requirement is nodejs itslef.
 * 
 * 2. To show the basics of what is going on when modules
 *    like express are used.  It doesn't need to be complicated
 *    and is is one simple example.
 */

const http = require('http');

// Router does some very basic mapping of the request URL
// the the apprpriate handler.
const Router = require('./modules/request-router.js');

// handler to a logger API so clients can log messages
// over the network
const LogHandler = require('./handlers/logger.js');

// a handler to return static files
const FileHandler = require('./handlers/file.js');

// a handler to return lists of games by scanning
// the game folder, and to return game resources (html, json,etc)
const GameHandler = require('./handlers/game.js');

const PORT = 4263; // GAME on phone dial


const METHODS = Router.METHODS;
const router = Router.createRouter();
// map of url to correct handler functions
router.addHandler(METHODS.POST, "/api/v1/log", LogHandler.log);
router.addHandler(METHODS.GET, "/api/v1/games", GameHandler.getGames);
router.addHandler(METHODS.GET, "/game/:name/resource", GameHandler.getGameResource);
router.addHandler(METHODS.GET, "/game/:name/module", GameHandler.getGameModule);
router.addHandler(METHODS.GET, "/", FileHandler.getResource);


// create a server that that users the router to handle requests.
const server = http.createServer(async (req, res) => {
  try {
    router.handle(req, res);
  } catch (e) {
    res.statusCode = 500;
    res.end(`exception ${e}`);
  }
});

server.listen(PORT, () => {
  const addr = server.address();
  console.log('Server listening at', addr.address + ':' + addr.port);
});
