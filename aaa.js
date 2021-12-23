var fs=require("fs");

fs.unlink("./bbb.js",function(err){
    if(err){
        throw err;
    }else{
        console.log("删除成功！")
    }
})