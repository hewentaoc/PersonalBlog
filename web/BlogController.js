/*
* 模块的请求层
*
* */

let pathMap = new Map();
let url = require('url');
let BlogDao = require('../dao/BlogDao');
let RespUtil = require('../util/RespUtil');
let TimeUtil = require('../util/TimeUtil');
let PageUtil = require('../util/PageUtil');
let TagsDao = require('../dao/TagsDao');
let TagBlogMapping = require('../dao/TagBlogMappingDao');

/* 请求浏览次数最多的blog */
function queryHotBlog(request ,response) {
    let size = 5
    BlogDao.queryHotBlog(size , function (result) {
        response.writeHead(200);
        response.write(RespUtil.respUtil('success','查询成功',result));
        response.end();
    })
}
pathMap.set('/queryHotBlog',queryHotBlog)

/*map中请求所有博客*/
function queryAllBlog(request,response) {
    BlogDao.queryAllBlog(function (result) {
        response.writeHead(200);
        response.write(RespUtil.respUtil('success','查询成功',result));
        response.end();
    })
}
pathMap.set('/queryAllBlog',queryAllBlog);

/* 详情页根据blogId查询具体的博客 */
function queryBlogById(request , response) {
    let param = url.parse(request.url ,true).query;
        BlogDao.updateViewsById(parseInt(param.blogId),function () {
            BlogDao.queryBlogById(param.blogId,function (result) {
                response.writeHead(200);
                response.write(RespUtil.respUtil('success','查询成功',result));
                response.end();
            })
        })
}
pathMap.set('/queryBlogById',queryBlogById);

/* 根据翻页查询博客*/
function queryBlogByPage (request , response) {
   let params = url.parse(request.url, true).query;
    queryBlogCount(function (result) {
      let obj = PageUtil.getPageParams(params.cursorPage , params.pageSize ,result[0].count );
      let count = result[0].count;
       BlogDao.queryBlogByPage(obj.offset , obj.limit , function (result) {
           /*
           *
           * 之所以报错的原因是因为图片太大了,一次请求数据库存储不下
           * 所以页面就会自发发送多送请求,直到base64文件完全在数据库中存储下
           * 目前40kb以内的图片不会报错
           * 老师操作过程中也遇到了这个错误
           */
            for(let i = 0 ; i <result.length ; i++) {
                result[i].content = result[i].content.replace(/<img[\w\W]*">/g,"");
                result[i].content = result[i].content.replace(/<[\w\W]{1,5}>/g,"");
                result[i].content = result[i].content.substring(0,300);
            }
            let res = JSON.parse(RespUtil.respUtil('success','查询成功',result));
            res.allCount = count;
            let endRes = JSON.stringify(res);
            response.writeHead(200);
            response.write(endRes);
            response.end();
       })
    })
}
pathMap.set('/queryBlogByPage', queryBlogByPage);

/* 查询博客的总数量 */
function queryBlogCount (success) {
    BlogDao.queryBlogCount(success);
}

/* 插入博客请求 */
function insertBlog(request ,response) {
    let params = url.parse(request.url , true).query;
    request.on('data',function (data) {
        BlogDao.insertBlog(params.title,data.toString(),0,params.tags,TimeUtil.getNowTime(),TimeUtil.getNowTime(),function (result) {
            response.writeHead(200,{'Content-type':"text/html; charset=utf-8"});
            response.write(RespUtil.respUtil('success','插入成功',null));
            response.end();
            let tagsArr = params.tags.split(',');
            let blogId = result.insertId;
            for(let i = 0 ; i < tagsArr.length ; i++) {
                if(tagsArr[i] == ""){
                    continue;
                }
                queryTags(tagsArr[i],blogId);/*查询标签是否存在*/
            }
        })
    })
}
pathMap.set('/insertBlog',insertBlog);

/* 关键字查询 */
function queryBlogBySearch(request,response) {
    let params = url.parse(request.url , true).query;
    BlogDao.queryBlogCountBySearch(params.search,function (count) {
        let totalCount = count[0].count;
        let obj = PageUtil.getPageParams(params.cursorPage , params.pageSize ,totalCount);
        BlogDao.queryBlogBySearch(params.search,obj.offset,obj.limit,function (result) {
            for(let i = 0 ; i <result.length ; i++) {
                result[i].content = result[i].content.replace(/<img[\w\W]*">/g,"");
                result[i].content = result[i].content.replace(/<[\w\W]{1,5}>/g,"");
                result[i].content = result[i].content.substring(0,300);
            }
            let res = JSON.parse(RespUtil.respUtil('success','查询成功',result));
            res.allCount = totalCount;
            let endRes = JSON.stringify(res);
            response.writeHead(200);
            response.write(endRes);
            response.end();
        })
    })
}
pathMap.set('/queryBlogBySearch',queryBlogBySearch);



/*查询标签是否存在*/
function queryTags(tag , blogId) {
    TagsDao.queryTags(tag , function (result) {
        if(result == null || result.length == 0) {
            insertTag(tag, blogId);/* 标签不存在就插入标签 */
        }else{
             /*标签存在就进行标签id和博客id映射*/
            insertTagBlogMapping(result[0].id , blogId)
        }
    })
}
/*
*
*插入标签
*插入标签的同时要进行标签id和博客id映射
*
*/
function insertTag (tag , blogId) {
    TagsDao.insertTag(tag , TimeUtil.getNowTime() , TimeUtil.getNowTime() ,function (result) {
         let tagId = result.insertId;
         insertTagBlogMapping(tagId , blogId);/* 进行标签id和博客id映射*/
    })
}

/* 进行标签id和博客id映射插入 */
function insertTagBlogMapping (tagId , blogId){
    TagBlogMapping.insertTagBlogMapping(tagId,blogId,TimeUtil.getNowTime(),TimeUtil.getNowTime(),function (result) {

    })
}





module.exports.path = pathMap;