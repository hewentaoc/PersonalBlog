let express = require('express');
let app = new express();
let globalConfig = require('./config');
let globalMap = require('./load');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(express.static(globalConfig.path));

/*everyday模块*/
app.post('/insertEveryDay', globalMap.get('/insertEveryDay'));
app.get('/queryEveryDay',globalMap.get('/queryEveryDay'));

/*blog模块*/
app.post('/insertBlog',globalMap.get('/insertBlog'));
app.get('/queryBlogByPage',globalMap.get('/queryBlogByPage'));
app.get('/queryBlogById',globalMap.get('/queryBlogById'));
app.get('/queryAllBlog',globalMap.get('/queryAllBlog'));
app.get('/queryHotBlog',globalMap.get('/queryHotBlog'));
app.get('/queryBlogBySearch',urlencodedParser,globalMap.get('/queryBlogBySearch'));

/*comment模块*/
app.get('/getRandomCode',globalMap.get('/getRandomCode'));
app.get('/insertComment',globalMap.get('/insertComment'));
app.get('/queryCommentByBlogId',globalMap.get('/queryCommentByBlogId'));
app.get('/queryNewComment',globalMap.get('/queryNewComment'));

/*tag模块*/
app.get('/queryAllTags',globalMap.get('/queryAllTags'));
app.get('/queryTags',globalMap.get('/queryTags'));

app.listen(globalConfig.port,function () {
    console.log("开启服务器")
})