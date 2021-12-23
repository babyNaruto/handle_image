const express = require('express');
const app = express();
const childProcess = require('child_process');
const aiModels = require('./AIModel/models');
const bodyParser = require("body-parser");
const fs = require("fs")

var exec = require('child_process').exec;
//解析x-www-form-url...头部信息（headers）

//指定一个监听的接口
var port = 8081;
// console.log(aiModels.modelStats.Models)
app.listen(port, function() {
    console.log(`app is running at port:${port}`);
    console.log(`url: http://127.0.0.1:${port}`);
    // cp.exec(`explorer http://127.0.0.1:${port}`, function () {
    //     //默认打开
    // });
});



//解决跨域问题
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Authorization,X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method' )
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH, PUT, DELETE')
    res.header('Allow', 'GET, POST, PATCH, OPTIONS, PUT, DELETE')
    next();
});


/* 1.获取基本信息
    请求端发送
    请求方式：GET
    http(s)://${Host}:${Port}/${BASE}/GetDevInformation
 */

app.get('/GetDevInformation', (req, res) => {
    var devData = {
       "Models":[
        {
            "Name":"111",
            "AnalyseAction":"222",
            "Version":"333",
            "Manufacturer":"444"
        }]
    }
    // console.log(devData)
    // console.log(JSON.stringify(devData))
    // 为了防止显示中文乱码问题，需要设置响应头 Content-Type 的值为 text/html; charset=utf-8
    // res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.send(JSON.stringify(devData))
})


/*2.获取AI处理模块状态
    请求端发送
    请求方式：GET
    http(s)://${Host}:${Port}/${BASE}/GetDevAnalyseModelStatus(?Models=1,2,3...N)
 */
app.get("/GetDevAnalyseModelStatus",(req,res)=>{

    //读取PID json数据
    fs.readFile('./PID.json', function (err, data) {
        if (err) {
            return console.error(err);
        }
        var pidFileData = data.toString();//将二进制的数据转换为字符串
        var resPID = JSON.parse(pidFileData);//将字符串转换为json对象
        console.log(resPID)
        var processName = resPID.PID[0].name;
        var PID = resPID.PID[0].pid;
        var isInited = false;
        var resModelStatus = {
            "Models": {
            }
        }
        //通过判断进程名称判断model是否存在，如果有返回pid
        if(PID){
            var ModelName = processName;
            var isInited = !isInited;
            // console.log(ModelName)
            var ModelStatus = {
                "AnalyseAction": "",
                "Inited":isInited
            }
            var resModelStatus = {
                "Models":{
                }
            }
            resModelStatus.Models[ModelName] = ModelStatus

            // //启动PID进程
            // var cmdStr = 'npm list';  //./main.sh
            // exec(cmdStr ,function(err,stdout,stderr){
            //     if(err) {
            //         console.log('error:'+stderr);
            //     }
            //     else{
            //         console.log(stdout);
            //     }
            // });
        }


        // 将响应数据发送
        res.send(JSON.stringify(resModelStatus));
    })


});


/*3.提交AI分析请求
    请求端发送
    请求方式：POST
    http(s)://${Host}:${Port}/${BASE}/Analyse?Model=1
 */

// 配置body-parser模块

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.post("/Analyse",(req,res)=> {
    //3.1 请求数据写入request_post.json
    var reqAnalyseData = JSON.stringify(req.body);
    try {

        fs.writeFileSync('./request_post.json', reqAnalyseData)
        console.log("---request写入成功---")
    } catch (e) {
        console.log(e + '写入失败')
    }


    //3.3 等待算法处理完毕
    function sleep(n) {
        var start = new Date().getTime();
        //  console.log('休眠前：' + start);
        while (true) {
            if (new Date().getTime() - start > n) {
                break;
            }
        }
    }
    sleep(5000);


    //3.4 生成结果，将result_post.json数据发送
    try{
         var data = fs.readFileSync("./result_post.json","utf-8");
         // console.log("data",data);
        var fileData = data.toString();//将二进制的数据转换为字符串
        var resAnalyseData = JSON.parse(fileData);//将字符串转换为json对象
        //提交响应数据到客户端
        res.send(JSON.stringify(resAnalyseData))
        console.log("---result发送成功---")
    }catch(error){
        console.log("error:",error);
    }

    //3.5 读取结束后删除result_post.json
    try{
        fs.unlinkSync("./bbb.js");
        console.log("---result删除成功---")
    }catch (e) {
        console.log("error:",e);
    }



})


/*4.重新加载AI处理模块请求(用于热加载更新)
    请求端发送
    请求方式：PUT
    http(s)://${Host}:${Port}/${BASE}/ReloadAnalyseModels
 */
app.put("/ReloadAnalyseModels", (req, res) => {
    fs.readFile('./PID.json', function (err, data) {
        if (err) {
            return console.error(err);
        }
        var pidFileData = data.toString();//将二进制的数据转换为字符串
        var resPID = JSON.parse(pidFileData);//将字符串转换为json对象
        console.log(resPID)
        var processName = resPID.PID[0].name;
        var PID = resPID.PID[0].pid;
        var isInited = false;

        //杀死进程
        //测试PID
        process.kill(PID)  //PID
    })
    //重新启动

    //休眠时间5S
    function sleep(n) {
        var start = new Date().getTime();
        //  console.log('休眠前：' + start);
        while (true) {
            if (new Date().getTime() - start > n) {
                break;
            }
        }
    }
    sleep(5000);
    //启动PID进程
    var cmdStr = 'sh start.sh';  //./main.sh
    exec(cmdStr ,function(err,stdout,stderr){
        if(err) {
            console.log('error:'+stderr);
        }
        else{
            console.log(stdout);
            var resReloadAnalyseData = {
                Code: 200,
                Msg: '操作成功'
            }
            res.send(JSON.stringify(resReloadAnalyseData))

        }
    });

})


/*5.提交AI模块资源初始化请求
    请求端发送
    请求方式：PUT
    http(s)://${Host}:${Port}/${BASE}/InitAnalyseModel?Model=1
 */
app.put("/InitAnalyseModel", (req, res) =>{
    //服务器提交启动进程指令
    //启动PID进程
    var cmdStr = 'sh start.sh';  //./main.sh
    //休眠时间5S
    function sleep(n) {
        var start = new Date().getTime();
        //  console.log('休眠前：' + start);
        while (true) {
            if (new Date().getTime() - start > n) {
                break;
            }
        }
    }
    exec(cmdStr ,function(err,stdout,stderr){
        sleep(5000);    //休眠5秒
        if(err) {
            console.log('error:'+stderr);
        }
        else{
            console.log(stdout);
            var resInitAnalyseData = {
                Code: 200,
                Msg: 'AI模块初始化成功'
            }
            res.send(JSON.stringify(resInitAnalyseData))
        }
    })
})


/*6.提交AI模块资源释放请求
    请求端发送
    请求方式：PUT
    http(s)://${Host}:${Port}/${BASE}/DeInitAnalyseModel?Model=1
 */
app.put("/DeInitAnalyseModel", (req, res) =>{
    fs.readFile('./PID.json', function (err, data) {
        if (err) {
            return console.error(err);
        }
        var pidFileData = data.toString();//将二进制的数据转换为字符串
        var resPID = JSON.parse(pidFileData);//将字符串转换为json对象
        console.log(resPID)
        var processName = resPID.PID[0].name;
        var PID = resPID.PID[0].pid;
        console.log(PID)
        var isInited = false;
        //杀死进程
        //测试PID
        var resDelAnalyseData = {
            Code:200,
            Msg: ''
        }
        var isKilled = process.kill(PID);
        function sleep(n) {
            var start = new Date().getTime();
            //  console.log('休眠前：' + start);
            while (true) {
                if (new Date().getTime() - start > n) {
                    break;
                }
            }
        }
        sleep(5000);
        if(isKilled){
            resDelAnalyseData.Msg = '关闭成功'
            res.send(JSON.stringify(resDelAnalyseData))
        }
        else{
            resDelAnalyseData.Msg = '关闭失败'
            console.log('关闭失败')
        }
    })
})




