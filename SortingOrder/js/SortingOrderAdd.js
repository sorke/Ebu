/**
 * Created by liangyi on 15-9-17.
 */
var SortingCenter=AV.Object.extend("SortingCenter");
var SortingOrder=AV.Object.extend("SortingOrder");
var DistributionCenter=AV.Object.extend("DistributionCenter");
var OrderTable=AV.Object.extend("OrderTable");
$(document).ready(function(){
    judgeId();
    if($.inArray("614",roleArray)>=0)
    {
        $('#printSortingTable').attr("disabled",false);
    }
    else
    {
        $('#printSortingTable').attr("disabled",true);
    }

    if($.inArray("615",roleArray)>=0)
    {
        $('#printOrderTable').attr("disabled",false);
    }
    else
    {
        $('#printOrderTable').attr("disabled",true);
    }

});
function judgeId(){
    var url=geturlArry();
   /* for(var i=0;i<url.length;i++)
    {
        alert(url[i]);
    }*/
    if(url[0]=="scid")
    {
        bindSc(url[1]);
    }
    else if(url[0]=="id")
    {
        bindMainData(url[1]);
    }
    else if(url[0]=="scanid")
    {
        bindMainData(url[1]);
        $("#orderTable").css('display','none');
     //   $("#attach").css('display','none');
        $("#submit").css('display','none');
        $("#main select").css('display','none');
        $("#statu").css('display','block').attr('disabled',true);

        $("#main label").css('display','none');
        $("#searchOrder").css('display','none');
        $("#printOrderTable").css('display','none');
    }
}
function bindMainData(id){
   // alert(id);
    var url=geturlArry();
    var query=new AV.Query(SortingOrder);
    query.equalTo("objectId",id);
    query.include("dcCenter");
    query.include("scCenter");
    query.find({
        success:function(object){

            var orderNo=object[0].get("orderNo")==null?'':object[0].get("orderNo");

            var orderID=object[0].get("orderID")==null?'':object[0].get("orderID");

            var dcCenter=object[0].get("dcCenter")==null?'':object[0].get("dcCenter").get("dcName");
            dcCenter='<option id="'+object[0].get("dcCenter").id+'">'+dcCenter+'</option>';
            var scCenter=object[0].get("scCenter")==null?'':object[0].get("scCenter").get("scName");
         //   var packageNos=object[0].get("packageNos")==null?'':object[0].get("packageNos");
            var dateTime=object[0].get("dateTime")==null?'':object[0].get("dateTime").toLocaleString();
            var statu={1:"新建",2:"配货中",3:"已发货",4:"配货完成"}[object[0].get('statu')]||'';
           // alert(statu);
            $("#orderNo").val(orderNo);
            $("#orderID").val(orderID);
            $("#dcCenter").html(dcCenter);
            $("#scCenter").val(scCenter);
         //   $("#packageNos").val(packageNos.sort(function(a,b){return a>b?1:-1}));
            $("#dateTime").val(dateTime);
            $("#statu").val(statu);


            /*绑定所包含订单*/
            var query=object[0].relation("orderTables").query();
            query.include("orderUser");
            query.include("orderStore");
            query.include("orderDC");
            query.equalTo("enabled",true);
            query.descending("createdAt");
            query.find({
                success:function(object){
                    var len=object.length;
                    var html='<thead>'+
                        '<tr>';
                 //   alert(url[0]);
                    if(url[0]!="scanid")
                    {
                        html+= '<th>删除</th>';
                    }


                     html+=   '<th>订单编号</th>'+
                  //      '<th>订单用户</th>'+
                        '<th>所属配送中心</th>'+
                        '<th>订单时间</th>'+
                        '<th>订单状态</th>'+

                        '<th>订单箱号</th>'+
                        '<th>是否生效</th>'+

                        '</tr>'+
                        '</thead>';
                    for(var i=0;i<len;i++)
                    {
                        var orderID=object[i].get("orderID")==null?'':object[i].get("orderID");

                        var orderStore=object[i].get("orderStore")==null?'':object[i].get("orderStore").get("storeName");
                        var orderUser=object[i].get("orderUser")==null?'':object[i].get("orderUser").get("username");
                        var orderDC=object[i].get("orderDC")==null?'':object[i].get("orderDC").get("dcName");
                        var orderTime=object[i].get("orderTime")==null?'':object[i].get("orderTime").toLocaleString();

                        var orderStatus={1:"新建",2:"系统已确认",3:"分拣中",4:"出库录单完毕",5:"转仓调拨中",6:"到达配送站",7:"配送中",8:"已配送成功",9:"已完成"}[object[i].get('orderStatus')]||'';

                        var packageNo=object[i].get("packageNo")==null?'':object[i].get("packageNo");
                        var enabled=object[i].get("enabled")===true?"正常":"失效";
                        html+='<tr>' ;
                        if(url[0]!="scanid")
                        {
                           html+= '<td><a href="javascript:removeOrderTable(\''+object[i].id+'\')">删除</a></td>' ;
                        }
                            html+=     '<td>'+orderID+'</td>' +
                          //  '<td>'+orderUser+'</td>' +
                            '<td>'+orderDC+'</td>' +
                            '<td>'+orderTime+'</td>' +
                            '<td>'+orderStatus+'</td>' +
                            '<td>'+packageNo+'</td>' +
                            '<td>'+enabled+'</td>' +
                            '</tr>';

                    }
                    $("#attach").html(html);
                }
            });
        }
    });
}

function removeOrderTable(id){
    var url=geturlArry();
  //  alert(url[1]);
    if(confirm("确定要移除这张订单吗？")){
        var query=new AV.Query(SortingOrder);
        query.equalTo("objectId",url[1]);
        query.find({
            success:function(object){
               var relation=object[0].relation("orderTables");
                var orderTable=new OrderTable();
                orderTable.id=id;
                relation.remove(orderTable);
                object[0].save({
                    success:function(){

                    }
                }).then(function(){
                    saveSortingOrder();
                });
            }
        });
    }

}
function bindSc(id){


    var query =new AV.Query(SortingCenter);
    query.equalTo("objectId",id);
    query.find({
        success:function(object){
            //alert(object.length);
            var scName=object[0].get("scName")==null?'':object[0].get("scName");
            $("#scCenter").val(scName);

            var relation=object[0].relation("distributionCenter");
            relation.query().find({
                success:function(object){
                    var len=object.length;
                    var html='';
                    for(var i=0;i<len;i++)
                    {
                        var dcName=object[i].get("dcName")==null?'':object[i].get("dcName");
                        html+='<option id="'+object[i].id+'">'+dcName+'</option>';
                    }
                    $("#dcCenter").html(html);

                },error:function(obj,err){
                    alert(err.message);
                }
            });
        },error:function(obj,err){
            alert(err.message);
        }
    });

}

function viewOrderTable(){
  //  alert($("#judgeTime").val());
    var dcCenter=document.getElementById("dcCenter");
    var dcId=getIndex(dcCenter);
    var dcCenterObj=new DistributionCenter();
    dcCenterObj.id=dcId;
    var judgeTime=$("#judgeTime").val()==="昨日订单"?strChangeDate(new Date(),-1):strChangeDate(new Date(),0);
   // alert("昨天"+judgeTime+"今天");
    //alert(strChangeDate(new Date(),-1));
    var query=new AV.Query(OrderTable);
    query.greaterThan("orderTime",judgeTime);
    var tomorrow=strChangeDate(judgeTime,1);
//    alert("昨天"+tomorrow+"今天");
    query.lessThan("orderTime",tomorrow);
    query.equalTo("orderStatus",4);
    query.equalTo("enabled",true);
    query.equalTo("canceled",false);
    query.equalTo("orderDC",dcCenterObj);
    query.include("orderUser");
    query.include("orderStore");
    query.include("orderDC");
    query.find({
        success:function(object){
          //  alert(object.length);
                var len=object.length;
          //  alert(len);
            var html='<thead>'+
                '<tr>'+
                '<th><input type="checkbox" id="checkAll"></th>'+
                '<th>订单编号</th>'+
           /*     '<th>订单用户</th>'+*/
                '<th>所属配送中心</th>'+
                '<th>订单时间</th>'+
                '<th>订单状态</th>'+

                '<th>订单箱号</th>'+
                '<th>是否生效</th>'+

                '</tr>'+
                '</thead>';
                for(var i=0;i<len;i++)
                {
                    var orderID=object[i].get("orderID")==null?'':object[i].get("orderID");
                    var orderUser=object[i].get("orderUser")==null?'':object[i].get("orderUser").get("username");
                    var orderDC=object[i].get("orderDC")==null?'':object[i].get("orderDC").get("dcName");
                    var orderTime=object[i].get("orderTime")==null?'':object[i].get("orderTime").toLocaleString();

                    var orderStatus={1:"新建",2:"系统已确认",3:"分拣中",4:"出库录单完毕",5:"转仓调拨中",6:"到达配送站",7:"配送中",8:"已配送成功",9:"已完成"}[object[i].get('orderStatus')]||'';

                    var packageNo=object[i].get("packageNo")==null?'':object[i].get("packageNo");
                    var enabled=object[i].get("enabled")===true?"正常":"失效";
                    html+='<tr>' +
                        '<td><input type="checkbox" value="'+object[i].id+'"></td>' +
                        '<td>'+orderID+'</td>' +
                   //     '<td>'+orderUser+'</td>' +
                        '<td>'+orderDC+'</td>' +
                        '<td>'+orderTime+'</td>' +
                        '<td>'+orderStatus+'</td>' +
                        '<td>'+packageNo+'</td>' +
                        '<td>'+enabled+'</td>' +
                        '</tr>';

                }
            $("#orderTable").html(html);
           //    alert(object.length);
            SelectAll();
        }
    });
}
function getIndex(obj){
    var selectIndex = obj.selectedIndex;
    var id = obj.options[selectIndex].id;
    return id;
}
function SelectAll(){

    $("#checkAll").click(function(){
        // alert(2222);
        if(this.checked)
        {
            $("#orderTable tbody tr td  input[type=checkbox]").each(function(){

                //    alert($(this).val());
                this.checked=true;


            });
        }
        else
        {
            $("#orderTable tbody tr td  input[type=checkbox]").each(function(){

                //    alert($(this).val());
                this.checked=false;


            });
        }
    });
}
function strChangeDate(dd,AddDayCount) {

    dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = dd.getMonth();//获取当前月份的日期
    var d = dd.getDate();
    return new Date(y,m, d,0,0,0);
}



function saveSortingOrder(){
    var url=geturlArry();
    if(url[0]=="scid")
    {
        var selectIndex = document.getElementById("dcCenter").selectedIndex;
        if(parseInt(selectIndex)>=0)
        {
          var  dcCenterId = document.getElementById("dcCenter").options[selectIndex].id;
        }
        var dcObject=new DistributionCenter();
        dcObject.id=dcCenterId;

        var scObject=new SortingCenter();
        scObject.id=url[1];
        var dateTime=new Date();
    }
    else if(url[0]=="id")
    {

    }
   /* var orderNo=$("#orderNo").val();
    var orderID=$("#orderID").val();*/
    /*var packageNos=new Array();
    packageNos=$("#packageNos").val();*/

   // var statu=$("#statu").val();

    var sortingOrder=new SortingOrder();
    if(url[0]=="id")
    {
        sortingOrder.set("objectId",url[1]);
    }

    if(url[0]=="scid"){
        sortingOrder.set("dcCenter",dcObject);
        sortingOrder.set("scCenter",scObject);
        sortingOrder.set("dateTime",dateTime);
    }
    var statu={"新建":1,"配货中":2,"已发货":3,"配货完成":4}[$("#statu").val()]||'';

    sortingOrder.set("statu",parseInt(statu));
  //  sortingOrder.set("packageNos",packageNos);
    sortingOrder.save({
        success:function(){

        }
    }).then(function(object){
        var statu=object.get("statu");

        var orderTableOb=new OrderTable();
        var relation=object.relation("orderTables");
        relation.query().find({
            success:function(results){
                var rela=new Array();
                for(var i=0;i<results.length;i++)
                {
                    rela.push(results[i].id);
                    if(statu==2)
                    {
                        AV.Cloud.run('setOrderStatu',{
                            orderOids:rela,
                            statu:5
                        },{
                            success: function (result) {
                                console.log("工单状态修改中..")
                            },
                            error: function (obj,err) {
                                alert("工单状态修改失败!");
                                location.reload();
                            }
                        });
                    }
                    else if(statu==3){
                        AV.Cloud.run('setOrderStatu',{
                            orderOids:rela,
                            statu:6
                        },{
                            success: function (result) {
                                console.log("工单状态修改中..")
                            },
                            error: function (obj,err) {
                                alert("工单状态修改失败!");
                                location.reload();
                            }
                        });
                    }
                    else if(statu==4)
                    {
                        AV.Cloud.run('setOrderStatu',{
                            orderOids:rela,
                            statu:7
                        },{
                            success: function (result) {
                                console.log("工单状态修改中···")
                            },
                            error: function (obj,err) {
                                alert("工单状态修改失败!");
                                location.reload();
                            }
                        });
                    }
                }

            }
        });
     //   var query=new AV.Query(OrderTable);
      //  var packageNos=new  Array();
        var CheckList=new Array();
        $("#orderTable tbody tr td  input[type=checkbox]").each(function(){
            if(this.checked){
            //    alert($(this).val());
                CheckList.push($(this).val());
            }
        });

        for(var i=0;i<CheckList.length;i++)
        {
            console.log(CheckList[i]);
            // alert(num[i]);
            orderTableOb.id=CheckList[i];
            relation.add(orderTableOb);


            //      alert(i);

        }
     //   alert(CheckList);

            object.save({
                success:function(obj){
                    savePackageNos(obj.id);
                    /*if(url[0]=="scid")
                    {
                        alert("添加成功！");
                        window.location.href="../SortingOrder/SortingOrderList.html"
                    }
                    else if(url[0]=="id")
                    {
                        alert("更新成功！");
                        window.location.reload();
                    }*/
                }
            });




    });
}
function savePackageNos(id){
    var url=geturlArry();
    var query=new AV.Query(SortingOrder);

    query.equalTo("objectId",id);
    query.include("scCenter");
    query.find({
        success:function(object){
          //  alert(2222);
            var scID=object[0].get("scCenter")==null?'':object[0].get("scCenter").get("scID");
          //  console.log(scID);
            var orderNo=object[0].get("orderNo");
            var orderID=scID+orderNo;
            if(url[0]=="scid")
            {
                object[0].set("orderID",orderID);
            }

            object[0].save({
                success:function(){
                    if(url[0]=="scid")
                    {
                        alert("添加成功！");
                        window.location.href="../SortingOrder/SortingOrderList.html"
                    }
                    else if(url[0]=="id")
                    {
                        alert("更新成功！");
                        window.location.reload();
                    }


                },error:function(obje,err){
                    alert(err.message);
                }
            });
           /* console.log(orderID);
            var packageNos=new Array();
            var relation=object[0].relation("orderTables");
            relation.query().find({
                success:function(obj){
                   var len=obj.length;
                    for(var i=0;i<len;i++)
                    {
                       var orderPackage=obj[i].get("packageNo") ==null?'':obj[i].get("packageNo");

                        if(orderPackage!='')
                        {
                            for(var j=0;j<orderPackage.length;j++)
                            {
                           //     alert(orderPackage[j]);
                                packageNos.push(orderPackage[j]);
                            }

                        }
                    }


                }
            }).then(function(){
             //   alert(packageNos.length);
                object[0].set("packageNos",packageNos);
                if(url[0]=="scid")
                {
                    object[0].set("orderID",orderID);
                }

                object[0].save({
                    success:function(){
                        if(url[0]=="scid")
                        {
                            alert("添加成功！");
                            window.location.href="../SortingOrder/SortingOrderList.html"
                        }
                        else if(url[0]=="id")
                        {
                            alert("更新成功！");
                            window.location.reload();
                        }


                    },error:function(obje,err){
                        alert(err.message);
                    }
                });
            });*/
        }
    });
}
function geta(){
    var CheckList=new Array();
    $("#storeType p input[type=checkbox]").each(function(){
        if(this.checked){
            CheckList.push($(this).val());
        }
    });
}
function getFullDate(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour=date.getHours();
    var minute=date.getMinutes();
    var second=date.getSeconds();
    return year + "-" + month + "-" + day+" "+hour+":"+minute+":"+second;
}
function getHM(date) {
    return date.getHours()+":"+date.getMinutes();
}
function printOrderTable(){
   var url=geturlArry();
  //  alert(url[0]);
    if(url[0]=='id'||url[0]=='scanid')
    {
        var query=new AV.Query(SortingOrder);
        query.equalTo("objectId",url[1]);
        query.find({
            success:function(object){
                var relation=object[0].relation("orderTables");
                relation.query().find({
                    success:function(object){
                        var orderArray=new Array();
                        for(var i=0;i<object.length;i++)
                        {
                            orderArray.push(object[i].id);
                        }
                        console.log(orderArray+orderArray.length);

                        bindPrint(orderArray);



                    }
                });
            }
        });
    }
    else
    {
        alert("未生成工单不能打印！");
    }

   // bindPrint();
}
var Detailcount=0;
var flag0=0;
function printSortingOrder(){
    var url=geturlArry();
    if(url[0]=="id"||url[0]=='scanid')
    {
        var query=new AV.Query(SortingOrder);
        query.equalTo("objectId",url[1]);
        query.include("scCenter");
        query.include("dcCenter");
        query.find({
            success:function(object){
              //  var len=object.length;
              //  var packageNo=new Array();
                var dateTime=object[0].get("dateTime")==null?'':object[0].get("dateTime").toLocaleString();
                var printTime=new Date().toLocaleString();
                var scName=object[0].get("scCenter")==null?'':'('+object[0].get("scCenter").get("scName")+')';
                var dcCenter=object[0].get("dcCenter")==null?'':'('+object[0].get("dcCenter").get("dcName")+')';
              //  var packageNo=object[0].get("packageNos")==null?'':object[0].get("packageNos").sort(function(a,b){return a>b?1:-1});

             //   alert(packageNo.toString());
            //    $("#printKeyNo").html(packageNo.toString());
                $("#pdateTime").html(dateTime);
                $("#pnewdate").html(printTime);
                $("#scName").html(scName);
                $("#mudcCenter").html(dcCenter);
                var html='<thead>'+
                    '<tr>'+
                    '<th>#</th>'+
                    '<th>订单编号</th>'+
                    '<th>箱数</th>'+
                    '<th>#</th>'+
                    '<th>订单编号</th>'+
                    '<th>箱数</th>'+
                    '<th>#</th>'+
                    '<th>订单编号</th>'+
                    '<th>箱数</th>'+
                    '</tr>'+
                    '</thead>';
                var queryOrder=object[0].relation("orderTables").query();
                queryOrder.descending("createdAt");
                queryOrder.find({
                    success:function(obj){
                        var len=obj.length;
                     //   alert(len);

                        for(var i=0;i<len;i+=3)
                        {
                          //  alert(parseInt(i+1));

                            var orderID0=obj[i].get("orderID")==null?'':obj[i].get("orderID");
                            var packageNo0=obj[i].get("packageNo")==null?'':'['+obj[i].get("packageNo")+']';
                            var orderID1='';
                            var packageNo1='';
                            var orderID2='';
                            var packageNo2='';
                            if(i+2<len)
                            {
                                orderID1=obj[parseInt(i+1)].get("orderID")==null?'':obj[parseInt(i+1)].get("orderID");
                                packageNo1=obj[parseInt(i+1)].get("packageNo")==null?'':'['+obj[parseInt(i+1)].get("packageNo")+']';

                                orderID2=obj[parseInt(i+2)].get("orderID")==null?'':obj[parseInt(i+2)].get("orderID");
                                packageNo2=obj[parseInt(i+2)].get("packageNo")==null?'':'['+obj[parseInt(i+2)].get("packageNo")+']';

                            }
                            else if(i+1<len)
                            {

                                orderID1=obj[parseInt(i+1)].get("orderID")==null?'':obj[parseInt(i+1)].get("orderID");
                                packageNo1=obj[parseInt(i+1)].get("packageNo")==null?'':'['+obj[parseInt(i+1)].get("packageNo")+']';

                            }

                            /* $("#print").append('<tr><td>'+i+'</td><td>'+orderID0+'</td><td>'+packageNo0+'</td><td>'+i+1+'</td><td>'+orderID1+'</td>' +
                                '<td>'+packageNo1+'</td><td>'+i+2+'</td><td>'+orderID2+'</td><td>'+packageNo2+'</td></tr>');
                            */
                           // alert(555);
                            html+='<tr>' +
                                '<td>'+parseInt(i+1)+'</td>'+
                                '<td>'+orderID0+'</td>'+
                                '<td>'+packageNo0+'</td>'+
                                '<td>'+parseInt(i+2)+'</td>'+
                                '<td>'+orderID1+'</td>'+
                                '<td>'+packageNo1+'</td>'+
                                '<td>'+parseInt(i+3)+'</td>'+
                                '<td>'+orderID2+'</td>'+
                                '<td>'+packageNo2+'</td>'+
                                '</tr>';
                        }
                        document.getElementById("print").innerHTML=html;
                        var str='';
                        for(var a=0;a<len;a++)
                        {
                            var query=obj[a].relation("orderDetail").query();
                            query.include("orderDetailProductName");
                            query.descending("createdAt");
                          //  query.equalTo("orderDetailProductName.isIndividualPackage",true);
                            query.find({
                                success:function(result){
                                    flag0++;
                                 //   alert(result.length);

                                    for(var i=0;i<result.length;i++)
                                    {


                                        if(result[i].get("orderDetailProductName")!=null)
                                        {
                                            if(result[i].get("orderDetailProductName").get("isIndividualPackage")==true)
                                            {
                                                Detailcount++;
                                                str+='<td>'+Detailcount+'</td>'+
                                                    '<td>'+result[i].get("orderDetailProductName").get("productName")+'</td>'+
                                                    '<td>'+result[i].get("orderDetailProductCount")+'</td>';
                                            }
                                            else
                                            {
                                               // alert(2);
                                            }
                                        }
                                        else
                                        {
                                            alert("未正确绑定到订单细节！");
                                        }
                                        if(Detailcount%3==0)
                                        {
                                           // var htstr='<tr>'+str+'</tr>';
                                            $("#orderDetail tbody").append('<tr>'+str+'</tr>');
                                             str='';
                                        }

                                        if(flag0==len&&i==result.length-1)
                                        {
                                            if(Detailcount%3!=0)
                                            {
                                            //    var htstr='<tr>'+str+'</tr>';
                                                $("#orderDetail tbody").append('<tr>'+str+'</tr>');
                                                str='';
                                            }
                                        }

                                    }
                                 //   alert(flag);
                                    if(flag0==len)
                                    {
                                     //   alert(flag);
                                        document.body.innerHTML=document.getElementById("printDiv").innerHTML;
                                        window.print();
                                    }

                                }
                            });
                        }


                    }
                }).then(function(){});


            }
        }).then(function(){

        });

    }
    else
    {
        alert("未生成工单不能打印！");
    }


  //  window.print();

}

function bindPrint(idArray) {

    var flag = 0;
    var spans = $('#printOrder').find('span');
    var OrderTable = AV.Object.extend('OrderTable');
    var query = new AV.Query(OrderTable);
    query.include('orderStore');
    query.include('orderUser');
    query.include('orderSC');
    query.include('orderDC');
    query.include('orderDeliveryRoute');
    query.include('orderDelivery');
    for (var a = 0; a < idArray.length; a++) {
        query.get(idArray[a], {
            success: function (obj) {
                var relation = obj.relation('orderDetail');
                var query1 = relation.query();
                query1.include('orderDetailProductName');
                query1.ascending('orderNumber');
                query1.find().then(function (result) {

                    var productHtml = "";
                    for (var i = 0; i < result.length; i++) {
                        productHtml += "<tr><td>" + (i + 1) + "</td><td>" + result[i].get('orderDetailProductName').get('productID') + "</td><td>" + result[i].get('orderDetailProductName').get('productName') + "</td><td>" + result[i].get('orderDetailProductCount') + result[i].get('orderDetailProductName').get('packageString') + "</td><td>" + result[i].get('realUnit') + result[i].get('orderDetailProductName').get('unitString') + "</td><td>" + result[i].get('orderDetailProductName').get('unitPrice') + "元/" + result[i].get('orderDetailProductName').get('unitString') + "</td><td>" + result[i].get('realPrice') + "</td></tr>";
                    }
                    $('#printOrder').find('table').eq(1).find('tbody').eq(0).html(productHtml);
                    return result;
                }).then(function () {
                    spans[0].innerHTML = obj.get('orderID');
                    spans[1].innerHTML = obj.get('orderSC') == null ? "无效订单" : obj.get('orderSC').get('scName');
                    spans[2].innerHTML = obj.get('packageNo') || " ";
                    if($.inArray("115",roleArray)>=0) {
                        spans[3].innerHTML = obj.get('orderStore') == null ? "未找到" : obj.get('orderStore').get('storeName');
                        spans[8].innerHTML = obj.get('orderStore') == null ? "未找到" : (obj.get('orderStore').get('contactName')||" ") + "(" + obj.get('orderStore').get('storeContact') + ")";
                        spans[11].innerHTML = obj.get('orderStore') == null ? "未找到" : obj.get('orderStore').get('storeAddress');
                    }
                    spans[4].innerHTML = obj.get('orderDeliveryRoute') == null ? "未找到" : obj.get('orderDeliveryRoute').get('routeName');
                    spans[5].innerHTML = obj.get('orderDC') == null ? "未找到" : obj.get('orderDC').get('dcName');
                    spans[6].innerHTML = obj.get('orderStore') == null ? "未找到" : getHM(obj.get('orderStore').get('earlyTime'));
                    spans[7].innerHTML = obj.get('orderStore') == null ? "未找到" : getHM(obj.get('orderStore').get('latestTime'));
                    spans[9].innerHTML = obj.get('orderDelivery') == null ? "未找到" : obj.get('orderDelivery').get('deliveryName') + "(" + obj.get('orderDelivery').get('deliveryPhone') + ")";
                    spans[10].innerHTML = getFullDate(obj.get('orderTime'));
                    spans[12].innerHTML = getFullDate(new Date());
                    spans[13].innerHTML = obj.get('remark') || " ";
                    spans[14].innerHTML = obj.get('orderSumPrice') + "元";
                    spans[22].innerHTML=obj.get('paymentTerm')&&(obj.get('paymentTerm')==1?"在线支付":"货到付款")||"货到付款";
                    $('#printContent').append("<div style='page-break-before: always'>" + $('#printOrder').html() + "</div>");
                    flag++;
                }).then(function () {
                    if (flag == idArray.length) {
                        $("#artwl_mask").hide();
                        AV.Cloud.run('setOrderStatu',{
                            "orderOids":idArray,
                            "statu":3
                        },{
                            success: function (result) {
                                console.log("所有订单分拣中..")
                            },
                            error: function (obj,err) {
                                alert("订单状态修改失败!");
                                location.reload();
                            }
                        });
                        $('#printContent').find('div').eq(0).removeAttr('style');
                        document.body.innerHTML = document.getElementById('printContent').innerHTML;
                        window.print();

                    }
                });
            }});
    }
}
