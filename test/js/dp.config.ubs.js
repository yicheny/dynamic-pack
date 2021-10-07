const baseConfig = require('./dp.config.json');

const classifyConfig = {
    "classify":"ubs",
    "sourceFile": "./files/otherMain.js",
    "targetFile": "./files/main.js",
    "moduleConfig": [
        {
            "filePath": "./files/children/file.js",
            "replaceModules": [
                {
                    "source": "import C from './C';",
                    "target": "import C from './testC';"
                },
                {
                    "source": "import D from './D';",
                    "target": "import D from './testD';"
                }
            ]
        }
    ]
};

module.exports = Object.assign({},baseConfig,classifyConfig)
