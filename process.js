//处理进程模块

const childProcess = require('child_process'); // nodeJS 自带
let exec = childProcess.exec

var bbb = 123

viewProcessMessage = function (name, cb) {
    // process 不用引入，nodeJS 自带
    // 带有命令行的list进程命令是：“cmd.exe /c wmic process list full”
    //  tasklist 是没有带命令行参数的。可以把这两个命令再cmd里面执行一下看一下效果
    // 注意：命令行获取的都带有换行符，获取之后需要更换换行符。可以执行配合这个使用 str.replace(/[\r\n]/g,""); 去除回车换行符
    let cmd = process.platform === 'win32' ? 'tasklist' : 'ps aux'
    let isInited = false
    let processPid
     exec(cmd, function (err, stdout,stderr) {
        if (err) {
            return console.error(err)
        }
        stdout.split('\n').filter((line) => {
            let processMessage = line.trim().split(/\s+/)
            let processName = processMessage[0]
            //processMessage[0]进程名称 ， processMessage[1]进程id
            if (processName === name) {
                isInited = !isInited
                // console.log(processMeg)
                processPid = processMessage[1]
                console.log(processPid)
            }
        })

    }

    )
}

 viewProcessMessage('Xtranslator.exe',function (msg){})











