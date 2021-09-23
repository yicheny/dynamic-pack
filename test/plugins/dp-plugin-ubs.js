module.exports = {
    config:{
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
    }
}
