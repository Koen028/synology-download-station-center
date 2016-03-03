const remote = require("electron").remote;
const app = remote.app;
const api = require("./api.js");

$(function(){

  // TODO: Add Loader Image for Authenticating
  api.authAPI(function(){
    init();
  });

  $(".icon-settings").click(function(){
    // TODO: Navigate to Settings page
    alert("Hello World!");
  });
});

function init(){
  api.tasks.getList(function(data){
    updateTasksList(data);
  });

  setInterval(function(){
    api.tasks.getList(function(data){
      updateTasksList(data);
    });
  }, 5000);

  $("body").on("click", ".play", function(){
      var taskId = $(this).parent().data("id");
      api.tasks.resume(taskId, null);
  });

  $("body").on("click", ".pause", function(){
    var taskId = $(this).parent().data("id");
    api.tasks.pause(taskId, null);
  });

  $("body").on("click", ".remove", function(){
    var taskId = $(this).parent().data("id");
    api.tasks.delete(taskId, true, null);
  });
}

function updateTasksList(data){
  var tasks = JSON.parse(data).data.tasks;
  $("#menu .count").html(tasks.length);
  // empty current list
  $("#content").empty();
  $.each(tasks, function(index, value){
    var template = $("#item-template").html();
    Mustache.parse(template);
    var rendered = Mustache.render(template, {
      id: value.id,
      title: value.title,
      progress: getProgress(value.size, value.additional.transfer.size_downloaded),
      size: humanFileSize(value.size,false),
      status: value.status
    });
    $("#content").append(rendered);
  });
}

function getProgress(size, size_downloaded){
  var progress = 0;
  if(size_downloaded > 0){
    progress = Math.ceil((size_downloaded / size) * 100);
  }
  return progress;
}

function humanFileSize(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if(Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    var units = si
        ? ['kB','MB','GB','TB','PB','EB','ZB','YB']
        : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(2)+' '+units[u];
}
