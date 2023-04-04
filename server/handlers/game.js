const fs = require('fs');
const path = require('path');
const FileHandler = require('./file.js');

const GAME_DIRECTORY = __dirname + '/../../browser/games';

function isDirectory(path) {
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


async function findFirstFile(gamePath, names) {
    for (let name of names) {
        if (name != null && typeof name != 'undefined') {
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
}
exports.getGameModule = async function (req, res) {
    try {
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
    } catch (ex) {
        console.log(`getGameModule ${req.path} failed`, ex);
        res.statusCode = 500;
        res.end(`exception: ${ex.message}`);
    }
};

exports.getGameResource = async function (req, res) {
    try {
        const games = await getGames();
        console.log(`Get game resource: ${req.path}`);
        const game = games.find(g => { return g.name == req.params.name; });
        if (game == null) {
            res.statusCode = 404;
            res.end(`Game not found: ${req.params.name}`);
        }
        let moduleName = req.path;
        let fileOptions = [req.path];
        if (moduleName.toLowerCase() == '/html') {
            fileOptions = [game.mainHtml || game.mainHTML, `${game.type}.html`, `game.html`];
        } else if (moduleName.toLowerCase() == '/css') {
            fileOptions = [game.mainStyle || game.mainCSS || game.mainCss, `${game.type}.css`, `game.css`];
        }

        console.log(`\tresource: ${moduleName}`);
        const pathExists = await findFirstFile(game.path, fileOptions);
        console.log(`\tfound: ${pathExists}`);
        if (pathExists == null) {
            const response = JSON.stringify({ success: false, message: "resource not found" });
            res.setHeader('Content-Type', "text/json");

            res.end(response);
            return;
        }
        FileHandler.returnFile(req, res, pathExists);
    } catch (ex) {
        console.log(`getGameModule ${req.path} failed`, ex);
        res.statusCode = 500;
        res.end(`exception: ${ex.message}`);
    }
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
    res.setHeader('Content-Type', "text/json");

    res.end(JSON.stringify(response));
};
