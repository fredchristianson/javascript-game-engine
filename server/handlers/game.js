const fs = require('fs');
const path = require('path');
const FileHandler = require('./file.js');

const GAME_DIRECTORY = __dirname + '/../../browser/games';

async function isDirectory(path) {
    return fs.existsSync(path) && fs.lstatSync(path).isDirectory();
}

async function findGames(directory, games) {
    if (!isDirectory(directory)) {
        console.error(`findGames directory is not value: ${directory}`);
        return;
    }
    const dirs = fs
        .readdirSync(directory)
        .map((sub) => {
            return path.join(directory, sub);
        })
        .filter(isDirectory);
    for (let gameDirectory of dirs) {
        const gameDescriptionFile = path.join(gameDirectory, 'description.json');
        try {
            fs.accessSync(gameDescriptionFile, fs.constants.R_OK);
            // if the directory has a game description, there cannot be games in subdirectories
            const description = fs.readFileSync(gameDescriptionFile, 'utf8');
            const json = JSON.parse(description);
            json.path = gameDirectory;
            games.push(json);
        } catch (ex) {
            // if the directory doesn't have a game description, try subdirectories.
            await findGames(gameDirectory, games);
        }
    }
}

async function getGames() {
    const games = [];
    await findGames(GAME_DIRECTORY, games);

    return games;
}


exports.getGameResource = async function (req, res) {
    const games = await getGames();
    const game = games.find(g => { return g.name == req.params.name; });
    if (game == null) {
        res.statusCode = 404;
        res.end(`Game not found: ${req.params.name}`);
    }
    const resourcePath = path.join(game.path, req.path);
    FileHandler.returnFile(req, res, resourcePath);
};

async function findFirstFile(gamePath, names) {
    for (let name of names) {
        const filePath = path.join(gamePath, name);
        try {
            fs.accessSync(filePath, fs.constants.R_OK);
            console.log("Found: " + filePath);
            return filePath;
        } catch (ex) {
            console.log("Not found: " + filePath);
        }
    }
}
exports.getGameModule = async function (req, res) {
    const games = await getGames();
    console.log(`Get game module: ${req.params.name}`);
    const game = games.find(g => { return g.name == req.params.name; });
    if (game == null) {
        res.statusCode = 404;
        res.end(`Game not found: ${req.params.name}`);
    }
    let moduleName = "game.js";
    if (game.mainModule != null) {
        moduleName = game.mainModule;
    }
    console.log(`\tmodule: ${moduleName}`);
    const pathExists = await findFirstFile(game.path, [moduleName, `${game.type}.js`, `game.js`, `module.js`]);
    const resourcePath = pathExists;
    FileHandler.returnFile(req, res, resourcePath);
};


exports.getGames = async function (req, res) {
    let games = await getGames();
    if (typeof req.params.type == 'string') {
        games = games.filter(game => { return game.type == req.params.type; });
    }
    const response = {
        success: true,
        data: games
    };
    res.end(JSON.stringify(response));
};
