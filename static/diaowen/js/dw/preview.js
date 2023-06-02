let token = $.cookie('BingFeng-Token');

$(document).ready(function(){
  var ctx=$("#ctx").val();
  var sid = $.getUrlParam("sid");
  var surveyId = $.getUrlParam("surveyId");
  var template = $.getUrlParam("template");
  $("#sid").val(sid);
  $("#id").val(surveyId);
  loadSurveyData(function(){
    $("#surveyList").attr("href","/#/dw/survey");
    $("#designSurvey").attr("href","/static/diaowen/design.html?surveyId="+surveyId);
    $("#dwPhone").hide();
    $("#dwPad").hide();
    var tag = $("#tag").val();
    $("#PcSurvey").attr("src","/static/diaowen/answer-p.html?surveyId="+surveyId+"&sid="+sid+"&tag="+tag);
    bindEvent();
    if(template!=null && template==="1"){
      $("#editorPreview").hide();
      $("#templatePreview").show();
    }
  });

});


function bindEvent(){
  $(".centerTabbarBtn").click(function(){
    var surveyId = $("#id").val();
    var sid = $("#sid").val();
    var tag = $("#tag").val();
    $(".centerTabbarBtn").removeClass("active");
    $(this).addClass("active");
    var thHref=$(this).attr("href");
    if(thHref==="#dwPc"){

    }else if(thHref==="#dwPad"){
      $("#PadSurvey").attr("src","/static/diaowen/answer-m.html?surveyId="+surveyId+"&sid="+sid+"&tag="+tag);
    }else if(thHref==="#dwPhone"){
      $("#PhoneSurvey").attr("src","/static/diaowen/answer-m.html?surveyId="+surveyId+"&sid="+sid+"&tag="+tag);
    }
    $(".dwPreviewBody").hide();
    $(thHref).show();
    return false;
  });
  /*预览-确认发布*/
  $("#confirgDevSuvey").click(function(){
    var ctx = $("#ctx").val();
    var surveyId = $("#id").val();
    // var url = ctx+"/design/survey-design/devSurvey.do";
    var url = ctx+"/pp/question/releaset";
    var data = "surveyId="+surveyId;
    $.ajax({
      url: url,
      headers: {
        "Authorization": "Bearer "+ token +""
      },
      data: data,
      type: "post",
      success: function (httpResult){
        if(httpResult.code===200){
          window.location.href="/pp/directory/DwAnswerUrl?surveyId="+surveyId;
        }else{
          alert(httpResult.msg);
        }
      },
      error: function(xmlHttpRequest, textStatus, errorThrown){
        // alert(xmlHttpRequest);
        if(xmlHttpRequest.status===401){
          window.location.href="/#/login";
        }else if(xmlHttpRequest.status===403){
          alert("没有发布权限");
          // window.location.href="/#/exception/403";
        }
      }
    });
  });

}

function loadSurveyData(callback){
  console.log("loadSurveyData")
  var ctx=$("#ctx").val();
  var surveyId = $("#id").val();
  // var url = ctx+"/survey/info.do";
  var url = ctx+"/pp/directory/info";
  var data = "surveyId="+surveyId;
  $.ajax({
    url:url,
    headers: {
      "Authorization": "Bearer "+ token +""
    },
    data:data,
    type:"get",
    success:function(httpResult){
      if(httpResult.code===401){
        window.location.href="/#/login";
      }
      //surveyName
      if(httpResult.code===200){
        $("#surveyName").val(httpResult.data.surveyName);
      }
      if(callback!=null){
        callback();
      }
    }
  });
}
