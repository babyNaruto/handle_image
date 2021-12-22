const express = require('express');
const app = express();
const childProcess = require('child_process');
const aiModels = require('./AIModel/models');
const bodyParser = require("body-parser");
const fs = require("fs")


//解析x-www-form-url...头部信息（headers）

//指定一个监听的接口
let port = 8081;
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
    let devData = {
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

    //通过判断进程名称判断model是否存在，如果有返回pid



    //根据Model=value获取对应数据
    let modelsData = req.query; //获取get请求参数
    let modelsId = modelsData.Models  //获取Model=？的值
    let ModelName = 'ModelName_' + modelsId;
    // console.log(ModelName)
    let ModelStatus = aiModels.modelStats.Models[ModelName]
    let resModelStatus = {
        "Models":{
        }
    }
    resModelStatus.Models[ModelName] = ModelStatus
    // console.log(resModelStatus)
    // 将响应数据发送
    res.send(JSON.stringify(resModelStatus));
});


/*3.提交AI分析请求
    请求端发送
    请求方式：POST
    http(s)://${Host}:${Port}/${BASE}/Analyse?Model=1
 */

// 配置body-parser模块
// extended: false ,方法内部使用querystring内置模块处理请求参数格式
// extended: true  方法内部使用第三方qs模块处理请求参数

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.post("/Analyse",(req,res)=> {
    //3.1 请求数据写入request_post.json
    let resAnalyseData = JSON.stringify(req.body);
    fs.writeFile('./request_post.json', resAnalyseData, function (err) {
        if (err) {
            console.error(err);
        }
        console.log('----------写入成功-------------');
    })

    //3.2 算法分析，python读取后删除json文件


    //3.3 等待算法处理完毕


    //3.4 生成结果，将result_post.json数据发送
    fs.readFile('./result_post.json', function (err, data) {
        if (err) {
            return console.error(err);
        }
        var fileData = data.toString();//将二进制的数据转换为字符串
        let resAnalyseData = JSON.parse(fileData);//将字符串转换为json对象
      //提交响应数据到客户端
        res.send(JSON.stringify(resAnalyseData))
    })

})


/*4.重新加载AI处理模块请求(用于热加载更新)
    请求端发送
    请求方式：PUT
    http(s)://${Host}:${Port}/${BASE}/ReloadAnalyseModels
 */
app.put("/ReloadAnalyseModels", (req, res) =>{
    let resReloadAnalyseData = {
        Code:200,
        Msg: '操作结果描述信息，错误原因等'
    }
    res.send(JSON.stringify(resReloadAnalyseData))
})


/*5.提交AI模块资源初始化请求
    请求端发送
    请求方式：PUT
    http(s)://${Host}:${Port}/${BASE}/InitAnalyseModel?Model=1
 */
app.put("/InitAnalyseModel", (req, res) =>{
    let resInitAnalyseData = {
        Code:200,
        Msg: '操作结果描述信息，错误原因等'
    }
    res.send(JSON.stringify(resInitAnalyseData))
})

/*6.提交AI模块资源释放请求
    请求端发送
    请求方式：PUT
    http(s)://${Host}:${Port}/${BASE}/DeInitAnalyseModel?Model=1
 */
app.put("/DeInitAnalyseModel", (req, res) =>{
    let resDelAnalyseData = {
        Code:200,
        Msg: '操作结果描述信息，错误原因等'
    }
    res.send(JSON.stringify(resDelAnalyseData))
})




