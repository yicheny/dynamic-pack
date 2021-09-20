class GlobalData {
    constructor() {
        this.data = new Map();
    }

    setData(key,value){
        this.data.set(key,value);
    }

    getData(key){
        return this.data.get(key);
    }
}

const globalData = new GlobalData();
module.exports = globalData;
