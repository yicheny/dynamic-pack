const path = require('path');
const fs = require('fs')
const pathEnhance = require('../lib/pathEnhance')
const dpError = require('../lib/DPError')
const utils = require("./utils");
const log = require("./log");
const createExecOrder = require("../lib/createExecOrder")

const REPLACE_KEY_ENUM = {
    source:'source',
    target:'target'
}

class CLIConfig{
    constructor(options) {
        this._classify = options.classify;
        this._pathControl = new PathControl(options.config)
        //公共配置
        this._config = this._pathControl.getConfig();
        //分类配置
        this._classifyConfig = this._config.classifyConfig[this._classify];
        this._recovery = new Recovery(this._config.isRecovery,this._classifyConfig,this._pathControl)

        this._setDpError()
    }

    _setDpError(){
        dpError.setLogPath(this._pathControl.getNameResolveDir(this._config.errorLogPath))
    }

    _setMainPanel(){
        if(panelPathNotExist(this._classifyConfig)) return ;
        const sourceFileInfo = pathEnhance.readFile(this._pathControl.getNameResolveDir(this._classifyConfig.sourceFile))
        const targetFileAbsPath = this._pathControl.getNameResolveDir(this._classifyConfig.targetFile)
        this._recovery.saveTargetMainPanel(targetFileAbsPath)
        fs.writeFileSync(targetFileAbsPath,sourceFileInfo)
    }

    _replaceModule(){
        curryReplaceModules(
            REPLACE_KEY_ENUM.source,
            REPLACE_KEY_ENUM.target
        )(
            this._classifyConfig.moduleConfig,
            (x) => this._pathControl.getNameResolveDir(x)
        )
    }

    _createPackInfo(){
        const packDir = this._config.packInfoDir || './';
        const packName = this._config.packInfoName || 'packInfo.json';
        const packPath = this._pathControl.getNameResolveDir(`${packDir}${packName}`);
        this._recovery.savePackInfo(packPath)
        const info = {
            "classify":this._classify,
            "updateTime":utils.getNowFmt()
        }
        fs.writeFileSync(packPath,JSON.stringify(info))
    }

    changeWithConfig(){
        this._setMainPanel();
        log.success('MainPanel successfully processed!');
        this._replaceModule();
        log.success('Special module successfully processed!');
        this._createPackInfo();
        log.success('Successfully created PackInfo file!');
    }

    async executeScripts(){
        const execOrder = createExecOrder(log)
        const hasScripts = Array.isArray(this._config.scripts) && (this._config.scripts.length > 0)
        if(!hasScripts) return null;
        log.primary("\nExecute custom scripts!\n");

        //串行
        for(const s of this._config.scripts){
            await execOrder(s);
        }

        //并行
        // const orderList = this._config.scripts.map((s) => execOrder(s));
        // await Promise.all(orderList);

        log.success("Custom scripts executed successfully!\n")
    }

    executeRecovery(){
        this._recovery.execute()
    }
}

module.exports = CLIConfig

//Helpers
function panelPathNotExist(classifyConfig){
    if(utils.isNil(classifyConfig.sourceFile)) return true;
    if(utils.isNil(classifyConfig.targetFile)) return true;
}

function curryReplaceModules(sourceKey,targetKey){
    return function replaceModules(moduleConfig,getNameResolveDir){
        if(!Array.isArray(moduleConfig)) return null;

        moduleConfig.forEach(config => {
            const fileAbsPath = getNameResolveDir(config.filePath)
            let fileInfo = pathEnhance.readFile(fileAbsPath);
            config.replaceModules.forEach(o => {
                fileInfo = fileInfo.replace(o[sourceKey],o[targetKey])
            })
            fs.writeFileSync(fileAbsPath,fileInfo)
        })
    }
}

class Recovery{
    constructor(isRecovery,classifyConfig,pathControl) {
        this._isRecovery = isRecovery;
        this._classifyConfig = classifyConfig;
        this._pathControl = pathControl;
    }

    saveTargetMainPanel(targetFilePath){
        this._targetMainPanel = pathEnhance.readFile(targetFilePath)
    }

    savePackInfo(packPath){
        this._packInfo = {
            packPath,
            packInfo: fs.existsSync(packPath) ? pathEnhance.readFile(packPath) : ''
        };
    }

    _recoverMainPanel(){
        fs.writeFileSync(
            this._pathControl.getNameResolveDir(this._classifyConfig.targetFile),
            this._targetMainPanel
        )
    }

    _recoverModules(){
        curryReplaceModules(
            REPLACE_KEY_ENUM.target,
            REPLACE_KEY_ENUM.source
        )(
            this._classifyConfig.moduleConfig,
            (x) => this._pathControl.getNameResolveDir(x)
        )
    }

    _recoverPackInfo(){
        const {packInfo,packPath} = this._packInfo;
        fs.writeFileSync(packPath,packInfo);
    }

    execute(){
        if(!this._isRecovery) return null;
        if(!panelPathNotExist(this._classifyConfig)) this._recoverMainPanel();
        this._recoverModules();
        this._recoverPackInfo();
        log.success('Successfully restored to the initial state!');
    }
}

class PathControl{
    constructor(originalPath) {
        this._originalPath = originalPath;
    }

    get _absolutePath(){
        return pathEnhance.getAbsoluteFilePath(this._originalPath)
    }

    get _dirName(){
        return path.dirname(this._absolutePath)
    }

    getConfig(){
        return require(this._absolutePath);
    }

    getNameResolveDir(filePath){
        return path.resolve(this._dirName,filePath)
    }
}
