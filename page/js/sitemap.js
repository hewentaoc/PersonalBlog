let articles = new Vue({
    el:"#articles",
    data:{
        articlesList:[],
    },
    created() {
        this.getData();
    },
    methods: {
        getData(){
            let self = this;
            axios({
                method:"get",
                url:"/queryAllBlog"
            }).then(function(result){
                console.log(result)
                let res = [];
                let data = result.data.data;
                for (let i = 0 ; i < data.length ; i++) {
                    res.push({title:data[i].title,link:'/blog_detail.html?bid='+data[i].id});
                }
                self.articlesList = res;
            }).catch(function(error) {
                console.log(error);
            })
        }
    },
})