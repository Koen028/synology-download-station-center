const remote = require("electron").remote;
const app = remote.app;
const api = require("./api.js");

$(function(){
  api.authAPI(function(){
    api.getList(function(data){
      var tasks = JSON.parse(data).data.tasks;
      $("#menu .count").html(tasks.length);
      $.each(tasks, function(index, value){
        var template = $("#item-template").html();
        Mustache.parse(template);
        var rendered = Mustache.render(template, tasks[index]);
        $("#content").append(rendered);
      });
    });
  });
  $(".icon-settings").click(function(){
    // TODO: Navigate to Settings page
  });
});
