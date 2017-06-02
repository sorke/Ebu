/**
 * Created by liangyi on 15-9-23.
 */
//alert("正在开发中！");
var DeliveryRoute=AV.Object.extend("DeliveryRoute");
$(document).ready(function(){
    viewDeliveryRoute('main');

    if($.inArray("511",roleArray)>0)
    {
        $('#addDeRoute').attr("disabled",false);
    }
    else
    {
        $('#addDeRoute').attr("disabled",true);
    }
    editDcname();
});
var page=0;
var maincount=0;
function viewDeliveryRoute(tag){
  /*  var search=$("#searchDelivery").val();
    alert(search);*/
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
    var query=new AV.Query(DeliveryRoute);
    query.equalTo("enabled",true);
    query.include("distributionCenter");
    query.include("deliverer");
    if(tag=="main")
    {
        query.count({
            success:function(count){
                maincount=count;
            //    alert(maincount);
            }
        });
    }
    query.limit(10);
    query.skip(10*page);
  //  query.equalTo("enabled",true);
    query.find({
        success:function(object){
            var len=object.length;
            var html='<thead>'+
                '<tr>'+
                '<th>线路名称</th>'+
                '<th>所属配送中心</th>'+
                '<th>承运配送员</th>'+
                '<th>是否有效</th>';
            if($.inArray("512",roleArray)>0)
            {
               html+= '<th>编辑</th>';
            }
            if($.inArray("513",roleArray)>0)
            {
               html+= '<th>删除</th>';
            }
               html+= '</tr>'+
                '</thead>';
            for(var i=0;i<len;i++)
            {
                var routeName=object[i].get("routeName")==null?'':object[i].get("routeName");
                var distributionCenter=object[i].get("distributionCenter")==null?'':object[i].get("distributionCenter").get("dcName");
                var deliverer=object[i].get("deliverer")==null?'':object[i].get("deliverer").get("deliveryName");
                var enabled=object[i].get("enabled")==true?'有效':'失效';
                html+='<tr>' +
                    '<td>'+routeName+'</td>' +
                    '<td>'+distributionCenter+'</td>' +
                    '<td>'+deliverer+'</td>' +
                    '<td>'+enabled+'</td>' ;
                if($.inArray("512",roleArray)>0)
                {
                   html+= '<td><a href="../DeliveryRoute/DeliveryRouteAdd.html?id='+object[i].id+'">编辑</td>';
                }
                if($.inArray("513",roleArray)>0)
                {
                   html+= '<td><a href="javascript:deleteDeliveryRoute(\''+object[i].id+'\',\''+routeName+'\')">删除</td>';
                }
                   html+= '</tr>';
            }
            $("#index").html(html);
        }
    });
}

function deleteDeliveryRoute(id,name){
    if(confirm("确定要删除‘"+name+"’吗？"))
    {
        var deliveryRoute=new DeliveryRoute();
        deliveryRoute.id=id;
        deliveryRoute.set("enabled",false);
        deliveryRoute.save({
            success:function(){
                window.location.reload();
            }
        });
    }


}

function editDcname(){
    //  alert(obj.value);

    var DistributionCenter=AV.Object.extend("DistributionCenter");
    var query=new AV.Query(DistributionCenter);
    query.ascending("createdAt");
   // query.include("productType");
    query.find({
        success:function(object){

            var len=object.length;
            var html='';
            for(var i=0;i<len;i++)
            {
                    var dcName=object[i].get("dcName")==null?'':object[i].get("dcName");
                    html+='<option id='+object[i].id+'>'+dcName+'</option>';


            }
            $("#dcName").html(html);
        }
    });

}
function searchRoute(){
    var Where1=$("#dcName").val();
    var dcId=$("#dcName option:selected").attr("id");
 //   alert(Where1+dcId);
    var Where2=$("#searchDelivery").val();
    var point="DistributionCenter";
    var Strue=Boolean("true");
 //   Where1={"线路名称":'select * from DeliveryRoute where routeName=\''+Where2+'\'',"所属配送中心":"distributionCenter","承运配送员":"deliverer"}[Where1]||'';
    var select='';
    if(Where2=='')
    {
        select="select include distributionCenter,include deliverer,* from DeliveryRoute where enabled=true and distributionCenter=pointer(\'"+point+"\',\'"+dcId+"\')";
    }
    else
    {

        select="select include distributionCenter,include deliverer,* from DeliveryRoute where enabled=true and routeName like \'%"+Where2+"%\' and distributionCenter=pointer(\'"+point+"\',\'"+dcId+"\')";

    }
 //   alert(select);
   /* 'select * from DeliveryRoute where routeName=\''+Where2+'\''*/

    AV.Query.doCloudQuery(select,{
        success:function(result){

            var results=result.results;
       //     alert(results.length);
            var len=results.length;
            var html='<thead>'+
                '<tr>'+
                '<th>线路名称</th>'+
                '<th>所属配送中心</th>'+
                '<th>承运配送员</th>'+
                '<th>是否有效</th>';
            if($.inArray("512",roleArray)>0)
            {
                html+= '<th>编辑</th>';
            }
            if($.inArray("513",roleArray)>0)
            {
                html+= '<th>删除</th>';
            }
            html+= '</tr>'+
                '</thead>';
            if(len<=0)
            {
               // alert(111);
                alert("没有查找到该路线！");
            }
            else
            {
              //  alert(222);
                for(var i=0;i<len;i++)
                {
                    var routeName=results[i].get("routeName")==null?'':results[i].get("routeName");
                  //  console.log(routeName);
                    var distributionCenter=results[i].get("distributionCenter")==null?'':results[i].get("distributionCenter").get("dcName");
                 //   console.log(distributionCenter);
                    var deliverer=results[i].get("deliverer")==null?'':results[i].get("deliverer").get("deliveryName");
                //    console.log(deliverer);
                    var enabled=results[i].get("enabled")==true?'有效':'失效';
                //    console.log(enabled);
                    html+='<tr>' +
                        '<td>'+routeName+'</td>' +
                        '<td>'+distributionCenter+'</td>' +
                        '<td>'+deliverer+'</td>' +
                        '<td>'+enabled+'</td>' ;
                  //  alert(666);
                    if($.inArray("512",roleArray)>0)
                    {
                        html+= '<td><a href="../DeliveryRoute/DeliveryRouteAdd.html?id='+results[i].id+'">编辑</td>';
                    }
                    if($.inArray("513",roleArray)>0)
                    {
                        html+= '<td><a href="javascript:deleteDeliveryRoute(\''+results[i].id+'\',\''+routeName+'\')">删除</td>';
                    }
                    html+= '</tr>';

                }
                $("#index").html(html);
            }
        },error:function(obj,error){
            alert(error.message);
        }
    });
  // select * from GameScore where name like 'dennis%'
  //  select * from Comment where post in (select * from Post where image is exists)

}