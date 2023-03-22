const fs = require('fs');
const path = require('path');

const ROOT = __dirname + '/../../browser';

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


function getContentType(url) {
    let ext = path.extname(url);
    let mimeType = extenstionToMimeTypeMap[ext] || 'text/plain';
    return mimeType;
}

function returnFile(req, res, filePath) {
    if (filePath == null) {
        res.statusCode = 404;
        res.end("File not found: " + req.path);
        return;
    }

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
                    res.setHeader('Content-Type', getContentType(filePath));
                    res.end(data);
                }
            });
        }
    });
}

exports.returnFile = returnFile;

exports.getResource = function (req, res) {
    let reqPath = req.path;
    if (reqPath == null || reqPath == '' || reqPath == '/') {
        res.writeHead(302, {
            Location: '/app/index.html'
        });
        res.end();
        return;
    }
    let filePath = path.join(ROOT, reqPath);
    returnFile(req, res, filePath);
};

