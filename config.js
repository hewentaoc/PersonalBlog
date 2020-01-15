/*
*
* 读取config.conf配置文件中的信息
*
*/
let fs = require('fs');
let globalConfig = {};
let configArr = fs.readFileSync('./config.conf').toString().split('\r\n');

for(let i = 0 ; i < configArr.length ; i ++) {
       let data = configArr[i].split('=');
       globalConfig[data[0].trim()] = data[1].trim();
}
module.exports = globalConfig;