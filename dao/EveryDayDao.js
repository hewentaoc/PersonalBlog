/*
* 每日一句模块
*
* */
let dbutil = require('./dbutil');
let getNowTime = require('../util/TimeUtil');

/* 插入每日一句的内容在数据库中 */
function insertEveryDay(content, ctime ,success) {
    let insertSql = 'insert into every_day (content,ctime) values (?,?);';
    let params = [content,ctime];
    let connection = dbutil.createConnection();
    connection.connect();
    connection.query(insertSql,params, function (error,result) {
        if(error == null) {
            success(result)
        }else{
            console.log(error)
        }
    })
    connection.end()
}
/* 查找每日一句 */
function queryEveryDay(success) {
    /* 倒叙查找第一条数据 */
    let querySql = 'select * from every_day order by id desc limit 1;';
    let params = [];
    let connection = dbutil.createConnection();
    connection.connect();
    connection.query(querySql,params , function (error , result) {
        if(error == null) {
            success(result);
        }else{
            console.log(error);
        }
    });
    connection.end();
}

module.exports = {
    insertEveryDay,
    queryEveryDay
}
