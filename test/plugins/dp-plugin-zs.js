module.exports = {
    config:{
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
}
