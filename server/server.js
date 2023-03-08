const http = require('http');
const fs = require('fs');
const path = require('path');
const ROOT = __dirname + '/../browser';
const GAME_DIRECTORY = __dirname + '/../browser/games';

const PORT = 4263; // GAME on phone dial

const extenstionToMimeTypeMap = {
  '.html': 'text/html',
  '.htm': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.jpeg': 'image/jpg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml'
};

const notImplemented = {
  success: false,
  message: 'this API is not implemented'
};

function getContentType(url) {
  let ext = path.extname(url);
  let mimeType = extenstionToMimeTypeMap[ext] || 'text/plain';
  console.log(`extension ${ext}`);
  return mimeType;
}

async function getGames() {
  const games = [];
  const dirs = fs.readdirSync(GAME_DIRECTORY);
  dirs.forEach((dir) => {
    const gameDescriptionFile = path.join(
      GAME_DIRECTORY,
      dir,
      'description.json'
    );
    try {
    fs.accessSync(gameDescriptionFile, fs.constants.R_OK);
        const description = fs.readFileSync(gameDescriptionFile, 'utf8');
        const json = JSON.parse(description);
        games.push(json);
    } catch (ex) {
      console.error(`failed to read game description ${gameDescriptionFile}`);
    }
  });

  return games;
}

async function handleApiV1(req, res) {
  let url = req.url;
  let response = notImplemented;
  let api = url.substring('/api/v1/'.length);
  console.log(`Handle API ${api}`);
  if (api == 'games') {
    const list = await getGames();

    response = {
      success: true,
      data: list
    };
  }

  // don't mix transport and API results
  // we return a "good" transport response:  status code 200.
  // the indication of API failure is in the json that is returned.
  res.statusCode = 200;
  res.end(JSON.stringify(response));
}

function returnFile(req, res) {
  let url = req.url;
  let filePath = path.join(ROOT, url);
  console.log(url);

  fs.access(filePath, fs.constants.R_OK, (err) => {
    if (err) {
      res.statusCode = 404;
      res.end(`File ${filePath} not found!`);
    } else {
      if (fs.statSync(filePath).isDirectory()) {
        filePath += '/index.html';
      }

      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.statusCode = 500;
          res.end(`Error getting the file: ${err}.`);
        } else {
          res.setHeader('Content-Type', getContentType(req.url));
          res.end(data);
        }
      });
    }
  });
}

const server = http.createServer((req, res) => {
  try {
    let url = req.url;
    if (url == '/') {
      res.writeHead(302, {
        Location: '/app/index.html'
      });
      res.end();
      return;
    }
    if (url.startsWith('/api/v1')) {
      handleApiV1(req, res);
    } else {
      returnFile(req, res);
    }
  } catch (e) {
    res.statusCode = 500;
    res.end(`exception ${e}`);
  }
});

server.listen(PORT, () => {
  const addr = server.address();
  console.log('Server listening at', addr.address + ':' + addr.port);
});
