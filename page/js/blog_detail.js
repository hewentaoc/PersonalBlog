import utils from './utils.js';
let blog_wrap = new Vue({
    el:"#blog_wrap",
    data:{
        blogMes:{

        },
    },
    created() {
        this.getParms();
    },
    methods:{
        // 得到请求博客的id
        getParms(){
            let params = location.search.indexOf('?') != -1 ? location.search.split("?")[1].split('&') : "";
            let blogId = null;
            if(params){
                for(let i = 0; i < params.length ;i++) {
                    if(params[i].split('=')[0] == 'bid') {
                        blogId = params[i].split('=')[1];
                    }else{
                        continue;
                    }
                }
                if(blogId) {
                    this.getData(parseInt(blogId));
                }
            }
        },
        // 得到渲染页面的数据
        getData:function(blogId){
            let self = this;
            axios({
                method:"get",
                url:"/queryBlogById",
                params:{
                    blogId:blogId,
                }
            }).then(function(result){
                self.renderData(result.data.data[0])
            }).catch(function (error) { 
                console.log(error);
            })
        },
        // 更改渲染页面的数据
        renderData (data) {
            let obj = {};
            for(let prop in data) {
                if(prop == 'ctime'){
                    obj[prop] = utils.getDateMore(data[prop]);
                }else{
                    obj[prop] = data[prop];
                }
            } 
            this.blogMes = obj;
        },
       
    }
})

let blog_comment = new Vue({
    el:"#blog_comment",
    data:{
        code:"",
        rightCode:"",
    },
    created() {
        this.getRandomCode();
    },
    methods:{
        //得到博客Id 
        getParms(){
            let params = location.search.indexOf('?') != -1 ? location.search.split("?")[1].split('&') : "";
            let blogId = null;
            if(params){
                for(let i = 0; i < params.length ;i++) {
                    if(params[i].split('=')[0] == 'bid') {
                        blogId = params[i].split('=')[1];
                    }else{
                        continue;
                    }
                }
                if(blogId) {
                    return blogId;
                }
            }
            return;
        },
        // 得到随机验证码
        getRandomCode(){
            let self = this;
            axios({
                method:"get",
                url:"/getRandomCode",
            }).then(function (result) { 
                self.code = result.data.data.data;
                self.rightCode = result.data.data.text;
            }).catch(function(error){
                console.log(error);
            })
        },
        //提交评论
        sendComment(){
            let user = document.getElementById('username').value;
            let email = document.getElementById('email').value;
            let comment = document.getElementById('comment_content').value;
            let code = document.getElementById('code').value;
            let reply = document.getElementById('comment_reply').value;
            let replyName = document.getElementById('comment_reply_name').value;
            let publicParent = document.getElementById('public_parent').value;
            if(user == "" || email == "" || comment == "" || code == ""){
                alert('内容不能为空');
                return;
            }
            if(code.toUpperCase() != this.rightCode.toUpperCase()) {
                document.getElementById('code').value = "";
                this.getRandomCode();
                alert("验证码输入错误");
                return;
            }
            let blogId = this.getParms();
            if(blogId) {
                this.addComment(blogId,reply,user,comment,email,replyName,publicParent);
            }
        },
        // 发送请求 插入评论
        addComment(blogId,reply,user,comment,email,replyName,publicParent) {
            let self = this;
            axios({
                method:"get",
                url:"/insertComment",
                params:{
                    blogId:blogId,
                    parent:reply,
                    userName:user,
                    comment:comment,
                    email:email,
                    parentName:replyName,
                    publicParent:publicParent,
                }
            }).then(function(result){
                alert(result.data.msg);
                self.clearMes();
                cur_comments.getParms()
            }).catch(function (error) { 
                console.log(error)
            })
        },
        // 清空信息
        clearMes () {
            document.getElementById('username').value = "";
            document.getElementById('email').value = "";
            document.getElementById('comment_content').value = "";
            document.getElementById('code').value = "";
        }
    }
})

let cur_comments = new Vue({
    el:"#cur_comments",
    data:{
        totalCount: 0,
        commentList:[],
    },
    created() {
        this.getParms();
    },
    methods:{
        getParms(){
            let params = location.search.indexOf('?') != -1 ? location.search.split("?")[1].split('&') : "";
            let blogId = null;
            if(params){
                for(let i = 0; i < params.length ;i++) {
                    if(params[i].split('=')[0] == 'bid') {
                        blogId = params[i].split('=')[1];
                    }else{
                        continue;
                    }
                }
                if(blogId) {
                    this.getData(blogId);
                }
            }
        },
        getData(blogId){
            let self = this;
            axios({
                method:'get',
                url:"/queryCommentByBlogId",
                params:{
                    blogId:blogId,
                }
            }).then(function (result) {
                self.totalCount = result.data.data.count[0].count;
                let arr = result.data.data.resp;
                for(let i = 0 ; i < arr.length ;i ++) {
                    arr[i].ctime = utils.getDateMore(arr[i].ctime);
                    if(arr[i].children) {
                        for(let j = 0 ; j < arr[i].children.length ; j ++){
                            arr[i].children[j].ctime = utils.getDateMore( arr[i].children[j].ctime);
                        }
                    }
                }
                self.commentList = arr;
            }).catch(function(error){
                console.log(error);
            })
        },
        reply (comId,userName,publicParent) {
            location.href ='#blog_comment';
            document.getElementById('comment_reply').value = comId;
            document.getElementById('comment_reply_name').value = userName;
            if(publicParent == 0) {
                document.getElementById('public_parent').value = comId;
            }else{
                document.getElementById('public_parent').value = publicParent;
            }
        }
    }
})