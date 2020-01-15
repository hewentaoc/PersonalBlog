
let otags = document.getElementsByClassName('tags')[0];
let ochose = document.getElementsByClassName('chose')[0];
let otags_empty = document.getElementsByClassName('tags_empty')[0];
let osubmit = document.getElementsByClassName('submit')[0];
let oinp_title = document.getElementsByClassName('inp_title')[0];
let tagsArr = [];

// 添加标签
otags.onclick = function(e){
    if(e.target.nodeName == 'LI'){
        if(tagsArr.indexOf(e.target.innerText) != -1){
            return;
        }
        let oli = document.createElement('li');
        oli.innerText = e.target.innerText;
        tagsArr.push( e.target.innerText);
        ochose.appendChild(oli);
    }
}
otags_empty.onclick = function () { 
    tagsArr = [];
    ochose.innerHTML = "";
}

osubmit.onclick = function(){
    if(oinp_title.value == "" || tagsArr.length == 0 ||editor.txt.html() == '<p><br></p>'){
        alert('请把博客信息填写完整!');
        return ;
    }else{
        let tagsStr = tagsArr.join();
        axios({
            method:"post",
            url:"/insertBlog?title="+oinp_title.value+"&tags="+tagsStr,
            data: editor.txt.html(),
        }).then(function(result){
            console.log(result);
            alert(result.data.msg);
            editor.txt.html("")
            oinp_title.value = "";
            tagsArr = [];
            ochose.innerHTML = "";
        })
    }
}