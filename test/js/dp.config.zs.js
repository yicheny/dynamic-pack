const baseConfig = require('./dp.config.json');

const classifyConfig = {
    "moduleConfig": [
        {
            "filePath": "./files/children/file.js",
            "replaceModules": [
                {
                    "source": "import A from './A';",
                    "target": "import A from './testA';"
                }
            ]
        }
    ]
}

module.exports = Object.assign({},baseConfig,classifyConfig)
