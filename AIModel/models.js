//算法模块状态
    let  modelStats = {
        "Models": {
            "ModelName_1":{
                "AnalyseAction": "",
                "Inited":false
            },
            "ModelName_2":{
                "AnalyseAction": "",
                "Inited":false
            },
            "ModelName_3":{
                "AnalyseAction": "",
                "Inited":false
            }
        },

    }
function analyseModel() {
    console.log('model is doing something')
}

module.exports = {
    modelStats,
    analyseModel
}