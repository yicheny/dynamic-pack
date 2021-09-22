const colors = require('colors/safe');
const dpError = require('./DPError');
const { DPErrorTypeEnum } = require("./shared/Enums");

const log = {
    info(...text) {
        dpError.addValues({ texts: [text] });
        console.log(...text)
    },
    primary(coreInfo, ...normalInfo) {
        dpError.addValues({ texts: [coreInfo, ...normalInfo] });
        console.log(colors.blue(coreInfo), ...normalInfo);
    },
    error(coreInfo, ...normalInfo) {
        dpError.addValues({ type: DPErrorTypeEnum.error, texts: [coreInfo, ...normalInfo] });
        console.log(colors.red(coreInfo), ...normalInfo)
    },
    success(coreInfo, ...normalInfo) {
        dpError.addValues({ texts: [coreInfo, ...normalInfo] });
        console.log(colors.green(coreInfo), ...normalInfo)
    }
}

module.exports = log;
