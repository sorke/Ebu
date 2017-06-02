/**
 * Created by caonima on 2015/9/17.
 */
$(document).ready(function () {

    $("#checkAll").click(
        function() {
            if (this.checked) {
                $("input[name='order']").each(function () {
                    this.checked = true;
                });
            }
            else {
                $("input[name='order']").each(function () {
                    this.checked = false;
                });
            }
        }
    );
    chooseSC();
})

function getHM(date) {
    return date.getHours()+":"+date.getMinutes();
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

function chooseSC() {
    var option="";
    var html=""
    var query=new AV.Query('SortingCenter');
    query.ascending('scID');
    query.find().then(function (obj) {
        for(var i = 0 ;i<obj.length;i++){
            option+="<option value="+obj[i].id+">"+obj[i].get("scName")+"</option>";
        }
        html="<div style='margin: 20px'><select id='selectSC'>"+option+"</select></div><div style='margin: 20px'><input class='btn btn-danger' type='button' value='导出' onclick='allDetail()'/></div>"
    }).then(function () {
        $.artwl_bind({ showbtnid: "detailBtn", title: "选择分拣仓", content: html });
    })
}

var mask = '<div id="artwl_mask">正在获取数据...</div>';
var cssCode='#artwl_mask{background-color: #000;position: fixed;top: 0px;left: 0px;z-index:2000;width: 100%;height: 100%;opacity: 0.5;filter: alpha(opacity=50);display: none;text-align:center;line-height:400px;color:#fff;font-size:22px;}';
function bindPrint(idArray) {
    if ($("#artwl_mask").length == 0) {
        $("body").append(mask);
        $("head").append("<style type='text/css'>" + cssCode + "</style>");
        $("#artwl_mask").show();
    }
    else{
        $("#artwl_mask").remove();
    }
    var flag = 0;
    var spans = $('#printDiv').find('span');
    var OrderTable = AV.Object.extend('OrderTable');
    var query = new AV.Query(OrderTable);
    query.include('orderStore');
    query.include('orderUser');
    query.include('orderSC');
    query.include('orderDC');
    query.include('orderDeliveryRoute');
    query.include('orderDelivery');
    query.include('orderSalesman');
    for (var a = 0; a < idArray.length; a++) {
            query.get(idArray[a], {
                success: function (obj) {
                    var relation = obj.relation('orderDetail');
                    var query1 = relation.query();
                    query1.include('orderDetailProductName');
                    query1.ascending('createdAt');
                    query1.find().then(function (result) {

                        var productHtml = "";
                        for (var i = 0; i < result.length; i++) {
                            productHtml += "<tr><td>" + (i + 1) + "</td><td>" + result[i].get('orderDetailProductName').get('productID') + "</td><td>" + result[i].get('productName') + "</td><td>" + result[i].get('orderDetailProductCount') + result[i].get('packageString') + "</td><td>" + result[i].get('realUnit') + result[i].get('unitString') + "</td><td>" + result[i].get('unitPrice') + "元/" + result[i].get('unitString') + "</td><td>" + result[i].get('realPrice') + "</td></tr>";
                        }
                        $('#printDiv').find('table').eq(1).find('tbody').eq(0).html(productHtml);
                        return result;
                    }).then(function () {
                        spans[0].innerHTML = obj.get('orderID');
                        spans[1].innerHTML = obj.get('orderSC') == null ? "无效订单" : obj.get('orderSC').get('scName');
                        spans[2].innerHTML = obj.get('orderStore').get('storeNumber') || " ";
                        if ($.inArray("115", roleArray) >= 0) {
                            spans[3].innerHTML = obj.get('orderStore') == null ? "未找到" : obj.get('orderStore').get('storeName');
                            spans[8].innerHTML = obj.get('orderStore') == null ? "未找到" : (obj.get('orderStore').get('contactName') || " ") + "(" + obj.get('orderStore').get('storeContact') + ")";
                            spans[11].innerHTML = obj.get('orderStore') == null ? "未找到" : obj.get('orderStore').get('storeAddress');
                        }
                        spans[4].innerHTML = obj.get('orderDeliveryRoute') == null ? "未找到" : obj.get('orderDeliveryRoute').get('routeName');
                        spans[5].innerHTML = obj.get('orderDC') == null ? "未找到" : obj.get('orderDC').get('dcName');
                        spans[6].innerHTML = obj.get('orderStore') == null ? "未找到" : getHM(obj.get('orderStore').get('earlyTime'));
                        spans[7].innerHTML = obj.get('orderStore') == null ? "未找到" : getHM(obj.get('orderStore').get('latestTime'));
                        spans[9].innerHTML = obj.get('orderDelivery') == null ? "未找到" : obj.get('orderDelivery').get('deliveryName') + "(" + obj.get('orderDelivery').get('deliveryPhone') + ")";
                        spans[10].innerHTML = getFullDate(obj.get('orderTime'));
                        spans[12].innerHTML = obj.get('orderSalesman') == null ? "未绑定" : obj.get('orderSalesman').get('salesmanName') + "(" + obj.get('orderSalesman').get('mobilePhoneNo') + ")";
                        spans[13].innerHTML = getFullDate(new Date());
                        spans[14].innerHTML = obj.get('remark') || " ";
                        spans[15].innerHTML = obj.get('orderSumPrice') + "元";
                        spans[24].innerHTML = {1:"网上支付",2:"配送收款",3:"业务收款"}[obj.get('orderStore').get('payeeTerm')];
                        spans[23].innerHTML = obj.get('orderStore').get('paymentTerm')==1 ? "网上支付" : "货到付款";
                        spans[25].innerHTML = obj.get('paid') == true ? "已支付" : "未支付";
                        $('#printContent').append("<div style='page-break-before: always'>" + $('#printDiv').html() + "</div>");
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

function printAll() {
    if(confirm("确认打印这些订单?")) {
        var idArray = new Array();
        $("input[name='order']").each(function (i, d) {
            if (d.checked) {
                idArray.push(d.value);
            }
        })
        if (idArray.length > 0) {
            bindPrint(idArray);
        }
        else {
            alert("好像没有选中的订单!_(:зゝ∠)_");
        }
    }
}

function deleteAll(){
    if(confirm("确认删除这些订单?")){
        var idArray = new Array();
        $("input[name='order']").each(function (i, d) {
            if (d.checked) {
                idArray.push(d.value);
            }
        })
        if (idArray.length > 0) {
            AV.Cloud.run('BatchSetOrderEnableNCancel',{
                "orderOids":idArray,
                "enabled":false,
                "canceled":true
            },{
                success: function (obj) {
                    alert("删除成功!");
                    location.reload();
                },
                error: function (obj,err) {
                    alert("删除失败!"+err.message);
                }
            });
        }
        else {
            alert("好像没有选中的订单!_(:зゝ∠)_");
        }
    }
}

function productTodayAll(){
    if(confirm("确认统计今日的所有订单的菜品?")){
        var idArray=new Array();
        var today=nowDay();
        var query=new AV.Query("OrderTable");
        query.descending("orderTime");
        query.equalTo("enabled",true);
        query.equalTo("canceled",false);
        query.greaterThanOrEqualTo("orderTime",today);
        query.find({
            success: function (obj) {
                for(var i=0;i<obj.length;i++){
                    idArray.push(obj[i].id);
                }
                if(idArray.length>0){
                    bindProductTable(idArray);
                }
                else{
                    alert("今日暂时没有新的订单!");
                }
            },
            error: function (o, e) {
                alert(e.message);
            }
        })
    }
}

function productAll() {

    if(confirm("确认统计这些订单的菜品?")) {
        var idArray = new Array();
        $("input[name='order']").each(function (i, d) {
            if (d.checked) {
                idArray.push(d.value);
            }
        });
        if (idArray.length > 0) {
            bindProductTable(idArray);
        }
        else {
            alert("您未选择订单!");
        }
    }
}

function bindProductTable(idArray) {
    var count= $.unique(idArray).length; //统计有多少家店铺
    var productTable='<tr><td colspan='+(count+2)+'><h3>菜品订购统计</h3></td></tr><tr><td rowspan="2">产品名称</td><td colspan='+(count+1)+'>订单实际订货量</td></tr><tr id="storeCol"><td>总计</td></tr>';
    $('#productTable').html(productTable);
    var products = new Array();
    var stores = new Array();
    var tag = 0; //计数:等待列加载完再加载行
    var OrderTable = AV.Object.extend('OrderTable');
    var query = new AV.Query(OrderTable);
    query.include('orderStore');
    for (var a = 0; a < idArray.length; a++) {
        query.get(idArray[a], {
            success: function (obj) {
                var relation = obj.relation('orderDetail');
                var query1 = relation.query();
                query1.include('orderDetailProductName');
                query1.ascending('createdAt');
                query1.find().then(function (result) {
                    for (var i = 0; i < result.length; i++) {
                        if ($.inArray(result[i].get('orderDetailProductName').id, products) < 0) {
                            products.push(result[i].get('orderDetailProductName').id);
                            var tdHtml='';
                            for(var j=0;j<count;j++){
                                tdHtml+="<td></td>"
                            }
                            $('#productDiv table').append("<tr><td>" + result[i].get('orderDetailProductName').get('productName') + "  " + result[i].get('orderDetailProductName').get('packageString') + "</td><td>0</td>"+tdHtml+"</tr>");
                        }
                    }
                    return result;
                }).then(function (result) {
                    if ($.inArray(obj.get('orderStore').id, stores) < 0) {
                        stores.push(obj.get('orderStore').id);
                        if ($.inArray("115", roleArray) >= 0) {
                            $('#storeCol').append("<td>" + obj.get('orderID') + "</br>" + obj.get('orderStore').get('storeName') + "</td>");
                        }
                        else {
                            $('#storeCol').append("<td>" + obj.get('orderID') + "</td>");
                        }
                        var stoIndexof = stores.length;
                        for (var i = 0; i < result.length; i++) {
                            var proIndexOf = $.inArray(result[i].get('orderDetailProductName').id, products);
                            var sum = parseInt($('#productDiv table').find('tr').eq(proIndexOf + 3).find('td').eq(1).text());
                            $('#productDiv table').find('tr').eq(proIndexOf + 3).find('td').eq(1).html(sum + result[i].get('orderDetailProductCount'));
                            $('#productDiv table').find('tr').eq(proIndexOf + 3).find('td').eq(stoIndexof + 1).html(result[i].get('orderDetailProductCount'));
                        }
                    }
                    else {
                        var stoIndexof = $.inArray(obj.get('orderStore').id, stores);
                        for (var i = 0; i < result.length; i++) {
                            var proIndexOf = $.inArray(result[i].get('orderDetailProductName').id, products);
                            var count = parseInt($('#productDiv table').find('tr').eq(proIndexOf + 3).find('td').eq(stoIndexof + 2).text() || 0);
                            var sum = parseInt($('#productDiv table').find('tr').eq(proIndexOf + 3).find('td').eq(1).text());
                            $('#productDiv table').find('tr').eq(proIndexOf + 3).find('td').eq(1).html(sum + result[i].get('orderDetailProductCount'));
                            $('#productDiv table').find('tr').eq(proIndexOf + 3).find('td').eq(stoIndexof + 2).html(count + result[i].get('orderDetailProductCount'));
                        }
                    }
                    tag++;
                }).then(function () {
                    if (tag == idArray.length) {
                        for (var x = 0; x < products.length; x++) {
                            for (var y = 11; y > stores.length + 1; y--) {
                                $('#productDiv table').find('tr').eq(x + 3).find('td').eq(y).remove();
                            }
                        }
                        //document.body.innerHTML = document.getElementById('productDiv').innerHTML;
                        //$('#productDiv').removeAttr('style');
                        method1('productTable');
                        //window.print();
                    }
                });
            }
        });
    }

}

function allDetail() {
    if($('#datePicker').val()!="") {
        $('#allDetail tbody tr').remove();
        var today = strChangeDate($('#datePicker').val(), 0);
        var tomorrow = strChangeDate($('#datePicker').val(), 1);
        if (confirm("确认统计日期为" + $('#datePicker').val() + " 的所有订单的菜品?")) {
            var tag = 0; //计数:判断表格是否生成完毕
            var query = new AV.Query("OrderTable");
            query.equalTo("enabled", true);
            if($("#canceledOrder").is(':checked')){
            }
            else{
                query.equalTo("canceled",false);
            }
            var SC=AV.Object.extend('SortingCenter');
            var sc=new SC();
            sc.id=$('#selectSC').val();
            query.equalTo('orderSC',sc);
            query.greaterThanOrEqualTo("orderTime",today);
            query.lessThanOrEqualTo("orderTime",tomorrow);
            query.descending("orderID");
            query.limit(1000);
            query.include('orderStore');
            query.find({
                success: function (obj) {
                    if (obj.length > 0) {
                        for (var i = 0; i < obj.length; i++) {
                            (function (i) {
                                var relation = obj[i].relation('orderDetail');
                                var dQuery = relation.query();
                                dQuery.include('orderDetailProductName');
                                dQuery.ascending('createdAt');
                                dQuery.find().then(function (results) {
                                    var orderID = obj[i].get('orderID');
                                    var storeID = obj[i].get('numberInDay')||"";
                                    var orderStore = "";
                                    var orderAddress = "";
                                    var orderContact = "";
                                    var earlyTime = "";
                                    var latestTime = "";
                                    if (obj[i].get('orderStore')) {
                                        orderStore = obj[i].get('orderStore').get('storeName');
                                        orderAddress = obj[i].get('orderStore').get('storeAddress');
                                        orderContact = obj[i].get('orderStore').get('storeContact');
                                        earlyTime = getHM(obj[i].get('orderStore').get('earlyTime'));
                                        latestTime = getHM(obj[i].get('orderStore').get('latestTime'));
                                    }
                                    var remark = obj[i].get('remark') || "";
                                    var canceled = obj[i].get('canceled') == true ? "已取消" : "";
                                    tag++;
                                    var reCount = results.length;
                                    if (reCount > 0) {
                                        var productName = "";
                                        var productPrice = "";
                                        var packageString = "";
                                        var unitPrice = "";
                                        var orderDetailProductCount = "";
                                        var realUnit = "";
                                        var realPrice = "";
                                        for (var j = 0; j < reCount; j++) {
                                            var pointer = results[j].get('orderDetailProductName') || " ";

                                            if (pointer != "") {
                                                productName = pointer.get('productName');
                                                productPrice = pointer.get('productPrice');
                                                packageString = pointer.get('packageString');
                                                unitPrice = pointer.get('unitPrice');
                                            }
                                            orderDetailProductCount = results[j].get('orderDetailProductCount');
                                            realUnit = results[j].get('realUnit');
                                            realPrice = results[j].get('realPrice');
                                            /*if (j == 0) {
                                                $('#allDetailDiv table tbody').append("<tr><td rowspan=" + reCount + ">" + orderID + "</td><td rowspan=" + reCount + ">" + orderStore + "</td><td rowspan=" + reCount + ">" + orderAddress + "</td><td rowspan=" + reCount + ">" + orderContact + "</td><td>" + productName + "</td><td>" + productPrice + "</td><td>" + packageString + "</td><td>" + unitPrice + "</td><td>" + orderDetailProductCount + "</td><td>" + realUnit + "</td><td>" + realPrice + "</td><td rowspan=" + reCount + ">" + earlyTime + "</td><td rowspan=" + reCount + ">" + latestTime + "</td><td rowspan=" + reCount + ">" + remark + "</td><td rowspan=" + reCount + ">" + canceled + "</td></tr>");
                                            }
                                            else {
                                                $('#allDetailDiv table tbody').append("<tr><td>" + productName + "</td><td>" + productPrice + "</td><td>" + packageString + "</td><td>" + unitPrice + "</td><td>" + orderDetailProductCount + "</td><td>" + realUnit + "</td><td>" + realPrice + "</td></tr>");
                                            }*/
                                            $('#allDetailDiv table tbody').append("<tr><td>" + orderID + "</td><td>"+storeID+"</td><td>" + orderStore + "</td><td>" + orderAddress + "</td><td>" + orderContact + "</td><td>" + earlyTime + "</td><td>" + latestTime + "</td><td>" + remark + "</td><td>" + productName + "</td><td>" + productPrice + "</td><td>" + packageString + "</td><td>" + unitPrice + "</td><td>" + orderDetailProductCount + "</td><td>" + realUnit + "</td><td>" + realPrice + "</td><td>" + canceled + "</td></tr>")
                                        }
                                    }
                                    if (tag == obj.length) {
                                        method1('allDetail');
                                    }
                                });
                            })(i);
                        }
                    }
                    else {
                        alert("该日暂时没有新的订单!");
                    }
                },
                error: function (o, e) {
                    alert(e.message);
                }
            });
        }
    }
    else{
        alert("你未选择日期!");
    }
}




var idTmr;
function  getExplorer() {
    var explorer = window.navigator.userAgent ;
    //ie
    if (explorer.indexOf("MSIE") >= 0) {
        return 'ie';
    }
    //firefox
    else if (explorer.indexOf("Firefox") >= 0) {
        return 'Firefox';
    }
    //Chrome
    else if(explorer.indexOf("Chrome") >= 0){
        return 'Chrome';
    }
    //Opera
    else if(explorer.indexOf("Opera") >= 0){
        return 'Opera';
    }
    //Safari
    else if(explorer.indexOf("Safari") >= 0){
        return 'Safari';
    }
}
function method1(tableid) {//整个表格拷贝到EXCEL中
    if(getExplorer()=='ie')
    {
        var curTbl = document.getElementById(tableid);
        var oXL = new ActiveXObject("Excel.Application");

        //创建AX对象excel
        var oWB = oXL.Workbooks.Add();
        //获取workbook对象
        var xlsheet = oWB.Worksheets(1);
        //激活当前sheet
        var sel = document.body.createTextRange();
        sel.moveToElementText(curTbl);
        //把表格中的内容移到TextRange中
        sel.select();
        //全选TextRange中内容
        sel.execCommand("Copy");
        //复制TextRange中内容
        xlsheet.Paste();
        //粘贴到活动的EXCEL中
        oXL.Visible = true;
        //设置excel可见属性

        try {
            var fname = oXL.Application.GetSaveAsFilename("Excel.xls", "Excel Spreadsheets (*.xls), *.xls");
        } catch (e) {
            print("Nested catch caught " + e);
        } finally {
            oWB.SaveAs(fname);

            oWB.Close(savechanges = false);
            //xls.visible = false;
            oXL.Quit();
            oXL = null;
            //结束excel进程，退出完成
            //window.setInterval("Cleanup();",1);
            idTmr = window.setInterval("Cleanup();", 1);

        }

    }
    else
    {
        tableToExcel(tableid);
    }
}
function Cleanup() {
    window.clearInterval(idTmr);
    CollectGarbage();
}
var tableToExcel = (function() {
    var uri = 'data:application/vnd.ms-excel;base64,',
        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) },
        format = function(s, c) {
            return s.replace(/{(\w+)}/g,
                function(m, p) { return c[p]; }) }
    return function(table, name) {
        if (!table.nodeType) table = document.getElementById(table)
        var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}
        window.location.href = uri + base64(format(template, ctx))
    }
})()


function SearchStore() {
    var storeName = $("#store").val();
    if (storeName == '') {
        return false;
    }
    var sql = "select * from Store where enabled=true and storeName like \'%" + storeName + "%\'";
    AV.Query.doCloudQuery(sql, {
        success: function(result) {
            var object = result.results;
            var len = object.length;
            if(len!=0){
                var Storeli='';
                for(var i=0;i<len;i++){
                    var obj=object[i];
                    var storeName=obj.get('storeName');
                    var address=obj.get('storeAddress');
                    var cityID=obj.get('city').id;
                    var storeID=obj.id;
                    Storeli+="<li onclick=\'checkStore(\""+storeID+"\",\""+storeName+"\",\""+cityID+"\")\'><a>"+storeName+"<small>"+address+"</small></a></li>";
                }
                $("#input_ul").html(Storeli);
                $(".search_results").css('display','block');
            }
        },
        error: function(error) {
            //alert('error' + error.message);
        }
    });
}

function checkStore(id,storename,cityID){
    $(".search_results").css('display','none');
    $("#store").val(storename);
    $("#store").attr('name',id);
    $("#store").attr('city',cityID);
    storeChange();
}

/*
 * input值监控函数  输入11位手机号后立即进行查询
 */
var INPUTNAME='';//用户保存输入的店铺名称 用于比较是否变化
function OnInput(event, tage) {
    var value = event.target.value;
    var len = value.length;
    if (tage == 'user') {
        if (len == 11) {
            SearchName(tage);
        } else {
            var html = "请输入11位手机号";
            $("#userAlert").html(html);
            $("#user").attr('name', '');
            $("#user").css('color', '#999');
            $("#userAlert").css('color', 'red');
        }
    }
    else{
        if(INPUTNAME!=value){
            SearchStore();//查询店铺
            INPUTNAME=value;
        }
    }
}
function strDate(str){
    var attr=str.split(/-/);
    return attr[2]+"-"+attr[1]+"-"+attr[0]
}
function dateOrder() {
    if($('#datePicker').val()!="") {
        var date=strDate($('#datePicker').val());
        AV.Cloud.run("SetOrderNumberInDay",{"date":date},{
            success: function (res) {
                alert("排序成功!");
            },
            error: function (o,e) {
                alert("排序失败!");
            }
        })
    }
    else{
        alert("你未选择日期");
    }
}