const createCLIOptions = require("./createCLIOptions");
const log = require("./log");
const {getAbsoluteFilePath, readFile} = require("./pathEnhance");
const utils = require("./utils");
const CLIConfig = require("./CLIConfig")

function createCLI(){
    return {
        execute(argv){
            const CLIOptions = createCLIOptions();
            const options = CLIOptions.parse(argv);

            if (options.help) return printHelpInfo(CLIOptions);
            if (options.version) return printVersion();
            if (options.config) return configExecute(options);
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

    async function configExecute(options){
        const cliConfig = new CLIConfig(options.classify,options.config)
        cliConfig.changeWithConfig();
        await cliConfig.executeScripts();
        cliConfig.executeRecovery();
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