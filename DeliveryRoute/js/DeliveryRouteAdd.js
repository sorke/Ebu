/**
 * Created by liangyi on 15-9-23.
 */
var DistributionCenter=AV.Object.extend("DistributionCenter");
var Delivery=AV.Object.extend("Delivery");
var DeliveryRoute=AV.Object.extend("DeliveryRoute");
var Store=AV.Object.extend("Store");
$(document).ready(function(){
    BinddistributionCenter();
});

function BinddistributionCenter(){
    var url=geturl();
  //  alert(url);
    var query=new AV.Query(DistributionCenter);
   /* query.equalTo("objectId",url);*/
    query.find({
        success:function(object){
            var len=object.length;
            var html='';
            for(var i=0;i<len;i++)
            {
                var dcName=object[i].get("dcName")==null?'':object[i].get("dcName");
                html+='<option id="'+object[i].id+'">'+dcName+'</option>';
            }
            $("#distributionCenter").html(html);

            BindDeliverer();
        }
    });

}

function BindDeliverer(){
    var url=geturl();
    var query=new AV.Query(Delivery);
    query.find({
        success:function(object){
            var len=object.length;
            var html='';
            for(var i=0;i<len;i++)
            {
                var deliveryName=object[i].get("deliveryName")==null?'':object[i].get("deliveryName");
                html+='<option id="'+object[i].id+'">'+deliveryName+'</option>';
            }
            $("#deliverer").html(html);
            if(url!=null)
            {
                BindData();
            }

        }
    });
}

function BindData(){
    var url=geturl();
    var query=new AV.Query(DeliveryRoute);
    query.equalTo("objectId",url);
    query.include("distributionCenter");
    query.include("deliverer");
    query.find({
        success:function(object){
            var routeName=object[0].get("routeName")==null?'':object[0].get("routeName");
         //   alert(routeName);
            var distributionCenter=object[0].get("distributionCenter")==null?'':object[0].get("distributionCenter").get("dcName");
            var deliverer=object[0].get("deliverer")==null?'':object[0].get("deliverer").get("deliveryName");
            var enabled=object[0].get("enabled")==true?'有效':'失效';
            $("#routeName").val(routeName);
            $("#distributionCenter").val(distributionCenter);
            $("#deliverer").val(deliverer);
            $("#enabled").val(enabled);
            var query=object[0].relation("store").query();
            query.descending("createdAt");
            query.include("storeType");
            query.include("owner");
            query.include("storeDC");
            query.include("storeRoute");
            query.find({
                success:function(object){
                    var len=object.length;
                    var html='<thead>'+
                        '<tr>'+
                        '<th>删除</th>'+
                        '<th>店铺名称</th>'+
                        '<th>业态</th>'+
                        '<th>联系方式</th>'+
                        '<th>操作人员</th>'+
                        '<th>配送中心</th>'+

                        '<th>线路</th>'+


                        '</tr>'+
                        '</thead>';
                    for(var i=0;i<len;i++)
                    {
                        var storeName=object[i].get("storeName")==null?'':object[i].get("storeName");
                        var storeType=object[i].get("storeType")==null?'':object[i].get("storeType").get("typeName");
                        var storeContact=object[i].get("storeContact")==null?'':object[i].get("storeContact");
                        var owner=object[i].get("owner")==null?'':object[i].get("owner").get("username");
                        var storeDC=object[i].get("storeDC")==null?'':object[i].get("storeDC").get("dcName");
                        var storeRoute=object[i].get("storeRoute")==null?'':object[i].get("storeRoute").get("routeName");
                        html+='<tr>' +
                            '<td><a href="javascript:removeStore(\''+object[i].id+'\')">删除</a></td>' +
                            '<td>'+storeName+'</td>' +
                            '<td>'+storeType+'</td>' +
                            '<td>'+storeContact+'</td>' +
                            '<td>'+owner+'</td>' +
                            '<td>'+storeDC+'</td>' +
                            '<td>'+storeRoute+'</td>' +

                            '</tr>';
                    }
                    $("#attach").html(html);
                }
            });

        }
    });
}
function removeStore(id){
    var url=geturl();
    if(confirm("确定要移除吗？"))
    {
        var query=new AV.Query(DeliveryRoute);
        query.equalTo("objectId",url);
        query.find({
            success:function(object){
                var storeOb=new Store();
                storeOb.id=id;
                var relation=object[0].relation("store");
                relation.remove(storeOb);
                object[0].save({
                    success:function(){
                        window.location.reload();
                    }
                });
            }
        });
    }
}
function SaveData(){
    var url=geturl();
    var deliveryRoute=new DeliveryRoute();
    if(url!=null)
    {
        deliveryRoute.set("objectId",url);

    }

    var selectIndex = document.getElementById("distributionCenter").selectedIndex;
    if(parseInt(selectIndex)>=0)
    {
        var  dcCenterId = document.getElementById("distributionCenter").options[selectIndex].id;
    }
    var dcObject=new DistributionCenter();
    dcObject.id=dcCenterId;

    deliveryRoute.set("distributionCenter",dcObject);

    var selectIndex0 = document.getElementById("deliverer").selectedIndex;
    if(parseInt(selectIndex0)>=0)
    {
        var  delivererId = document.getElementById("deliverer").options[selectIndex0].id;
    }
    var deliverer=new Delivery();
    deliverer.id=delivererId;

    deliveryRoute.set("deliverer",deliverer);

    var routeName=$("#routeName").val();
    deliveryRoute.set("routeName",routeName);

    deliveryRoute.save().then(function(object){
        var store=new Store();
        var relation=object.relation("store");
        //   var query=new AV.Query(OrderTable);
        //  var packageNos=new  Array();
        var CheckList=new Array();
        $("#restaurant tbody tr td  input[type=checkbox]").each(function(){
            if(this.checked){
                //    alert($(this).val());
                CheckList.push($(this).val());
            }
        });

        for(var i=0;i<CheckList.length;i++)
        {
            console.log(CheckList[i]);
            // alert(num[i]);
            store.id=CheckList[i];
            relation.add(store);


            //      alert(i);

        }
        object.save({
            success:function(){
             //   window.location.reload();
                if(url==null)
                {
                    alert("新增线路成功！");
                }
                else
                {
                    alert("修改线路成功！");
                }
                window.location.href="../DeliveryRoute/DeliveryRouteList.html";
            }
        });
    });


}
function viewStore(){
    var distributionCenter=new DistributionCenter();
    var dcCenter=document.getElementById("distributionCenter");
    var dcId=getIndex(dcCenter);
    var dcCenterObj=new DistributionCenter();
    dcCenterObj.id=dcId;

    var query=new AV.Query(Store);

    query.equalTo("storeDC",dcCenterObj);
    query.include("storeType");
    query.include("owner");
    query.include("storeDC");
    query.include("storeRoute");
    query.descending("createdAt");
    query.find({
        success:function(object){
            var len=object.length;
            var html='<thead>'+
                '<tr>'+
                '<th><input type="checkbox" id="checkAll"></th>'+
                '<th>店铺名称</th>'+
                '<th>业态</th>'+
                '<th>联系方式</th>'+
                '<th>操作人员</th>'+
                '<th>配送中心</th>'+

                '<th>线路</th>'+
                '<th>删除</th>'+

                '</tr>'+
                '</thead>';
            for(var i=0;i<len;i++)
            {
                var storeName=object[i].get("storeName")==null?'':object[i].get("storeName");
                var storeType=object[i].get("storeType")==null?'':object[i].get("storeType").get("typeName");
                var storeContact=object[i].get("storeContact")==null?'':object[i].get("storeContact");
                var owner=object[i].get("owner")==null?'':object[i].get("owner").get("username");
                var storeDC=object[i].get("storeDC")==null?'':object[i].get("storeDC").get("dcName");
                var storeRoute=object[i].get("storeRoute")==null?'':object[i].get("storeRoute").get("routeName");
                html+='<tr>' +
                    '<td><input type="checkbox" value="'+object[i].id+'"></td>' +
                    '<td>'+storeName+'</td>' +
                    '<td>'+storeType+'</td>' +
                    '<td>'+storeContact+'</td>' +
                    '<td>'+owner+'</td>' +
                    '<td>'+storeDC+'</td>' +
                    '<td>'+storeRoute+'</td>' +
                    '<td>删除</td>' +
                    '</tr>';
            }
            $("#restaurant").html(html);
            //    alert(object.length);
            SelectAll();
        }
    });
}
function SelectAll(){

    $("#checkAll").click(function(){
        // alert(2222);
        if(this.checked)
        {
            $("#restaurant tbody tr td  input[type=checkbox]").each(function(){

                //    alert($(this).val());
                this.checked=true;


            });
        }
        else
        {
            $("#restaurant tbody tr td  input[type=checkbox]").each(function(){

                //    alert($(this).val());
                this.checked=false;


            });
        }
    });
}
function getIndex(obj){
    var selectIndex = obj.selectedIndex;
    var id = obj.options[selectIndex].id;
    return id;
}