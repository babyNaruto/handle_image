function sleep(n) {
    var start = new Date().getTime();
    //  console.log('休眠前：' + start);
    while (true) {
        if (new Date().getTime() - start > n) {
            break;
        }
    }
    // console.log('休眠后：' + new Date().getTime());
}

sleep(2000);
var exec = require('child_process').exec;
var cmdStr = 'python3 test.py';
exec(cmdStr ,function(err,stdout,stderr){
    if(err) {
        console.log('error:'+stderr);
    }
    else{
        console.log(stdout);
    }
});

