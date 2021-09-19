const fs = require('fs');
const path = require('path');

function readFile(path) {
    return fs.readFileSync(path, 'utf-8');
}

function getAbsoluteFilePath(filePath) {
    const rootPath = getWinPath(process.cwd());
    return getWinPath(path.join(rootPath, filePath));
}

//TODO 这么做对linux系统是否不够友好？会不会造成问题
function getWinPath(result) {
    return result.replace(/\\/g, '/');
}

module.exports = {
    readFile,
    getAbsoluteFilePath,
    getWinPath
}
