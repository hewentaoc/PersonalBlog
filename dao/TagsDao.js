let dbUtil = require('./dbutil');


function queryAllTags(success) {
    let querySql = 'select * from tags;';
    let param = [];
    let connection = dbUtil.createConnection();
    connection.connect();
    connection.query(querySql,param,function (error ,result) {
        if(error == null ) {
            success(result);
        }else{
            console.log(error);
        }
    });
    connection.end();
}


/* 查询标签 */
function queryTags(tag,success) {
    let querySql = "select * from tags where tag = ?;";
    let param = [tag];
    let connection = dbUtil.createConnection();
    connection.connect();
    connection.query(querySql,param,function (error,result) {
        if(error == null) {
            success(result);
        }else{
            console.log(error);
        }
    })
    connection.end();
}
/* 插入标签 */
function insertTag(tag ,ctime , utime , success) {
    let insertSql = "insert into tags (tag ,ctime,utime) values (?,?,?);";
    let params = [tag, ctime , utime];
    let connection = dbUtil.createConnection();
    connection.connect();
    connection.query(insertSql,params,function (error,result) {
        if(error == null) {
            success(result);
        }else{
            console.log(error);
        }
    })
    connection.end();
}


module.exports = {
    queryTags,
    insertTag,
    queryAllTags
}