const username = "Koen";
const password = "Mainframe08!";
const baseUrl = "http://rackoen.com:5000/webapi/";

var sid = null;

module.exports = {
  authAPI: function(callback){
    $.get(baseUrl + "auth.cgi?api=SYNO.API.Auth&version=2&method=login&account=" + username + "&passwd=" + password + "&session=DownloadStation&format=sid", function(res) {
      var json = JSON.parse(res);
      sid = json.data.sid;
      if(typeof callback === "function"){
        callback();
      }
    });
  },
  getSID: function(){
    return sid
  },
  getList: function(callback){
    var data = null;
    $.get(baseUrl + "/DownloadStation/task.cgi?api=SYNO.DownloadStation.Task&version=1&method=list&_sid=" + sid, function(res){
      data = res;
      if(typeof callback === "function"){
        callback(data);
      }
    });
  }
}
