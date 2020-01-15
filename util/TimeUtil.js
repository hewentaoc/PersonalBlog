
/* 得到此时时间的方法 */
    function timeUtil() {
        return parseInt(Date.now()/1000);
    }

    module.exports.getNowTime = timeUtil;
