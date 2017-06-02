/**
 * Created by caonima on 2015/9/10.
 */
/**
 * Created by caonima on 2015/9/2.
 */
$(document).ready(function () {
    bindOrderSC();
    bindOrderDC();
    setTimeout(function () {
        var user = AV.User.current();
        var role = user.get('role');
        role.fetch({
            success: function (obj) {
                if ($.inArray("115", obj.get('power')) >= 0) {
                    $('#newOrder').show();
                    $('#detailBtn').show();
                    $('#deleteBtn').show();
                    $('#orderStore').show();
                    $('#orderUser').show();
                    orderData("main", 115);
                    $("#paidQuery").click(function () {
                        orderData("",115);
                    });
                    $("#paid").click(function () {
                        orderData("",115);
                    });
                    $('#queryBtn').click(function () {
                        orderData('main', 115);
                    });
                    $("#canceledOrder").click(function () {
                        orderData("", 115);
                    });
                    $("#perPageNum").change(function () {
                        orderData("main", 115);
                    });
                }
                else {
                    orderData("main");
                    $('#queryBtn').click(function () {
                        orderData('main');
                    });
                    $("#paidQuery").click(function () {
                        orderData();
                    });
                    $("#paid").click(function () {
                        orderData();
                    });
                    $("#canceledOrder").click(function () {
                        orderData();
                    });
                    $("#perPageNum").change(function () {
                        orderData("main");
                    });
                }
            }
        });
        $('#dtBox').DateTimePicker();
    },200);
});
var PrintOrderDetail=AV.Object.extend("OrderDetail");
var printOrderDetail=new AV.Query(PrintOrderDetail);
var skipNum=1;
var codeHtml='';
function QueryOrderDetail(query){
    if($('#datePicker').val()=='')
    {
        alert("请选择时间！");
    }
    else
    {
        query.include("orderDetailProductName");
        query.descending("orderDetailProductName");
        query.include("order");
        query.lessThan("orderTime",strChangeDate($('#datePicker').val(),1));
        query.greaterThan("orderTime",strChangeDate($('#datePicker').val(),0));
        query.limit(1000);
        query.find({
            success:function(object){
                var len=object.length;
                for(var i=0;i<len;i++)
                {
                    var productName=object[i].get("orderDetailProductName")==null?"":object[i].get("orderDetailProductName").get("productName");

                    var unitstring=object[i].get("orderDetailProductName")==null?"":object[i].get("orderDetailProductName").get("unitString");
                    var count=object[i].get("realUnit")==null?"":object[i].get("realUnit");
                    var orderID=object[i].get("order")==null?"":object[i].get("order").get("orderID");
                    if(orderID==null){
                        orderID='';
                    }
                    else
                    {
                        orderID=orderID.toString().substring(8);
                    }
                    var inDay=object[i].get("order")==null?"88":object[i].get("order").get("numberInDay");
                    //  console.log(productName+unitstring+count+orderID+inDay);

                    //   console.log(productName+unitstring+count);
                    if(len<1000&&i==len-1)
                    {
                        codeHtml+=  '<div class="printCode" style="font-size: 1px;margin: 1px;padding: 0 5px;padding-left: 12px;page-break-after: always;">'+
                            '<div style="text-align: center;border-bottom: 1px solid;margin: 0">'+
                            '壹步网'+
                            '</div>'+
                            '<p style="margin-top: 0">'+productName+'</p>'+
                            '<p style="padding: 0;height:37px;line-height: 37px"><lable style="">'+'编号:'+'</lable><label style="padding:0;margin:0;  font-size: 55px;display:inline-block;height:37px;line-height: 37px;margin-left: 30px">'+inDay+'</lable></p>'+
                            '<p style="">规格:<label style="margin-top: 7px">'+count+unitstring+'</lable><lable style="margin-left: 50px;">'+orderID+'</lable></p>'+
                            '</div>';
                    }
                    else
                    {
                        codeHtml+=  '<div class="printCode" style="font-size: 1px;margin: 1px;padding: 0 5px;padding-left: 12px">'+

                            '<div style="text-align: center;border-bottom: 1px solid;margin: 0">'+
                            '壹步网'+

                            '</div>'+


                            '<p style="margin-top: 0">'+productName+'</p>'+
                            '<p style="padding: 0;height:37px;line-height: 37px"><lable style="">'+'编号:'+'</lable><label style="padding:0;margin:0;  font-size: 55px;display:inline-block;height:37px;line-height: 37px;margin-left: 30px">'+inDay+'</lable></p>'+
                            '<p style="">规格:<label style="margin-top: 7px">'+count+unitstring+'</lable><lable style="margin-left: 50px;">'+orderID+'</lable></p>'+








                            '</div>';
                    }
                }
                //    console.log(codeHtml);
                //   alert("长度"+object.length+"len"+len+"i"+i);
                if(object.length<1000&&i==len)
                {

                    $("#printCodeDiv").html(codeHtml);
                    document.body.innerHTML=document.getElementById("printCodeDiv").innerHTML;
                    $("body").css("padding-top","0px");
                    window.print();
                }
                if(object.length==1000)
                {
                    query.skip(1000*skipNum);
                    skipNum=skipNum+1;
                    QueryOrderDetail(query);
                }
            }
        });
    }

}
function pintCode1(){
    QueryOrderDetail(printOrderDetail);
   /* var OrderDetail=AV.Object.extend("OrderDetail");
    var query=new AV.Query(OrderDetail);
    query.include("orderDetailProductName");
    query.descending("orderDetailProductName");
    query.limit(1000);

    query.skip(1000);
    query.find({
        success:function(object){
            var len=object.length;
            alert(len);
            for(var i=0;i<len;i++)
            {

                console.log(object[i].get("orderDetailProductName").get("productName"));
            }
        }
    });*/
}
function p(){



            document.body.innerHTML=document.getElementById("printCodeDiv").innerHTML;
            $("body").css("padding-top","0px");
            window.print();



}

function printCode(){
    var orderTable = AV.Object.extend("OrderTable");
   // var startDate= changeDate($('#datePicker').val(),0);
    var date=strChangeDate($('#datePicker').val());

   /* var startDate= changeDate($('#datePicker').val(),0);
   // var endDate=changeDate($('#datePicker').val()),1);
    alert(date);*/
    if($('#datePicker').val()=='')
    {


    }
    else
    {
        var dateQuery=new AV.Query(orderTable);
        dateQuery.lessThan("orderTime",strChangeDate($('#datePicker').val(),1));
        dateQuery.greaterThan("orderTime",strChangeDate($('#datePicker').val(),0));
        dateQuery.find({
            success:function(object){
                var len=object.length;
                var flag=0;
                var html='';
                var orderId=new Array();
                for(var i=0;i<len;i++)
                {

                  //  alert(object[i].get('numberInDay'));
                    orderId[i]=object[i].get('numberInDay')==null?"88":object[i].get('numberInDay');
                    var relationquery=object[i].relation("orderDetail").query();

                    (function(i){
                        relationquery.include("orderDetailProductName");
                        relationquery.find({
                            success:function(obj){

                                flag++;
                                for(var j=0;j<obj.length;j++)
                                {

                                    var productName=obj[j].get("orderDetailProductName")==null?"":obj[j].get("orderDetailProductName").get("productName");
                                    var unitstring=obj[j].get("orderDetailProductName")==null?"":obj[j].get("orderDetailProductName").get("unitString");
                                    var count=obj[j].get("realUnit")==null?"":obj[j].get("realUnit");
                                    if(flag==len&&j==obj.length-1)
                                    {
                                        html+='<div style="text-align: center;margin-top: 2px;padding: 10px;font-size: 15px">' +
                                            '<lable style="float: right">'+  productName+'</lable>'+'<br>'+

                                            '<lable style="display: block;font-size: 30px">'+   orderId[i]+'</lable>'+
                                            '<lable style="float: left">'+  count+unitstring+'</lable>'+
                                            '</div>';
                                    }
                                    else
                                    {
                                        html+='<div style="text-align: center;page-break-after: always;margin-top: 2px;padding: 10px;font-size: 15px">' +
                                            '<lable style="float: right">'+  productName+'</lable>'+'<br>'+

                                            '<lable style="display: block;font-size: 30px">'+   orderId[i]+'</lable>'+
                                            '<lable style="float: left">'+  count+unitstring+'</lable>'+
                                            '</div>';
                                    }

                                }
                                if(flag==len)
                                {
                                    $("#printCodeDiv").html(html);
                                    document.body.innerHTML=document.getElementById("printCodeDiv").innerHTML;
                                    $("body").css("padding-top","0px");
                                    window.print();
                                }

                            }
                        })})(i);
                }
            }
        });
    }


    var idArray=new Array();
    $("input[name='order']").each(function (i, d) {
        if (d.checked) {
            idArray.push(d.value);
        }
    });
    if(idArray.length>0)
    {

        var query = new AV.Query(orderTable);
        var html='';
        var flag=0;
        for(var i=0;i<idArray.length;i++)
        {
            flag++;
            query.equalTo("objectId",idArray[i]);
            query.find({
                success:function(object){

                    var orderId=object[0].get('numberInDay')==null?"88":object[0].get('numberInDay');
               //     orderId[i]=object[i].get('numberInDay')==null?"88":object[i].get('numberInDay');

                    var relationquery=object[0].relation("orderDetail").query();
                    relationquery.include("orderDetailProductName");
                    relationquery.find({
                        success:function(obj){
                            for(var j=0;j<obj.length;j++)
                            {

                                var productName=obj[j].get("orderDetailProductName")==null?"":obj[j].get("orderDetailProductName").get("productName");
                                var unitstring=obj[j].get("orderDetailProductName")==null?"":obj[j].get("orderDetailProductName").get("unitString");
                                var count=obj[j].get("realUnit")==null?"":obj[j].get("realUnit");
                                if(flag==idArray.length&&j==obj.length-1)
                                {
                                    html+='<div style="text-align: center;margin-top: 2px;padding: 10px;font-size: 15px">' +
                                        '<lable style="float: right">'+  productName+'</lable>'+'<br>'+

                                        '<lable style="display: block;font-size: 30px">'+   orderId+'</lable>'+
                                        '<lable style="float: left">'+  count+unitstring+'</lable>'+
                                        '</div>';
                                }
                                else
                                {
                                    html+='<div style="text-align: center;page-break-after: always;margin-top: 2px;padding: 10px;font-size: 15px">' +
                                        '<lable style="float: right">'+  productName+'</lable>'+'<br>'+

                                        '<lable style="display: block;font-size: 30px">'+   orderId+'</lable>'+
                                        '<lable style="float: left">'+  count+unitstring+'</lable>'+
                                        '</div>';
                                }

                            }
                            if(flag==idArray.length)
                            {
                                $("#printCodeDiv").html(html);
                                document.body.innerHTML=document.getElementById("printCodeDiv").innerHTML;
                                $("body").css("padding-top","0px");
                                window.print();
                            }

                        }
                    });

                }
            });
        }

    }
}
var page=0;
var maincount=0;
function pager(tag) {
    if(tag=="nextpage"){
        page++;
        if(page*10>=maincount){
            page--;
            alert("已经是最后一页了!")
        }
        else{
            $('#orderContent tbody').remove();
            if($.inArray("115",roleArray)>=0){
                orderData("",115);
            }
            else{
                orderData();
            }

        }
    }
    if(tag=="pastpage"){
        if(page>0){
            $('#orderContent tbody').remove();
            page--;
            $('#orderContent tbody').remove();
            if($.inArray("115",roleArray)>=0){
                orderData("",115);
            }
            else{
                orderData();
            }

        }
        else{
            alert("已经是第一页了!");
        }
    }
}
function changeDate(str) {
    var arr=str.split(/-/);
    return new Date(arr[2],arr[1]-1,arr[0],0,0,0);
}

function orderData(tag,power) {
    var startDate = $('#dateInput').val() && changeDate($('#dateInput').val()) || new Date(2015, 0, 1, 0, 0, 0);
    var endDate = $('#dateInput2').val() && strChangeDate($('#dateInput2').val(),1) || new Date();
    if(changeDate($('#dateInput').val())>changeDate($('#dateInput2').val())){
        alert("起始时间不能大于结束时间,请重新选择!");
    }
    else {
        $('#orderContent tbody').remove();
        var orderTable = AV.Object.extend("OrderTable");
        var query = new AV.Query(orderTable);
        if($("#paidQuery").is(":checked")){
            var query1 = new AV.Query("OrderTable");
            query1.equalTo("paid", true);

            var query2 = new AV.Query("OrderTable");
            query2.equalTo("paid", false);
            query2.equalTo("paymentTerm",2)
            query = AV.Query.or(query1, query2);
        }
        if($("#paid").is(":checked")){
            query.equalTo("paid",true);
        }
        if($("#canceledOrder").is(':checked')){
        }
        else{
            query.equalTo("canceled",false);
        }
        query.include("orderUser");
        query.include("orderStore");
        query.include("orderDC");
        query.include("orderSC");
        query.equalTo("enabled",true);
        query.descending("orderTime");
        query.greaterThan("orderTime", startDate);
        query.lessThan("orderTime", endDate);
        query.containedIn("orderSC",scArray);
        query.containedIn("orderDC",dcArray);
        if ($('#orderStatus').val() != '') {
            query.equalTo("orderStatus", parseInt($('#orderStatus').val()));
        }
        if($('#orderSC').val()!='') {
            var SC = AV.Object.extend('SortingCenter');
            var sc = new SC();
            sc.id = $('#orderSC option:selected').attr('id');
            query.equalTo("orderSC", sc);
        }
         if($('#orderDC').val()!='') {
             var DC = AV.Object.extend('DistributionCenter');
             var dc = new DC();
             dc.id = $('#orderDC option:selected').attr('id');
             query.equalTo("orderDC", dc);
         }
        if($('#orderID').val()!='') {
            query.equalTo("orderID", $('#orderID').val());
        }
        if($('#storeNumber').val()!='') {
            var innerQuery=new AV.Query('Store');
            innerQuery.equalTo("storeNumber",parseInt($('#storeNumber').val()));
            query.matchesQuery("orderStore",innerQuery);
        }

        if (tag == "main") {
            query.count({
                success: function (count) {
                    maincount = count;
                }
            });
        }
        query.limit($('#perPageNum').val());
        query.skip($('#perPageNum').val() * page);
        query.find({
            success: function (result) {
                for (var i = 0; i < result.length; i++) {
                    var status={1:"新建",2:"系统已确认",3:"分拣中",4:"出库录单完毕",5:"出库准备",6:"转仓调拨中",7:"到达配送站",8:"配送中",9:"已配送成功",10:"已完成"}[result[i].get('orderStatus')]||'error';
                    var sumPrice=result[i].get('orderSumPrice').toFixed(2)||0;
                    var store=result[i].get('orderStore')==null?" ":result[i].get('orderStore').get('storeName');
                    var user=result[i].get('orderUser')==null?" ":result[i].get('orderUser').get('username');
                    var sc=result[i].get('orderSC')==null?" ":result[i].get('orderSC').get('scName');
                    var dc=result[i].get('orderDC')==null?" ":result[i].get('orderDC').get('dcName');
                    var paid=result[i].get('paid')==false?"":"已支付";
                    var paymentTerm="货到付款";
                    if(result[i].get('paymentTerm') !=null) {
                        paymentTerm = result[i].get('paymentTerm') == 1 ?"在线支付":"货到付款";
                    }
                    var canceled=result[i].get('canceled')==true?"已取消":"";
                    if(power==115) {
                        $('#orderContent').append("<tbody><tr><td><input name='order' value=" + result[i].id + " type='checkbox'></td><td><a href='check.html?order=" + result[i].id + "'>查看</a>|<a href='check.html?order=" + result[i].id + "&edit=true'>编辑</a></td><td>" + result[i].get('orderID') + "</td><td>" + store + "</td><td>" + user + "</td><td>" + dateStr(result[i].get('orderTime')) + "</td><td>" + sumPrice + " 元" + "</td><td>" + dc + "</td><td>" + sc + "</td><td>"+paid+"</td><td>"+paymentTerm+"</td><td>"+ canceled +"</td><td>" + status + "</td></tr></tbody>");
                    }
                    else{
                        $('#orderContent').append("<tbody><tr><td><input name='order' value=" + result[i].id + " type='checkbox'></td><td><a href='check.html?order=" + result[i].id + "'>查看</a>|<a href='check.html?order=" + result[i].id + "&edit=true'>编辑</a></td><td>" + result[i].get('orderID') + "</td><td>" + dateStr(result[i].get('orderTime')) + "</td><td>" + sumPrice + " 元" + "</td><td>" + dc + "</td><td>" + sc + "</td><td>"+paid+"</td><td>"+paymentTerm+"</td><td>"+ canceled +"</td><td>" + status + "</td></tr></tbody>");

                    }
                }
            },
            error: function (err) {
                alert("该操作员未分配分拣中心与配送中心,请分配后使用查询功能"+err.message);
            }
        });
    }

}

var scArray=[];
var dcArray=[];
function bindOrderSC() {
    var user=AV.User.current();
    var relation=user.relation('operableSCs');
    var query=relation.query();
    query.find({
        success: function (obj) {
            for (var i = 0; i < obj.length; i++) {
                $('#orderSC').append("<option id=" + obj[i].id + ">" + obj[i].get('scName') + "</option>")
                scArray.push(obj[i]);
            }
        },
        error: function (obj, err) {
            alert(err.message);
        }
    });
}

function bindOrderDC() {
    var user=AV.User.current();
    var relation=user.relation('operableDCs');
    var query=relation.query();
    query.find({
        success: function (obj) {
            for (var i = 0; i < obj.length; i++) {
                $('#orderDC').append("<option id=" + obj[i].id + ">" + obj[i].get('dcName') + "</option>")
                dcArray.push(obj[i]);
            }
        },
        error: function (obj, err) {
            alert(err.message);
        }
    })
}
