import utils from './utils.js'
let math_blog = new Vue({
    el:"#tags_cloud",
    data:{
        tags_data:[],
    },
    computed: {
        random_color:function(){
            return function () {
                let r = Math.random()*255+30;
                let g = Math.random()*255+30;
                let b = Math.random()*255+30;
                return "rgb("+r+","+g+","+b+")"    
            }
        },
        random_size:function(){
            return function () { 
                let size = Math.random()*14 + 10;
                return size+"px";
            }
        }
    },
    created() {
        this.getData();
    },
    methods:{
        getData () {
            let self = this;
            axios({
                method:'get',
                url:"/queryAllTags"
            }).then(function (result) {
                let arr = [];
                for(let i = 0 ; i < result.data.data.length ; i ++) {
                    arr.push( 
                        {
                            text:result.data.data[i].tag,
                            link:'/?tag='+result.data.data[i].tag,
                        }
                    );
                }
                self.tags_data = arr;
            }).catch(function (error) {
                console.log(error);
            })
        },
        findBlog (tag) {
            // console.log(tag);
          
        }
    }
})

let recent = new Vue({
    el:"#rencent_hot",
    data:{
        hot_data:[
         
        ]
    },
    created() {
        this.getData();
    },
    methods:{
        getData(){
            let self = this;
            axios({
                method:"get",
                url:"/queryHotBlog"
            }).then(function (result) {
                let res = [];
                for(let i = 0 ; i < result.data.data.length ; i++) {
                    res.push({title:result.data.data[i].title , link:'/blog_detail.html?bid='+result.data.data[i].id })
                }
                self.hot_data = res;
            }).catch(function ( error ) {
                console.log(error);
            })
        }
    }
})

let comment = new Vue({
    el:"#comment",
    data:{
        commnet_data :[

        ]
    },
    created() {
        this.getData();
    },
    methods:{
        getData(){
            let self = this;
            axios({
                method:"get",
                url:'/queryNewComment',
            }).then(function(result){
                self.opreateData(result.data.data);
            }).catch(function(error){
                console.log(error);
            })
        },
        opreateData (data) {
            let res = [];
            for(let i = 0 ; i < data.length ;i ++) {
                let obj = {
                    username:data[i].user_name,
                    ctime: utils.getDate(data[i].ctime),
                    comment:data[i].comment,
                }
                if(data[i].blog_id == -1) {
                    obj.link = '/about.html#cur_comments';
                }else if (data[i].blog_id == -2) {
                    obj.link = '/guestbook.html#cur_comments';
                }else{
                    obj.link = '/blog_detail.html?bid='+data[i].blog_id + '#cur_comments';
                }
                res.push(obj);
            }
            this.commnet_data = res;
        },
        jump (link){
            // location.href = '/guestbook.html';
            // location.hash = '#comment_20';
            // setTimeout(function(){
            //     console.log('xxx')
            //     location.href ='#comment_20';
            // },50)
        }
    }

})

let search = new Vue({
    el:"#search",
    data:{
        search:'',
    },
    methods:{
        searchBtn: function () {
            if(this.word == '') {
                return;
            }
            console.log(this.search)
            location.href= '/?search=' + this.search;
        }
    }
})