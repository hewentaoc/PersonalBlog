
let pathMap = new Map();
let TagsDao = require('../dao/TagsDao');
let RespUtil = require('../util/RespUtil');
let BlogDao = require('../dao/BlogDao');
let PageUtil = require('../util/PageUtil');
let TagBlogMappingDao = require('../dao/TagBlogMappingDao');
let url = require('url');

function queryAllTags(request ,response) {
    TagsDao.queryAllTags(function (result) {
        result.sort(function (a,b) {
            return Math.random() - 0.5;
        })
        response.writeHead(200);
        response.write(RespUtil.respUtil('success','查询成功',result));
        response.end()
    })
}
pathMap.set('/queryAllTags' , queryAllTags);

/*

* 先看标签是否存在
* 标签存在就通过标签Id查找blogId
* 再通过blogId查找blog
*
* */
function queryTags (request ,response) {
    let param = url.parse(request.url , true).query;
    TagsDao.queryTags(param.tag,function (result) {/* 先比较标签是否存在 */
        if(result == null || result.length == 0) { /* 不存在直接返回 */
            response.writeHead(200);
            response.write(RespUtil.respUtil('success','查询成功',null));
            response.end()
        }else{/* 存在 进行TagId找BlogId */
            TagBlogMappingDao.queryBlogCountByTagId(result[0].id,function (count) {
                  let totalCount = count[0].count;
                  let obj = PageUtil.getPageParams(param.cursorPage , param.pageSize ,totalCount);
                  queryBlogByTagId(result[0].id ,obj ,totalCount ,response);
            })
        }
    });
}
pathMap.set('/queryTags',queryTags);


function queryBlogByTagId(tagId, obj ,totalCount ,response) {
    TagBlogMappingDao.queryBlogByTagId(tagId, obj.offset , obj.limit,function (res) {
        let arr = [];
        for(let i = 0 ; i < res.length ;i ++) {
            BlogDao.queryBlogById(res[i].blog_id,function (blogArr) {
                arr.push(blogArr[0])
                after(res,arr,response,totalCount);
            })
        }
    })
}

function after (res,arr,response,totalCount) {
    if(res.length == arr.length) {
        for(let i = 0 ; i <arr.length ; i++) {
            arr[i].content = arr[i].content.replace(/<img[\w\W]*">/g,"");
            arr[i].content = arr[i].content.replace(/<[\w\W]{1,5}>/g,"");
            arr[i].content = arr[i].content.substring(0,300);
        }
        let res = JSON.parse(RespUtil.respUtil('success','查询成功',arr));
        res.allCount = totalCount;
        let endRes = JSON.stringify(res);
        response.writeHead(200);
        response.write(endRes);
        response.end();
    }
}

module.exports.path = pathMap;