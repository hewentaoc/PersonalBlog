/*
*
* 加载文件
* 加载controller层文件
* 形成globalMap中path和func一一对应关系
*
*/
let fs = require('fs');
let globalConfig = require('./config');
let file = fs.readdirSync(globalConfig['web_path']);
let globalMap = new Map();

    for (let i = 0 ; i < file.length ; i++) {
        let temp = require('./' + globalConfig['web_path'] + "/" + file[i]);
        if(temp.path){
            for(let [key,value] of temp.path) {
                if(globalMap.get(key) == null) {
                    globalMap.set(key,value);
                }else{
                    throw new Error('不能有相同的路径!'+ key);
                }
            }
        }
    }

module.exports = globalMap;
