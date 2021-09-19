function getNowFmt(){
    const date = new Date();
    return `${date.getFullYear()}-${add0(date.getMonth() + 1)}-${add0(date.getDate() + 1)} ${add0(date.getHours())}:${add0(date.getMinutes())}:${add0(date.getSeconds())}`

    function add0(v){
        return v<10 ? `0${v}` : v;
    }
}

function isNil(x){
    return x===undefined || x===null
}

module.exports = {
    getNowFmt,
    isNil
}