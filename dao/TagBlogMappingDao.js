/*
* 标签和博客进行映射的文件
*
*/
let dbUtil = require('./dbutil');

/* 插入标签id、博客id到映射表中 */
function insertTagBlogMapping(tag_id, blog_id ,ctime ,utime ,success) {
    let insertSql = 'insert into tag_blog_mapping (tag_id,blog_id,ctime,utime) values (?,?,?,?);';
    let param = [tag_id, blog_id ,ctime ,utime];
    let connection = dbUtil.createConnection();
    connection.connect();
    connection.query(insertSql,param , function (error ,result) {
        if(error == null) {
            success(result);
        }else{
            console.log(error);
        }
    })
    connection.end()
}

/* 分页查找blogId */
function queryBlogByTagId(tagId , offset , pageSize , success) {
    let querySql = 'select blog_id from tag_blog_mapping  where tag_id = ? order by id desc limit ?,?;';
    let param = [tagId, offset , pageSize];
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

function queryBlogCountByTagId(tagId , success) {
    let querySql = 'select count(1) as count from tag_blog_mapping where tag_id = ?;';
    let param = [tagId];
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


module.exports = {
    insertTagBlogMapping,
    queryBlogByTagId,
    queryBlogCountByTagId
}