/*
* 博客模块的插入和获取
*
* */

let dbUtil = require('./dbutil');

/* 插入博客信息到数据库中 */
function insertBlog(title ,content, views ,tags , ctime , utime , success) {
    let insertSql = 'insert into blog (title,content,views,tags,ctime,utime) values (?,?,?,?,?,?);';
    let params = [title ,content, views ,tags , ctime , utime];
    let connection = dbUtil.createConnection();
    connection.connect();
    connection.query(insertSql,params,function (error , result) {
        if(error == null ) {
            success(result);
        }else {
            console.log(error);
        }
    })
    connection.end();
}
/* 根据翻页查询数据库中博客 */
function queryBlogByPage (offset , pageSize , success ) {
    let querySql = 'select * from blog order by id desc limit ? , ? ;';
    let param = [offset, pageSize];
    let connection = dbUtil.createConnection();
    connection.connect();
    connection.query(querySql,param ,function (error , result) {
        if(error == null) {
            success(result);
        }else{
            console.log(error);
        }
    })
    connection.end();
}
/* 查询博客的数量 */
function queryBlogCount (success) {
    let querySql = 'select count(1) as count  from blog';
    let param = [];
    let connection = dbUtil.createConnection();
    connection.connect();
    connection.query(querySql , function ( error ,result) {
        if(error == null) {
            success(result);
        }else{
            console.log(error);
        }
    })
    connection.end();
}
/* 根据博客id查找博客 */
function queryBlogById (blogId ,success) {
    let querySql = 'select * from blog where id = ?;';
    let param = [blogId];
    let connection = dbUtil.createConnection();
    connection.connect();
    connection.query(querySql,param,function (error , result) {
        if(error == null) {
            success(result);
        }else {
            console.log(error);
        }
    })
    connection.end();
}
/* 更新views的次数 */
function updateViewsById(blogId , success) {
    let updateSql = 'update blog set views = views + 1 where id = ? ;';
    let param = [blogId];
    let connection = dbUtil.createConnection();
    connection.connect();
    connection.query(updateSql,param , function (error , result) {
        if(error == null) {
            success(result);
        }else{
            console.log(error);
        }
    })
    connection.end();
}

/* map查询所有博客 */
function queryAllBlog (success) {
    let querySql = 'select * from blog order by id desc;';
    let param = [];
    let connection = dbUtil.createConnection();
    connection.connect();
    connection.query(querySql,param,function (error ,result) {
        if(error == null) {
            success(result);
        }else{
            console.log(error);
        }
    })
    connection.end();
}

/* 查找浏览次数最多的5个blog */
function queryHotBlog (size , success) {
    let querySql = 'select * from blog order by views desc limit ?';
    let param = [size];
    let connection = dbUtil.createConnection();
    connection.connect();
    connection.query(querySql , param , function (error , result) {
        if(error == null) {
            success(result);
        }else{
            console.log(error);
        }
    })
    connection.end();
}

/* 根据关键字查找分页的博客 */
function queryBlogBySearch (search ,offset , pageSize , success) {
    let querySql = "select * from blog where title like concat(concat('%', ?), '%') or content like concat(concat('%', ?), '%') order by id desc limit ?,?;";
    let param = [search,search,offset , pageSize ];
    let connection = dbUtil.createConnection();
    connection.connect();
    connection.query(querySql,param,function (error , result) {
        if(error == null) {
            success(result);
        }else{
            console.log(error)
        }
    })
    connection.end();
}

/* 根据关键字查找分页的博客数量 */
function queryBlogCountBySearch (search, success) {
    let querySql = "select count(1) as count from blog where title like concat(concat('%', ?), '%') or content like concat(concat('%', ?), '%');";
    let param = [search,search];
    let connection = dbUtil.createConnection();
    connection.connect();
    connection.query(querySql,param,function (error , result) {
        if(error == null) {
            success(result);
        }else{
            console.log(error)
        }
    })
    connection.end();
}



module.exports = {
    insertBlog,
    queryBlogByPage,
    queryBlogCount,
    queryBlogById,
    queryAllBlog,
    updateViewsById,
    queryHotBlog,
    queryBlogBySearch,
    queryBlogCountBySearch
}

