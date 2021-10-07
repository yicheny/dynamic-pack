const fs = require('fs');
const path = require('path');

function readFile(path) {
    return fs.readFileSync(path, 'utf-8');
}

function getAbsoluteFilePath(filePath) {
    return path.join(process.cwd(), filePath);
}

module.exports = {
    readFile,
    getAbsoluteFilePath,
}
