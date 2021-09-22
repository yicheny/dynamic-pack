class GlobalData {
    constructor() {
        this.data = new Map();
    }

    static INSTANCE = null;

    static create(...params){
        if(GlobalData.INSTANCE === null) GlobalData.INSTANCE = new GlobalData(...params);
        return GlobalData.INSTANCE;
    }

    setData(key,value){
        this.data.set(key,value);
    }

    getData(key){
        return this.data.get(key);
    }
}

const globalData = GlobalData.create();
module.exports = globalData;
