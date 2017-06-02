/**
 * Created by liangyi on 15-10-8.
 */
$(document).ready(function(){
    getImgs();
});
function getImgs(){

  $(".jz img").mouseover(function(){
      $(".jz img").attr("src","images/jiazhi-02.png");
  });

    $(".jz img").mouseout(function(){
        $(".jz img").attr("src","images/jiazhi-01.png");
    });

    $(".linian img").mouseover(function(){
        $(".linian img").attr("src","images/linian-02.png");
    });

    $(".linian img").mouseout(function(){
        $(".linian img").attr("src","images/linian-01.png");
    });

    $(".mubiao img").mouseover(function(){
        $(".mubiao img").attr("src","images/mubiao-03.png");
    });
    $(".mubiao img").mouseout(function(){
        $(".mubiao img").attr("src","images/mubiao-01.png");
    });

}