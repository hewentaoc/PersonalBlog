let dbUtil = require('./dbutil');

/* 插入评论 */
function insertComment(blogId,parent,userName,comment,email,ctime,utime,parentName,publicParent,success) {
    let insertSql = 'insert into comments (blog_id,parent,user_name,comment,email,ctime,utime,parent_name,public_parent) values (?,?,?,?,?,?,?,?,?);' ;
    let params = [blogId,parent,userName,comment,email,ctime,utime,parentName,publicParent];
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
/* 显示详情页的具体评论 */
function queryCommentByBlogId(blogId,success) {
    let querySql = 'select * from comments where blog_id = ?;';
    let param = [blogId];
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
/* 显示详情页的评论数 */
function queryCommentsCountByBlogId (blogId,success) {
    let querySql = 'select count(1) as count from  comments where blog_id = ?;';
    let param = [blogId];
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
/* 查询最新评论 */
function queryNewComment (size , success) {
    let querySql = 'select * from comments order by id desc limit ?';
    let param = [size];
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
    insertComment,
    queryCommentByBlogId,
    queryCommentsCountByBlogId,
    queryNewComment
}