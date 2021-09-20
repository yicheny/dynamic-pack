const {exec} = require('child_process');
const iconv = require('iconv-lite');

const MAX_EXEC_TIME = 600;//秒
function createExecOrder(log){
    return function execOrder(order, info) {
        info = info || `${order} 执行中：`;

        let i = 1;
        const timeId = setInterval(() => {
            if(i>=MAX_EXEC_TIME) {
                log.error(`${order} The execution time is too long, end the task!`);
                return clearInterval(timeId);
            }
            info && console.log(info, i++);
        }, 1000);

        return new Promise((resolve, reject) => {
            exec(order,{ encoding:'binary' }, (err, stdout, stderr) => {
                if (err) return reject(err);
                return resolve(stdout, stderr);
            });
        }).then((stdout, stderr) => {
            log.primary(`${order} stdout：\n`, decode(stdout));
            clearInterval(timeId)
        }).catch(err => {
            log.error(`${order} error：\n`, decode(err.stack.concat("\n")));
            clearInterval(timeId)
        });
    }

    function decode(str = '',encode='cp936') {
        const buf = Buffer.from(str, 'binary');
        return iconv.decode(buf, encode);
    }
}

module.exports = createExecOrder;
