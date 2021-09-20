const colors = require('colors/safe');
const dpError = require('./DPError');

function createLog(dpError) {
    return {
        info(...text) {
            dpError.value.push(text);
            console.log(...text)
        },
        primary(coreInfo, ...normalInfo) {
            dpError.value.push(coreInfo, ...normalInfo);
            console.log(colors.blue(coreInfo), ...normalInfo);
        },
        error(coreInfo, ...normalInfo) {
            dpError.setHasError(true);
            dpError.value.push(coreInfo, ...normalInfo);
            console.log(colors.red(coreInfo), ...normalInfo)
        },
        success(coreInfo, ...normalInfo) {
            dpError.value.push(coreInfo, ...normalInfo);
            console.log(colors.green(coreInfo), ...normalInfo)
        }
    }
}

const log = createLog(dpError);
module.exports = log;
