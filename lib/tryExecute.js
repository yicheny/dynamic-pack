const log = require("../lib/log");

async function tryExecute(callback,errorCB,finallyCB) {
    try {
        await exe(callback);
    } catch (error) {
        log.error('dp执行出错：', error);
        await exe(errorCB);
    } finally {
        await exe(finallyCB);
    }

    async function exe(fn){
        if (typeof fn === 'function') return await fn();
    }
}

module.exports = tryExecute;
