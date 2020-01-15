
 function getPageParams(cursorPage , pageSize , count){
     let offset = (cursorPage - 1) * pageSize;
     let limit = pageSize;
     let allPage = parseInt((count + pageSize - 1)/pageSize);
     if(allPage == cursorPage){
         if(count % pageSize != 0 ) {
             limit = count % pageSize;
         }
     }
     return {
         offset,
         limit:parseInt(limit),
     }
 }

 module.exports.getPageParams = getPageParams;