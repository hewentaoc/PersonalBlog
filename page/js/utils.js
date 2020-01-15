
function getDate (timeString){
    let nowTime = timeString* 1000;
    let newdate = new Date(nowTime);
    let year = newdate.getFullYear();
    let month = newdate.getMonth()+1;
    let day = newdate.getDate();
    if(month < 10) {
        month = "0" + month;
    }
    if(day < 10) {
        day = "0" + day;
    }
    return year + "-" + month + "-" + day;
}

function getDateMore (timeString){
    let nowTime = timeString* 1000;
    let newdate = new Date(nowTime);
    let year = newdate.getFullYear();
    let month = newdate.getMonth()+1;
    let day = newdate.getDate();
    let hour = newdate.getHours();
    let minutes = newdate.getMinutes();
    if(month < 10) {
        month = "0" + month;
    }
    if(day < 10) {
        day = "0" + day;
    }
    if(hour < 10) {
        hour = "0" + hour;
    }
    if(minutes <10) {
        minutes = "0" + minutes;
    }
    return year + "-" + month + "-" + day +" "+ hour +":"+ minutes;
}

export default {
    getDate,
    getDateMore
}