/*
* everyday 模块的请求层
*
* */
    let pathMap = new Map();
    let getNowTime = require('../util/TimeUtil');
    let respUtil = require('../util/RespUtil');
    let EveryDayDao = require('../dao/EveryDayDao');
    function insertEveryDay(request,response) {
        request.on('data',function (result) {
            let content = result.toString().trim();
            let ctime = getNowTime.getNowTime();
            EveryDayDao.insertEveryDay(content,ctime,function (result) {
                let data = respUtil.respUtil('success','添加成功',null);
                response.writeHead(200);
                response.write(data);
                response.end();
            })
        })
    }
    pathMap.set('/insertEveryDay',insertEveryDay);

    function queryEveryDay(request,response) {
        EveryDayDao.queryEveryDay(function (result) {
            let data = respUtil.respUtil('success','查询成功',result);
            response.writeHead(200);
            response.write(data);
            response.end();
        })
    }
    pathMap.set('/queryEveryDay',queryEveryDay);
    module.exports.path = pathMap;

