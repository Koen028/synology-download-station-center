const auth = require("./auth.json");

const username = auth.username;
const password = auth.password;
const baseUrl = auth.baseurl;

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
    $.get(baseUrl + "DownloadStation/task.cgi?api=SYNO.DownloadStation.Task&version=1&method=list&_sid=" + sid, function(res){
      data = res;
      if(typeof callback === "function"){
        callback(data);
      }
    });
  }
}
