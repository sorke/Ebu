/**
 * Created by liangyi on 15-9-17.
 */
var SortingCenter=AV.Object.extend("SortingCenter");
var SortingOrder=AV.Object.extend("SortingOrder");
var DistributionCenter=AV.Object.extend("DistributionCenter");
$(document).ready(function(){
    bindScName();
    if($.inArray("611",roleArray)>=0)
    {
        $('#addSortingOrder').attr("disabled",false);
    }
    else
    {
        $('#addSortingOrder').attr("disabled",true);
    }
    $("#dtBox").DateTimePicker();
});

function bindScName(){
   // var sortingCentre=new SortingCentre();
    var currentUser = AV.User.current();
    if (currentUser) {
        var query=currentUser.relation("operableSCs").query();
        query.descending("createdAt");
        query.find({
            success:function(object){
                var len=object.length;
          //      alert(len);
                var html='';
                for(var i=0;i<len;i++)
                {
                    var scName=object[i].get("scName")==null?'':object[i].get("scName");
                    html+='<option id="'+object[i].id+'">'+scName+'</option>';
                }
                $("#scName").html(html);
            }
        }).then(function(){
            var value=document.getElementById("scName");
            bindSortingOrder("main",value);
        });
    } else {
        alert("请到页面登录！");
    }
    /*var query=new AV.Query(SortingCenter);
    query.descending("createdAt");
    query.find({
        success:function(object){
            var len=object.length;
            var html='';
            for(var i=0;i<len;i++)
            {
                var scName=object[i].get("scName")==null?'':object[i].get("scName");
                html+='<option id="'+object[i].id+'">'+scName+'</option>';
            }
            $("#scName").html(html);
        }
    }).then(function(){
        var value=document.getElementById("scName");
        bindSortingOrder("main",value);
    });*/


}

function changePage(page){
    var value=document.getElementById("scName");

    if(page=="nextpage")
    {
        bindSortingOrder("nextpage",value);
    }
    if(page=="pastpage")
    {
        bindSortingOrder("pastpage",value);
    }
}
var page=0;
var maincount=0;
function onchangeSorting(){
     page=0;
     maincount=0;
    bindSortingOrder('main');
}
function bindSortingOrder(tag){
    /*var selectIndex = obj.selectedIndex;
    var id = obj.options[selectIndex].id;*/
    var searchTime=$("#searchTime").val();
 //   alert(searchTime);
    if(tag=="nextpage")
    {

        page++;


        if(page*10>=maincount)
        {
            page--;
            alert("这已经是最后一页了！");
        }
    }
    if(tag=="pastpage")
    {
        if(page>0)
        {
            page--;

        }
        else
        {
            alert("这已经是第一页了！");
        }
    }
    /*if(obj!=null)
    {
        var scCenterOb=new DistributionCenter();
        scCenterOb.id=getIndex(obj);
    }*/
    var scId=$("#scName option:checked").attr("id");
    var scCenterOb=new DistributionCenter();
    scCenterOb.id=scId;

    var query=new AV.Query(SortingOrder);
    query.descending("createdAt");
    query.include("dcCenter");
    query.include("scCenter");
    if(searchTime!='')
    {
        //  var timeArray=searchTime.split('-');

        var today= strChangeDate(searchTime,0);
        var tomorrow= strChangeDate(searchTime,1);
        //  alert(today+tomorrow);
        query.lessThanOrEqualTo("dateTime",tomorrow);
        query.greaterThanOrEqualTo("dateTime",today);
    }

        query.equalTo("scCenter",scCenterOb);

    if(tag=="main")
    {
        query.count({
            success:function(count){
                maincount=count;
            }
        });
    }
    query.limit(10);
    query.skip(10*page);
    query.equalTo("enabled",true);
    query.find({
        success:function(object){
            var len=object.length;
         //   alert(object.length);
            var html='<thead>'+
                '<tr>'+
                '<th>查看工单</th>'+
                '<th>工单序号</th>'+
                '<th>工单ID</th>'+
                '<th>目标配送中心</th>'+
                '<th>所属分拣中心</th>'+

            //    '<th>包含箱号</th>'+
                '<th>生成时间</th>'+
                '<th>工单状态</th>';

            if($.inArray("612",roleArray)>=0)
            {
                html+=   '<th>编辑</th>';
            }
            if($.inArray("613",roleArray)>=0)
            {
                html+=   '<th>删除</th>';
            }
                html+=   '</tr>'+
                '</thead>';
            for(var i=0;i<len;i++)
            {

                        var orderNo=object[i].get("orderNo")==null?'':object[i].get("orderNo");
                        var orderID=object[i].get("orderID")==null?'':object[i].get("orderID");
                        var dcCenter=object[i].get("dcCenter")==null?'':object[i].get("dcCenter").get("dcName");
                        var scCenter=object[i].get("scCenter")==null?'':object[i].get("scCenter").get("scName");
                  //      var packageNos=object[i].get("packageNos")==null?'':object[i].get("packageNos").sort(function(a,b){return a>b?1:-1});
                        var dateTime=object[i].get("dateTime")==null?'':object[i].get("dateTime").toLocaleString();
                        /*var statu=object[i].get("statu")==null?'':object[i].get("statu");*/
              //  alert()
                        var statu={1:"新建",2:"配货中",3:"已发货",4:"配货完成"}[object[i].get('statu')]||'';
                        html+='<tr>' +
                            '<td><a href="../SortingOrder/SortingOrderAdd.html?scanid='+object[i].id+'">查看</td>'+
                            '<td>'+orderNo+'</td>' +
                            '<td>'+orderID+'</td>' +
                            '<td>'+dcCenter+'</td>' +
                            '<td>'+scCenter+'</td>' +
                         /*   '<td>'+packageNos+'</td>' +*/
                            '<td>'+dateTime+'</td>' +
                            '<td>'+statu+'</td>' ;
                if($.inArray("612",roleArray)>=0)
                {
                          html+=  '<td><a href="../SortingOrder/SortingOrderAdd.html?id='+object[i].id+'">编辑</td>';
                }
                if($.inArray("613",roleArray)>=0)
                {
                          html+=  '<td><a href="javascript:deleteSortingOrder(\''+object[i].id+'\',\''+orderNo+'\')">删除</td>';
                }
                          html+=  '</tr>';


            }
            $("#index").html(html);
        }
    });
}


function getIndex(obj){
    var selectIndex = obj.selectedIndex;
    var id = obj.options[selectIndex].id;
    return id;
}


function gotoHref(){
    var object=document.getElementById("scName");
    var id=getIndex(object);
    var value=object.value;


        window.location.href="../SortingOrder/SortingOrderAdd.html?scid="+id;

}
function deleteSortingOrder(id,orderNo){

    if(confirm("确定要删除"+orderNo))
    {
        var sortingOrder=new SortingOrder();
        sortingOrder.id=id;
        sortingOrder.set("enabled",false);
        sortingOrder.save({
            success:function(){
                window.location.reload();
            }
        });

    }
}