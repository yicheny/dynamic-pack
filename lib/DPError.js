const fs = require('fs');
const process = require('process');
const {getNowFmt} = require('./utils')

class DpError {
    constructor() {
        this._value = [];
        this._path = './';
        this._hasError = null;
    }

    setHasError(value){
        this._hasError = value;
    }

    get value() {
        return this._value;
    }

    setPath(value) {
        if(typeof value !== 'string') return null;
        this._path = value;
    }

    output() {
        this.transformError();
        this.value.unshift(this.getOutTime())
        return this.value.join('\n');
    }

    getOutTime() {
        return `Log output time：${getNowFmt()}\n`
    }

    createLog() {
        if(!this._hasError) return null;
        const logName = `dp_error_log_${(new Date()).getTime()}.txt`;
        fs.writeFileSync(`${this._path}/${logName}`, this.output());
        process.exit();
    }

    transformError(){
        this._value = this.value.map((error)=>{
            if(error instanceof Error) {
                return error.stack;
                // return JSON.stringify(error, Object.getOwnPropertyNames(error));
            }
            return error;
        },)
    }
}

module.exports = DpError;
