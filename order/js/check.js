/**
 * Created by caonima on 2015/9/6.
 */
$(document).ready(function () {
    var user=AV.User.current();
    var role=user.get('role');
    role.fetch({
        success: function (obj) {
            if($.inArray("115",obj.get('power'))==-1){
                $('#orderTable').find('tr').eq(1).css('display','none');
            }
        }
    });
    var arges=geturlarry();
    if(arges.length==2){
        edit();
        bindProduct();
        $('#print').css("display","none");
        $('.sub-header').html('订单编辑');
    }
    else if(arges.length==1) {
        check();
        $('#Content').css("display","none");
        $('#btn_show').css("display","none");
        $('#submit').css("display","none");
    }
    else if(arges.length==0){
        bindProduct();
    }
    else{
        alert("订单编号丢失!");
    }
});
function check() {
    var id=geturl();
    var orderTable=AV.Object.extend("OrderTable");
    var query=new AV.Query(orderTable);
    query.include("orderUser");
    query.include("orderStore");
    query.include("orderDC");
    query.include("orderSC");
    query.include("orderSalesman");
    query.get(id,{
        success: function (obj) {
            var tds=$("#orderTable").find('td');
            tds[0].innerHTML=obj.get('orderID');
            tds[1].innerHTML=getFullDate(obj.get('orderTime'));
            tds[2].innerHTML=obj.get('orderStore')==null?" ":obj.get('orderStore').get('storeName');
            tds[3].innerHTML=obj.get('orderUser')==null?" ":obj.get('orderUser').get('username');
            tds[4].innerHTML=obj.get('orderSC')==null?" ":obj.get('orderSC').get('scName');
            tds[5].innerHTML=obj.get('orderDC')==null?" ":obj.get('orderDC').get('dcName');
            tds[6].innerHTML=obj.get('orderSalesman')==null?"未绑定业务员!":obj.get('orderSalesman').get('salesmanName');
            tds[7].innerHTML=obj.get('orderSalesman')==null?"未绑定业务员!":obj.get('orderSalesman').get('mobilePhoneNo');
            tds[8].innerHTML=obj.get('enabled')==true?"正常":"已失效";
            tds[9].innerHTML={1:"新建",2:"系统已确认",3:"分拣中",4:"出库录单完毕",5:"出库准备",6:"转仓调拨中",7:"到达配送站",8:"配送中",9:"已配送成功",10:"已完成"}[obj.get('orderStatus')]||'error';
            tds[10].innerHTML=obj.get('canceled')==true?"已取消":"未取消";
            tds[11].innerHTML={1:"用户取消",2:"后台取消"}[obj.get('cancellationReason')]||" ";
            tds[12].innerHTML=obj.get('paid')==true?"已付款":"未付款";
            tds[13].innerHTML=obj.get('ch_id')||" ";
            var paymentTerm="货到付款";
            if(obj.get('paymentTerm') !=null) {
                paymentTerm = obj.get('paymentTerm') == 1 ?"在线支付":"货到付款";
            }
            tds[14].innerHTML=paymentTerm;
            tds[15].innerHTML=obj.get('refunded')==true?"已退款":"未退款";
            tds[16].innerHTML=obj.get('payee')||"";
            tds[17].innerHTML=obj.get('remark')||" ";
            tds[18].innerHTML=obj.get('orderStore').get('storeNumber')||"暂无";
            var price=obj.get('orderSumPrice').toFixed(2)||0;
            $("#sumPrice").html("¥ "+price);
            var relation=obj.relation('orderDetail');
            var query=relation.query();
            query.include('orderDetailProductName');
            query.ascending('orderNumber');
            query.find({
                success:function(object){
                    for(var k=0;k<object.length;k++) {
                        if (object[k].get('orderDetailProductName') != null) {
                            if (object[k].get('productName')) {
                                $('#orderDetail').append("<tbody><tr><td>" + object[k].get('productName') + "</td><td>" + object[k].get('productPrice') + "元/" + object[k].get('packageString') + "</td><td>" + object[k].get('unitPrice') + "元/" + object[k].get('unitString') + "</td><td>" + object[k].get('orderDetailProductCount') + object[k].get('packageString') + "</td><td>" + object[k].get('realUnit') + object[k].get('unitString') + "</td><td>" + object[k].get('realPrice') + "元</td></tr></tbody>")
                            }
                            else {
                                $('#orderDetail').append("<tbody><tr><td>" + object[k].get('orderDetailProductName').get('productName') + "</td><td>" + object[k].get('orderDetailProductName').get('productPrice') + "元/" + object[k].get('orderDetailProductName').get('packageString') + "</td><td>" + object[k].get('orderDetailProductName').get('unitPrice') + "元/" + object[k].get('orderDetailProductName').get('unitString') + "</td><td>" + object[k].get('orderDetailProductCount') + object[k].get('orderDetailProductName').get('packageString') + "</td><td>" + object[k].get('realUnit') + object[k].get('orderDetailProductName').get('unitString') + "</td><td>" + object[k].get('realPrice') + "元</td></tr></tbody>")
                            }
                        }
                    }
                },
                error:function(err){
                    alert(err.message);
                }
            });
        },
        error:function(err){
            alert(err.message);
        }
    });
}

var sumPrice=0;
var packageNo=0;
function edit(){
    var id=geturlarry();
    var orderTable=AV.Object.extend("OrderTable");
    var query=new AV.Query(orderTable);
    query.include("orderUser");
    query.include("orderStore");
    query.include("orderDC");
    query.include("orderSC");
    query.include("orderSalesman");
    query.get(id[0],{
        success: function (obj) {
            var tds=$("#orderTable").find('td');
            tds[0].innerHTML=obj.get('orderID');
            tds[1].innerHTML=getFullDate(obj.get('orderTime'));
            tds[2].innerHTML=obj.get('orderStore')==null?" ":obj.get('orderStore').get('storeName');
            tds[3].innerHTML=obj.get('orderUser')==null?" ":obj.get('orderUser').get('username');
            tds[4].innerHTML=obj.get('orderSC')==null?" ":obj.get('orderSC').get('scName');
            tds[5].innerHTML=obj.get('orderDC')==null?" ":obj.get('orderDC').get('dcName');
            tds[6].innerHTML=obj.get('orderSalesman')==null?"未绑定业务员!":obj.get('orderSalesman').get('salesmanName');
            tds[7].innerHTML=obj.get('orderSalesman')==null?"未绑定业务员!":obj.get('orderSalesman').get('mobilePhoneNo');
            tds[8].innerHTML=obj.get('enabled')==true?"正常":"已失效";
            tds[9].innerHTML="<select id='orderStatus'><option value='1'>新建</option><option value='2'>系统已确认</option><option value='3'>分拣中</option><option value='4'>出库录单完毕</option><option value='5'>出库准备</option><option value='6'>转仓调拨中</option><option value='7'>到达配送站</option><option value='8'>配送中</option><option value='9'>已配送成功</option><option value='10'>已完成</option></select>"
            $('#orderStatus').val(obj.get('orderStatus'));
            tds[10].innerHTML="<label style='width: 100px'><input name='canceled' type='radio' value='false'/>正常订单</label><label><input name='canceled' type='radio' value='true'/>取消订单</label>";
            obj.get('canceled')==false?$('input[name="canceled"][value="false"]').attr("checked",true):$('input[name="canceled"][value="true"]').attr("checked",true);
            tds[11].innerHTML="<select id='canceledReason'><option value='' selected='true' disabled='true'>选择类型</option><option value=1>用户取消</option><option value=2>后台取消</option></select>";
            if(obj.get('canceled')==false){
                $('#canceledReason').css("background-color","#FFFFCC");
                $("#canceledReason").attr("disabled",true);
            }
            $('input[name="canceled"][value="true"]').click(function () {
                $('#canceledReason').css("background-color","#FFFFFF");
                $("#canceledReason").attr("disabled",false);
            });
            $('input[name="canceled"][value="false"]').click(function () {
                $("#canceledReason").val('');
                $('#canceledReason').css("background-color","#FFFFCC");
                $("#canceledReason").attr("disabled",true);
            });

            $('#canceledReason').val(obj.get('cancellationReason'));
            tds[12].innerHTML=obj.get('paid')==true?"<select name='paid'><option value='1' selected>已支付</option><option value='0'>未付款</option></select>"+"<input type='button' value='申请退款' style='margin-left: 55px'>":"<select name='paid'><option value='1'>已支付</option><option value='0' selected>未付款</option></select>"+"<input type='button' value='申请退款' style='margin-left: 55px;background-color: #FFFFCC' disabled>";
            tds[13].innerHTML=obj.get('ch_id')||" ";
            var paymentTerm="货到付款";
            if(obj.get('paymentTerm') !=null) {
                paymentTerm = obj.get('paymentTerm') == 1 ?"在线支付":"货到付款";
            }
            tds[14].innerHTML=paymentTerm;
            tds[15].innerHTML=obj.get('refunded')==true?"已退款":"未退款";
            var payee=obj.get("payee")||"";
            tds[16].innerHTML="<input id='payee' type='text' value="+ payee +">"
            var remark=obj.get('remark')||" ";
            tds[17].innerHTML="<textarea id='remark' cols='100'>" + remark + "</textarea>"
            tds[18].innerHTML=obj.get('orderStore').get('storeNumber')||"暂无";

            sumPrice=obj.get('orderSumPrice').toFixed(2)||0;
            $("#sumPrice").html("¥ "+sumPrice);
            var relation=obj.relation('orderDetail');
            var query=relation.query();
            query.include('orderDetailProductName');
            query.ascending('orderNumber');
            query.find({
                success: function (object) {
                    for (var k = 0; k < object.length; k++) {
                        if (object[k].get('orderDetailProductName') != null) {
                            if (object[k].get('productName')) {
                                $('#orderDetail').append("<tbody><tr id=" + object[k].get('orderDetailProductName').id + "><td>" + object[k].get('productName') + "</td><td><span>" + object[k].get('productPrice') + "</span>" + "元/" + object[k].get('packageString') + "</td><td><span>" + object[k].get('unitPrice') + "</span>元/" + object[k].get('unitString') + "</td><td><span>" + object[k].get('orderDetailProductCount') + "</span>" + object[k].get('packageString') + "</td><td><input id=" + object[k].id + " type='text' value=" + object[k].get('realUnit') + " preData=" + object[k].get('realUnit') + " style='width:50px'>" + object[k].get('unitString') + "</td><td><span>" + object[k].get('realPrice') + "</span>元<a href='#' style='margin-left: 30px' name='delete' object=" + object[k].id + ">删除</a></td></tr></tbody>")
                            }
                            else {
                                $('#orderDetail').append("<tbody><tr id=" + object[k].get('orderDetailProductName').id + "><td>" + object[k].get('orderDetailProductName').get('productName') + "</td><td><span>" + object[k].get('orderDetailProductName').get('productPrice') + "</span>" + "元/" + object[k].get('orderDetailProductName').get('packageString') + "</td><td><span>" + object[k].get('orderDetailProductName').get('unitPrice') + "</span>元/" + object[k].get('orderDetailProductName').get('unitString') + "</td><td><span>" + object[k].get('orderDetailProductCount') + "</span>" + object[k].get('orderDetailProductName').get('packageString') + "</td><td><input id=" + object[k].id + " type='text' value=" + object[k].get('realUnit') + " preData=" + object[k].get('realUnit') + " style='width:50px'>" + object[k].get('orderDetailProductName').get('unitString') + "</td><td><span>" + object[k].get('realPrice') + "</span>元<a href='#' style='margin-left: 30px' name='delete' object=" + object[k].id + ">删除</a></td></tr></tbody>")
                            }
                        }
                        $('#orderDetail input').unbind('change').change(function () {
                            var obj = $(this);
                            if (parseFloat(obj.val())==obj.val() && parseFloat(obj.val()) > 0) {
                                var unit = parseFloat($(this).parent().parent("tr").find("td").eq(2).children("span").text());
                                var nowPrice = parseFloat(unit * obj.val());
                                $(this).parent().parent("tr").find("td").eq(5).children("span").html(nowPrice.toFixed(2));
                                var newSumPrice = unit * (obj.val() - obj.attr('preData'))+parseFloat(sumPrice);
                                obj.attr('preData', obj.val());
                                sumPrice = newSumPrice;
                                $('#sumPrice').html("¥ " + sumPrice.toFixed(2));

                            }
                            else {
                                alert("输入值不正确!_(:зゝ∠)_");
                                $(this).val($(this).attr('preData'));
                            }
                        });
                        $("#orderDetail a[name='delete']").each(function () {
                            $(this).unbind('click').click(function () {
                                if (confirm("确认删除该菜品?")) {
                                    var unit = parseFloat($(this).parent().parent("tr").find("td").eq(2).children("span").text());
                                    var conut = parseFloat($(this).parent().parent("tr").find("td").eq(4).children("input").val());
                                    sumPrice = parseFloat(sumPrice - unit * conut);
                                    $('#sumPrice').html("¥ " + sumPrice);
                                    $(this).parent().parent().remove();
                                    var OrderTable = AV.Object.extend('OrderTable');
                                    var query1 = new AV.Query(OrderTable);
                                    query1.get(geturlarry()[0], {
                                        success: function (obj) {
                                            obj.set('orderSumPrice', sumPrice);
                                            obj.save();
                                        },
                                        error: function (obj, err) {
                                            alert(err.message);
                                        }
                                    })
                                    var OrderDetail = AV.Object.extend('OrderDetail');
                                    var query = new AV.Query(OrderDetail);
                                    query.get($(this).attr('object'), {
                                        success: function (obj) {
                                            obj.destroy({
                                                success: function () {
                                                },
                                                error: function (obj, err) {
                                                    alert(err.message);
                                                }
                                            });
                                        },
                                        error: function (obj, err) {
                                            alert(err.message);
                                        }
                                    })
                                }
                            });
                        });
                    }
                },
                error: function (err) {
                    alert(err.message);
                }
            });
        },
        error:function(err){
            alert(err.message);
        }
    });
}

function bindProduct(){
    var select=$('#productTable select');
    var ProductType=AV.Object.extend("ProductType");
    var Product=AV.Object.extend('Product');
    var query=new AV.Query(ProductType);
    query.ascending("orderNumber");
    query.find({
       success: function (obj) {
           for(var i=0;i<obj.length;i++){
              $('#type').append("<option id="+obj[i].id+">"+obj[i].get('typeName')+"</option>");
           }
       },
        error: function (err) {
            alert(err.message);
        }

    }).then(function () {
        if($('#store').attr('city')) {
            editProduct();
        }
    });
}

function editProduct() {
    if ($('#store').attr('city')) {
        var Product = AV.Object.extend("Product");
        var product = new Product();
        product.id = $('#type option:checked').attr('id');
        var query = new AV.Query(Product);
        query.limit(1000);
        query.ascending("orderNumber");
        query.include("productType");
        query.equalTo("productType", product);

        var City = AV.Object.extend("City");
        var city = new City();
        city.id = $('#store').attr('city');
        query.equalTo("city", city);

        query.equalTo("enabled", true);
        query.equalTo("onsell", true);
        query.find({
            success: function (object) {

                var len = object.length;
                var html = '';
                for (var i = 0; i < len; i++) {
                    html += '<option id=' + object[i].id + '>' + object[i].get("productName") + ' 【' + object[i].get('packageString') + '】' + '</option>';
                }
                $("#product").html(html);
            }
        }).then(function () {
            $.artwl_bind({ showbtnid: "btn_show", title: "新增菜品", content: $("#Content").html() });
            $("#Content").remove();
        });
    }
    else {
        alert("请先选择店铺!");
    }
}

function newProduct() {       //编辑订单时使用
    if ($("#count").val() > 0 && parseInt($("#count").val()) == $("#count").val()) {
        var array = new Array();
        $("#orderDetail tbody tr").each(function () {    // 遍历每一行
            array.push($(this).attr('id'));
        });
        if (($.inArray($('#product option:checked').attr('id'), array)) >= 0) {
            alert("已经选择过该菜品了!");
        }
        else {
            var productId = $("#product option:selected").attr("id");
            var orderId = geturlarry()[0];
            var OrderTable = AV.Object.extend("OrderTable");
            var Product = AV.Object.extend("Product");
            var query = new AV.Query(Product);
            query.limit(1000);
            query.equalTo("enabled",true);
            query.equalTo("onsell",true);
            query.get(productId, function (proObject) {

                var query = new AV.Query(OrderTable);
                query.get(orderId, {
                    success: function (obj) {
                        var OrderDetail = AV.Object.extend('OrderDetail');
                        var orderDetail = new OrderDetail();
                        orderDetail.set("orderDetailProductName", proObject);
                        orderDetail.set("orderDetailProductCount", parseFloat($('#count').val()));
                        orderDetail.set("productName",proObject.get('productName'));
                        orderDetail.set("productPrice",proObject.get('productPrice'));
                        orderDetail.set("packageString",proObject.get('packageString'));
                        orderDetail.set("unitPerPackage",proObject.get('unitPerPackage'));
                        orderDetail.set("unitString",proObject.get('unitString'));
                        orderDetail.set("unitPrice",proObject.get('unitPrice'));
                        orderDetail.save(null, {
                            success: function () {
                                var relation = obj.relation("orderDetail");
                                relation.add(orderDetail);
                                obj.set("orderSumPrice", parseFloat(obj.get("orderSumPrice") + (proObject.get("productPrice") * $('#count').val())));
                                obj.save(null, {
                                    success: function () {
                                        $.artwl_close();
                                        $("#orderDetail tbody").remove();
                                        edit();
                                    },
                                    error: function (err) {
                                        alert(err.message);
                                    }
                                });
                            },
                            error: function (err) {
                                alert(err.message);
                            }
                        });
                    }
                })
            });
        }
    }

    else {
        alert("输入值不正确!_(:зゝ∠)_");
    }

}

var sumPrice2=0;
function newProduct2() {         //新建订单时使用
    if($("#count").val()>0&&parseInt($("#count").val())==$("#count").val()) {
        var array = new Array();
        $("#orderDetail tbody tr").each(function () {    // 遍历每一行
            array.push($(this).attr('id'));

        });
         if (($.inArray($('#product option:checked').attr('id'), array)) >= 0) {
         alert("已经选择过该类菜品!");
         }
        else {
             var productId = $("#product option:selected").attr("id");
             var OrderTable = AV.Object.extend("OrderTable");
             var Product = AV.Object.extend("Product");
             var query = new AV.Query(Product);
             query.get(productId, function (object) {
                 $('#orderDetail tbody').append("<tr id=" + object.id + "><td>" + object.get('productName') + "</td><td><span>" + object.get('productPrice') + "</span>元/" + object.get('packageString') + "</td><td><input type='number' value=" + $('#count').val() + " preData=" + $('#count').val() + "><a href='#' style='margin-left: 60px' name='delete'>删除</a></td></tr>")
                 sumPrice2 += parseFloat(object.get('productPrice') * $('#count').val());
                 $('#sumPrice').html("¥ " + sumPrice2.toFixed(2));
                 $('#orderDetail input').unbind('change').change(function () {
                     var obj = $(this);
                     if (parseInt(obj.val()) == obj.val() && obj.val() > 0) {
                         var unit = $(this).parent().parent("tr").find("td").eq(1).children("span").text();
                         var newSumPrice = parseFloat(sumPrice2 + unit * (obj.val() - obj.attr('preData')));
                         obj.attr('preData', obj.val());
                         sumPrice2 = newSumPrice;
                         $('#sumPrice').html("¥ " + sumPrice2);

                     }
                     else {
                         alert("输入值非法!");
                         $(this).val($(this).attr('preData'));
                     }
                 });
                 $("#orderDetail a[name='delete']").each(function () {
                     $(this).unbind('click').click(function () {
                         if (confirm("确认删除该菜品?")) {
                             var unit = $(this).parent().parent("tr").find("td").eq(1).children("span").text();
                             var conut = $(this).parent().parent("tr").find("td").eq(2).children("input").val();
                             sumPrice2 -= parseFloat(unit * conut);
                             $('#sumPrice').html("¥ " + sumPrice2);
                             $(this).parent().parent().remove();
                         }
                     });
                 });

             });
         }

    }
    else{
        alert("输入值不合法");
    }
}

function newOrder2(){
    if ($("#sumPrice").text() == "" || $("#sumPrice").text() == "¥ 0") {
        alert("您未选择菜品!");
    }
    else {
        var trs = $('#orderDetail tbody').find('tr');
        if ($('#store').attr('name') && $('#user').attr('userId')) {
            var storeId = $('#store').attr('name');
            var userId = $('#user').attr('userId');
            var remark = $('#remark').val();
            var detailList = new Array();
            for (var i = 0; i < trs.length; i++) {
                var attr = {
                    "productOid": trs[i].id,
                    "count": parseFloat(trs[i].getElementsByTagName('input')[0].value)          
                }
                detailList.push(attr);
            }
            AV.Cloud.run("AddOrder", {
                "storeOid": storeId,
                "userOid": userId,
                "remark": remark,
		        "caller": 1,
                "detailList": detailList
            }, {
                success: function (result) {
                    alert("提交成功!");
                    window.location.href = "queryOrder.html";
                },
                error: function (obj, err) {
                    alert("失败!请重新下单!");
                    location.reload();
                }
            });
        }
        else{
            alert("请选择正确的店铺");
        }
    }
}


function newOrder() {
    if ($("#sumPrice").text() == "" || $("#sumPrice").text() == "¥ 0") {
        alert("您未选择菜品!");
    }
    else {
        var date = new Date();
        var pointArray = new Array();
        var num = new Array(); //存放relation
        var trs = $('#orderDetail tbody').find('tr');
        var OrderTable = AV.Object.extend("OrderTable");
        var OrderDetail = AV.Object.extend('OrderDetail');
        var Store = AV.Object.extend("Store");
        var Product = AV.Object.extend("Product");
        var query = new AV.Query(Store);
        query.include("owner");
        query.include("storeSC");
        query.include("storeDC");
        query.include("storeRoute");
        query.get($('#store').find("option:checked").attr("id"), {
            success: function (obj) {
                var orderTable = new OrderTable();
                orderTable.set("orderUser", obj.get('owner'));
                orderTable.set("orderStore", obj);
                orderTable.set("orderDC", obj.get('storeDC'));
                orderTable.set("orderDeliveryRoute",obj.get('storeRoute'))
                orderTable.set("orderStatus", 1);
                orderTable.set("orderTime", date);
                orderTable.set("orderSumPrice", parseFloat($('#sumPrice').text().replace("¥ ", "")));
                orderTable.set("enabled", true);
                orderTable.set("paid", false);
                orderTable.set("canceled", false);
                orderTable.set("refunded", false);
                orderTable.set("remark", $('#remark').val());
                for (var i = 0; i < trs.length; i++) {
                    var query = new AV.Query(Product);
                    (function (i) {
                        query.get(trs[i].id, {
                            success: function (object) {
                                pointArray[i] = object;
                            },
                            error: function (obj, err) {
                                alert(err.message);
                            }
                        }).then(function () {
                            var orderDetail = new OrderDetail();
                            (function (i) {
                                orderDetail.set("orderDetailProductName", pointArray[i]);
                                orderDetail.set("orderDetailProductCount", parseFloat(trs[i].getElementsByTagName('input')[0].value));
                                orderDetail.save(null, {
                                    success: function () {
                                        num.push(orderDetail);
                                        if(num.length==trs.length) {
                                            orderTable.save(null, {
                                                success: function () {
                                                    var relation = orderTable.relation("orderDetail");
                                                    for (var j = 0; j < num.length; j++) {
                                                        relation.add(num[j]);
                                                    }
                                                    orderTable.save().then(function () {
                                                            alert("提交成功");
                                                            window.location.href = "queryOrder.html";
                                                        });
                                                },
                                                error: function (obj, err) {
                                                    alert(err.message);
                                                }
                                            });
                                        }
                                    },
                                    error: function (obj, err) {
                                        alert(err.message);
                                    }
                                });
                            })(i);
                        });
                    })(i);
                }
            },
            error: function (obj, err) {
                alert(err.message)
            }
        });
    }
}

function bindStroe(){
    var Store=AV.Object.extend("Store");
    var query=new AV.Query(Store);
    query.limit(1000);
    query.include("storeDC");
    query.find({
        success: function (obj) {
            /*$('#user').text(obj[0].get("storeContact"));
            $('#user').attr('userId',obj[0].get('owner').id);*/
            var query1=new AV.Query("UserJoinStore");
            query1.equalTo("store",obj[0]);
            query1.find({
                success: function (result) {
                    if(result.length==0){
                        $("#user").text("当前店铺未绑定操作员");
                        $('#user').attr('userId',obj[0].get('owner').id)
                    }
                    else{
                        $("#user").text("");
                        $("#user").attr('userId',result[0].get('user').id);
                    }
                }
            });
            $('#address').text(obj[0].get('storeAddress'));
            $('#dc').text(obj[0].get("storeDC").get("dcName"));
            for(var i=0;i<obj.length;i++){
                $('#store').append("<option id="+obj[i].id+">"+obj[i].get("storeName")+"</option>")

                $('#store').unbind('change').change(function () {
                    var query=new AV.Query(Store);
                    query.include("storeDC");
                    var storeId=$(this).find("option:checked").attr("id");
                    query.get(storeId,{
                        success: function (obj) {
                            /*$('#user').text(obj.get("storeContact"));
                            $('#user').attr('userId',obj.get('owner').id);*/
                            var query2=new AV.Query("UserJoinStore");
                            query2.equalTo("store",obj);
                            query2.find({
                                success: function (result) {
                                    if(result.length==0){
                                        $("#user").text("当前店铺未绑定操作员");
                                        $('#user').attr('userId',obj.get('owner').id);
                                    }
                                    else{
                                        $("#user").text("");
                                        $("#user").attr('userId',result[0].get('user').id);
                                    }
                                }
                            })
                            $('#address').text(obj.get('storeAddress'));
                            $('#dc').text(obj.get("storeDC").get("dcName"));
                        }
                    });
                });
            }
        }
    });
}

function storeChange() {
    var query = new AV.Query("Store");
    query.include("storeDC");
    var storeId = $('#store').attr("name");
    query.get(storeId, {
        success: function (obj) {
            /*$('#user').text(obj.get("storeContact"));
             $('#user').attr('userId',obj.get('owner').id);*/
            var query2 = new AV.Query("UserJoinStore");
            query2.equalTo("store", obj);
            query2.find({
                success: function (result) {
                    if (result.length == 0) {
                        $("#user").text("当前店铺未绑定操作员");
                        $('#user').attr('userId', obj.get('owner').id);
                    }
                    else {
                        $("#user").text("");
                        $("#user").attr('userId', result[0].get('user').id);
                    }
                }
            })
            $('#address').text(obj.get('storeAddress'));
            $('#dc').text(obj.get("storeDC").get("dcName"));
        }
    });
}

function submitEdit(){
    if(confirm("确认修改?")){
        var flag=0;//计数;
        var count=$('#orderDetail').find('input');
        var lastTd=$('#orderDetail').find('a').prev();
        var OrderTable=AV.Object.extend('OrderTable');
        var query=new AV.Query(OrderTable);
        query.get(geturlarry()[0],{
            success: function (obj) {
                var relation=obj.relation('orderDetail');
                var query=relation.query();
                query.include('orderDetailProductName');
                query.ascending('orderNumber');
                query.find().then(function (object) {

                    for (var i = 0; i < object.length; i++) {
                        (function (i) {
                            object[i].set("realUnit", parseFloat(count[i + 1].value));
                            object[i].set("realPrice", parseFloat(lastTd[i].innerHTML));
                            object[i].save(null, {success: function () {
                                flag++;
                                if (flag == object.length) {
                                    obj.set("orderStatus", parseInt($('#orderStatus').val()));
                                    if ($('input[name="canceled"]:checked').val() == 'true') {
                                        obj.set("cancellationReason", parseInt($('#canceledReason').val()));
                                        obj.set("canceled", true);
                                    }
                                    else {
                                        obj.set("canceled", false);
                                    }
                                    if($('select[name="paid"]').val()==1){
                                        obj.set("paid",true);
                                    }
                                    else{
                                        obj.set("paid",false);
                                    }
                                    obj.set("remark", $('#remark').val());
                                    obj.set("payee",$('#payee').val());
                                    obj.set("orderSumPrice", parseFloat($('#sumPrice').text().replace("¥ ", "")));
                                    obj.save(null, {
                                        success: function () {
                                            alert("修改成功!");
                                            window.location.href = "queryOrder.html";
                                        }
                                    });
                                }
                            }
                            });
                        })(i);
                    }
                });
            }
        })
    }
}



/*

function submitEdit(){
    if(confirm("确认修改?")){
        var flag=0;//计数;
        var count=$('#orderDetail').find('input');
        var lastTd=$('#orderDetail').find('a').prev();
        var OrderTable=AV.Object.extend('OrderTable');
        var query=new AV.Query(OrderTable);
        query.get(geturlarry()[0],{
            success: function (obj) {
                obj.set("orderStatus",parseInt($('#orderStatus').val()));
                if($('input[name="canceled"]:checked').val()=='true'){
                    obj.set("cancellationReason",parseInt($('#canceledReason').val()));
                    obj.set("canceled",true);
                }
                else{
                    obj.set("canceled",false);
                }
                obj.set("remark",$('#remark').val());
                if(packageNo.length>0){
                    obj.set("packageNo",packageNo);
                }
                obj.set("orderSumPrice", parseFloat($('#sumPrice').text().replace("¥ ", "")));
                obj.save(null,{
                    success: function () {
                        var relation=obj.relation('orderDetail');
                        var query=relation.query();
                        query.find({
                            success: function (object) {
                                for(var i=0;i<object.length;i++){
                                    object[i].set("realUnit",parseFloat(count[i+1].value));
                                    object[i].set("realPrice",parseFloat(lastTd[i].innerHTML));
                                    object[i].save(null,{
                                        success:function(){
                                            flag++;
                                            if(flag==object.length){
                                                alert("提交成功!");
                                                window.location.href="queryOrder.html";
                                            }
                                        }
                                    });
                                }
                            },
                            error: function (obj, err) {
                                alert(err.message);
                            }
                        });
                    },
                    error: function (obj,err) {
                        alert(err.message);
                    }
                });
            }
        })
    }
}

*/


