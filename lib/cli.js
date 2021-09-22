const path = require('path');
const fs = require('fs');
const createCLIOptions = require("./createCLIOptions");
const log = require("./log");
const {getAbsoluteFilePath, readFile, getWinPath} = require("./pathEnhance");
const dpError = require("./DPError");
const globalData = require("./GlobalData");
const utils = require("./utils");
const createExecOrder = require("./createExecOrder");
const tryExecute = require("./tryExecute")

function createCLI(){
    return {
        execute(argv){
            const CLIOptions = createCLIOptions();
            const options = CLIOptions.parse(argv);

            if (options.help) return printHelpInfo(CLIOptions);
            if (options.version) return printVersion();
            if (options.config) return setByConfig(options);
            if (options.read) return runRead(options.read);
            if (options.time) return runTime(options.time);
        }
    }

    function printHelpInfo(CLIOptions) {
        log.info(CLIOptions.generateHelp())
        process.exit();
    }

    function printVersion() {
        log.info('v' + require('../package.json').version);
        process.exit();
    }

    async function setByConfig(options) {
        await tryExecute(async () => {
            const GLOBAL_KEYS = Object.freeze({
                packInfo:"packInfo"
            })
            let originalMainPanel = null;
            const absoluteConfigPath = getAbsoluteFilePath(getConfigPath());
            const dirName = path.dirname(absoluteConfigPath);
            const config = require(absoluteConfigPath);
            dpError.setLogPath(getResolveName(config.errorLogPath))
            const isRecovery = config.isRecovery;
            const classify = getClassify();
            const classifyConfig = config.classifyConfig[classify];
            const moduleConfig = classifyConfig.moduleConfig;

            dynamic()
            await exeScripts(config.scripts);
            if (isRecovery) recovery();

            function getConfigPath(){
                const config = options.config;
                if(config === true) return './dp.config.json';
                return config;
            }

            function dynamic() {
                setMainPanel();
                log.success('MainPanel successfully processed!');
                replaceModule();
                log.success('Special module successfully processed!');
                createPackInfo()
                log.success('Successfully created PackInfo file!');

                function setMainPanel() {
                    if(panelPathNotExist(classifyConfig)) return null;
                    const sourceFile = readFile(getResolveName(classifyConfig.sourceFile));
                    if (isRecovery) originalMainPanel = readFile(getResolveName(classifyConfig.targetFile));
                    writeTargetPanel(sourceFile);
                }

                function createPackInfo(){
                    const packDir = config.packInfoDir || './';
                    const packName = config.packInfoName || 'packInfo.json';
                    const packPath = getResolveName(`${packDir}${packName}`);
                    globalData.setData(GLOBAL_KEYS.packInfo,{
                        packPath,
                        packInfo:getPackInfo(packPath)
                    })
                    const info = {
                        "classify":classify,
                        "updateTime":utils.getNowFmt()
                    }
                    fs.writeFileSync(packPath,JSON.stringify(info))

                    function getPackInfo(filePath){
                        if(fs.existsSync(filePath)) return readFile(filePath);
                        return '';
                    }
                }
            }

            async function exeScripts(scripts) {
                const execOrder = createExecOrder(log);
                const hasScripts = Array.isArray(scripts) && (scripts.length > 0);
                if (!hasScripts) return null;
                log.primary("\nExecute custom scripts!\n");

                //串行
                for(const s of scripts){
                    await execOrder(s);
                }

                //并行
                // const orderList = scripts.map((s) => execOrder(s));
                // await Promise.all(orderList);

                log.success("Custom scripts executed successfully!\n")
            }

            function recovery() {
                if(!panelPathNotExist()) writeTargetPanel(originalMainPanel);
                replaceModule('target', 'source');
                const {packInfo,packPath} = globalData.getData(GLOBAL_KEYS.packInfo);
                fs.writeFileSync(packPath,packInfo);

                log.success('Successfully restored to the initial state!');
            }

            //公共方法
            function replaceModule(sourceKey = 'source', targetKey = 'target') {
                if (!Array.isArray(moduleConfig)) return null;
                moduleConfig.forEach((c) => {
                    const filePath = getResolveName(c.filePath);
                    let file = readFile(filePath);
                    c.replaceModules.forEach(x => {
                        file = file.replace(x[sourceKey], x[targetKey]);
                    });
                    fs.writeFileSync(filePath, file)
                })
            }

            function writeTargetPanel(file) {
                fs.writeFileSync(getResolveName(classifyConfig.targetFile), file);
            }

            function getResolveName(file){
                return getWinPath(path.resolve(dirName,file));
            }

            function panelPathNotExist(){
                if(utils.isNil(classifyConfig.sourceFile)) return true;
                if(utils.isNil(classifyConfig.targetFile)) return true;
            }

            function getClassify(){
                return options.classify
            }
        })
    }

    function runTime(time){
        return new Promise((resolve)=>{
            const timeId = setTimeout(()=>{
                resolve(`dp time=${time} current=${utils.getNowFmt()}`);
                clearTimeout(timeId)
            },time*1000)
        },[])
    }

    function runRead(readPath){
        const fileInfo = readFile(getAbsoluteFilePath(readPath));
        log.success('dp read file information:',fileInfo)
    }
}

module.exports = createCLI;
