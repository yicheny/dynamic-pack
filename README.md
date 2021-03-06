[TOC]

# 文档版本
2.1.5

# 2.0特性
- **文件配置** 原来由命令行参数输入的部分，改为由`dp.config.json`进行配置

# 支持的命令参数
目前支持以下三种命令：
- `-h --help` 输出帮助列表
- `-v --version` 输出当前`dynamic-pack`版本
- `-c --config` 读取配置执行脚本，下面会详细介绍，默认为`./dp.config.json`

# 使用
可以直接作为命令行执行，不过推荐放到`package.json`作为打包指令：
```json5
//package.json
{
    scripts:{
        "build-csfs": "dp --classify=csfs" //classify用于指定dp.config.json中的配置项
    }
}
```

# `-c --config`
配置示例，例如`dp.config.json`:
> 配置文件命名和存放位置可自由控制，无特殊要求，推荐放在根目录下
```json
{
  "classify": "ubs",
  "isRecovery": true,
  "scripts": [
    "dp -v",
    "dp -h",
    "dp --test",
    "mockDp --test"
  ],
  "errorLogPath": "./",
  "classifyConfig":{
    "ubs": {
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
}
```

## `isRecovery`
指定脚本执行完成后是否将文件还原至初始状态

> 如果不设置`isRecovery`，或`isRecovery`设置为`false`则不执行还原

## `scripts`
配置自定义执行脚本，脚本执行时机在核心处理之后，还原处理之前。

注意事项：
- 如果不设置`scripts`，或`scripts`设置为空则不会执行
- 目前`scripts`只支持串行执行【同步模式】

## `errorLogPath`
错误日志生成路径，如果不配置则默认是`./`，即`dp.config.json`所在目录

## `classifyConfig`
根据需要可以配置多个子项，每个子项分别对应不同分类，根据`classify`选取对应分类配置执行

### 设置`MainPanel`
关键路由文件，决定此分类下使用的`View`。

相关配置：
- `"sourceFile"`:此次处理选择的文件
- `"targetFile"`:此处处理需要替换的文件

### `moduleConfig` 处理相同`View`下的不同功能模块
实际项目中有版本存在特定需求，比如一般客户都是用`A`功能模板，但是客户`ubs`对功能`A`模板有定制化需求，使用`UBS_A`模块。

针对这一类需求，可以配置`moduleConfig`
> 如果没有这种需求，则对应分类下可以不配置此项
- `filePath` 对应`View`文件路径
- `replaceModules` 需要替换的功能模块集合
    - `source` 此分类下需要的功能模块
    - `target` 被替换的功能模块
    
# 运行生命周期
1. 根据`classifyConfig[classify]`进行核心处理
   1. 替换`MainPanel`
   1. 替换功能模块
   1. 生成`packInfo.json`文件，包含`classify`和`updateTime`
1. 自定义脚本执行
1. 执行还原指令

# 错误日志
错误日志仅在发生错误时生成。错误日志的名称是`dp_error_log_`加上当前格林威治时间数值，比如：`dp_error_log_1626141795237.txt`

> 如果想要快速查看错误日志的生成时间，脚本在日志最开始一行插入了生成时间，格式如：`Log output time：2021-7-13 10:46:28`
