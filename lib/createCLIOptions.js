const optionator = require("optionator");

function createCLIOptions(){
    return optionator({
        prepend: "usage: dynamic-pack [path] [options]",
        options: [
            {
                heading:"Basic configuration"
            },
            {
                option: "help",
                alias: "h",
                type: "Boolean",
                description: "Print this list and exit"
            },
            {
                option: "version",
                alias: "v",
                type: "Boolean",
                description: "Print the current version and exit"
            },
            {
                option:'config',
                alias: "c",
                type:"path::String",
                // type:"path::String | Boolean", //TODO 待支持Boolean类型
                // default:false,
                description: 'Configuration file path'
            },
            {
                option:"classify",
                type:'String',
                description: 'Select configuration mode'
            },
            {
                option: 'read',
                type:'path::String',
                description: 'Read file information'
            },
            {
                option: 'time',
                type:"Int",
                description: 'Delay in seconds'
            }
            // {
            //     option: "debug",
            //     type: "Boolean",
            //     default: false,
            //     description: "Output debugging information"
            // },
        ]
    })
}

module.exports = createCLIOptions;
