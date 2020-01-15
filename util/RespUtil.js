 /*
 * 返回数据给前端的格式
 * */
  function respUtil(status , msg , data) {
        return JSON.stringify({status:status,msg:msg,data:data});
  }

  module.exports.respUtil = respUtil;