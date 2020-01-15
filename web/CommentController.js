
let captcha = require('svg-captcha');// 随机生成验证码的插件
let url = require('url');
let RespUtil = require('../util/RespUtil');
let TimeUtil = require('../util/TimeUtil');
let CommentDao = require('../dao/CommentDao');
let pathMap = new Map();

/* 产生随机验证码 */
function getRandomCode (request ,response){
   let img = captcha.create({fontSize: 50, width: 100, height: 34});
   response.writeHead(200);
   response.write(RespUtil.respUtil('success','查询成功',img));
   response.end();
}
pathMap.set('/getRandomCode',getRandomCode);

/* 插入评论 */
function insertComment (request ,response) {
   let params = url.parse(request.url , true).query;
   let nowTime = TimeUtil.getNowTime();
   CommentDao.insertComment(parseInt(params.blogId),params.parent,params.userName,params.comment,params.email,nowTime,nowTime,params.parentName,parseInt(params.publicParent),function (result) {
         response.writeHead(200);
         response.write(RespUtil.respUtil('success','插入成功',null));
         response.end();
   })
}
pathMap.set('/insertComment',insertComment);

/* 查询评论 */
function queryCommentByBlogId (request ,response) {
   let params = url.parse(request.url , true).query;
   CommentDao.queryCommentByBlogId(parseInt(params.blogId), function (result) {
      let resp = [];
      for(let i = 0 ; i < result.length ;i ++) {
          if(result[i].public_parent == 0) {
             resp.push(result[i]);
          }else{
              for(let j = 0 ; j < result.length ; j++){
                 if(result[j].id == result[i].public_parent) {
                        if(result[j].children) {
                           result[j].children.push(result[i]);
                        }else{
                           result[j].children = [result[i]];
                        }
                 }
              }
          }
      }
      CommentDao.queryCommentsCountByBlogId(parseInt(params.blogId) , function (count) {
         response.writeHead(200);
         response.write(RespUtil.respUtil('success','查询成功',{resp,count}));
         response.end();

      })
   })
}
pathMap.set('/queryCommentByBlogId',queryCommentByBlogId);

/* 查询最热的评论 */
function queryNewComment (request,response) {
    let size = 5;
    CommentDao.queryNewComment(size,function (result) {
        response.writeHead(200);
        response.write(RespUtil.respUtil('success','查询成功',result));
        response.end();
    })
}
pathMap.set('/queryNewComment',queryNewComment);



module.exports.path = pathMap;


