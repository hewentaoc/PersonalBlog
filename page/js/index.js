import utils from './utils.js';
let every_day = new Vue({
    el:'#everyday',
    data:{
        every_day_data:""
    },
    created() {
        axios({
            method:"get",
            url:"/queryEveryDay",
        }).then(function(res){
            every_day.every_day_data = res.data.data[0].content;
        }).catch(function(error){
            console.log(error);
        }) 
    },
    computed: {
        sentence (){
            return this.every_day_data;
        }
    },
})
let bolg = new Vue({
    el:"#bolg_list",
    data:{
        cursorPage:1,
        pageSize:5,
        count:10,
        pageArr:[],
        blog_data:[]
    },
    created() {
        this.getParms();  
    },
    computed: {
        
    },
    methods: {
        getParms(){
            let params = location.search.indexOf('?') != -1 ?decodeURI(location.search).split("?")[1].split('&') : "";
            let tag = "";
            let search = "";
            if(params){
                for(let i = 0; i < params.length ;i++) {
                    if(params[i].split('=')[0] == 'tag') {
                        tag = params[i].split('=')[1];
                    }else if(params[i].split('=')[0] == 'search'){
                        search = params[i].split('=')[1];
                    }else{
                        continue;
                    }
                }
                if(tag) {
                   this.getDataByTag(tag);
                }
                if(search) {
                    console.log(search);
                  this.getSearch(search);
                }
            }else{
                this.getData(tag);
            }
        },
        getData:function (){
            let self = this;
            axios({
                method:'get',
                url:"/queryBlogByPage",
                params:{
                    cursorPage: self.cursorPage,
                    pageSize: self.pageSize,
                }
            }).then(function (result) { 
                self.count = result.data.allCount
                self.renderData(result.data.data); //渲染博客
                self.renderPaging(); //渲染分页
                self.cursorPage = 1;
            }).catch(function (error) {
                console.log(error);
            })
        },
        getDataByTag:function (tag){
            let self = this;
            axios({
                method:"get",
                url:'/queryTags',
                params:{
                    tag:tag, 
                    cursorPage: self.cursorPage,
                    pageSize: self.pageSize,
                }
            }).then(function(result){
                self.count = result.data.allCount
                self.renderData(result.data.data); //渲染博客
                self.renderPaging(); //渲染分页
                self.cursorPage = 1;
            }).catch(function(error) {
                console.log(error);
            })
        },
        getSearch:function (search) {
            let self = this;
            axios({
                method:"get",
                url:"/queryBlogBySearch",
                params:{
                    search:search,
                    cursorPage: self.cursorPage,
                    pageSize: self.pageSize,
                }
            }).then(function(result) {
                self.count = result.data.allCount
                self.renderData(result.data.data); //渲染博客
                self.renderPaging(); //渲染分页
                self.cursorPage = 1;
            })
        },
        renderData (data) {
            console.log(data)
            let result = [];
            for(let i = 0 ; i < data.length ; i++) {
                data[i].ctime = utils.getDate(data[i].ctime);
                result.push(data[i]);
            }
            this.blog_data = result;
        },
        renderPaging() {
            let allCount = this.count;
            let cursorPage = this.cursorPage;
            let pageSize = this.pageSize;
            let allPage = parseInt((allCount + pageSize - 1)/pageSize);
            let result = [];
            result.push({text:"首页", page:1})
            if(cursorPage > 2 ) {
                result.push({text:cursorPage - 2 ,page:cursorPage -2});
            }
            if(cursorPage > 1) {
                result.push({text:cursorPage - 1 ,page:cursorPage -1});
            }
            result.push({text:cursorPage, page:cursorPage});
            if(cursorPage + 1 <= allPage){
                result.push({text:cursorPage + 1 ,page:cursorPage + 1});
            }
            if(cursorPage + 2 <= allPage){
                result.push({text:cursorPage + 2 ,page:cursorPage + 2});
            }
            result.push({text:"末页", page:allPage})
            this.pageArr = result;
        },
        jumpTo(index){
            if(this.cursorPage == index) {
                return;
            }
            this.cursorPage = index;
            this.getParms();
            window.scrollTo(0,0);
        }
    }
})