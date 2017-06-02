/**
 * Created by caonima on 2015/9/11.
 */
$(document).ready(function () {
    if($.inArray("131",roleArray)>=0){
        $('#show1').show();
    }
    if($.inArray("132",roleArray)>=0){
        $('#show0').show();
        $('#show2').show();
    }
    $('#dtBox').DateTimePicker();
    bindOrder();
    bindOrderSum4SC("main");
    $('#show0').click(function () {
        $('#show0').addClass('active');
        $('#show2').removeClass('active');
        $('#show1').removeClass('active');
        $('#productCount').show();
        $('#orderCount').hide();
        $('#orderContent').hide();
    });
    $('#show1').click(function () {
        $('#show0').removeClass('active');
        $('#show2').removeClass('active');
        $('#show1').addClass('active');
        $('#orderCount').show();
        $('#orderContent').hide();
        $('#productCount').hide();
    });
    $('#show2').click(function () {
        $('#show0').removeClass('active');
        $('#show1').removeClass('active');
        $('#show2').addClass('active');
        $('#orderCount').hide();
        $('#productCount').hide();
        $('#orderContent').show();
    });
})

function bindProductCount(){
    if($('#dateInput').val()) {

        $('#productCount tbody tr').remove();
        var OrderDetail = AV.Object.extend('OrderDetail');
        var query = new AV.Query(OrderDetail);
        query.equalTo("canceled", false);
        query.lessThan("createdAt", strChangeDate($('#dateInput').val(), 1));
        query.greaterThan("createdAt", strChangeDate($('#dateInput').val(), 0));
        query.include('orderSC');
        query.include('orderDetailProductName');
        query.ascending('orderNumber');
        query.find({
            success: function (obj) {
                if(obj.length==0){
                    alert($('#dateInput').val()+" 并没有下货订单!");
                }
                else {
                    var delArray = new Array();
                    for (var i = 0; i < obj.length; i++) {
                        var orderCount = obj[i].get('orderDetailProductCount');
                        var realCount = obj[i].get('realUnit');
                        var orderSC = obj[i].get('orderSC') == null ? " " : obj[i].get('orderSC').get('scName');
                        var product = obj[i].get('orderDetailProductName') == null ? "这个菜被删了" : obj[i].get('orderDetailProductName').get('productName') + " 【" + obj[i].get('orderDetailProductName').get('packageString') + "】";
                        for (var j = i + 1; j < obj.length; j++) {
                            if (obj[i].get('orderDetailProductName').id == obj[j].get('orderDetailProductName').id) {
                                orderCount += obj[j].get('orderDetailProductCount');
                                realCount += obj[j].get('realUnit');
                                orderSC = obj[j].get('orderSC') == null ? " " : obj[j].get('orderSC').get('scName');
                                product = obj[j].get('orderDetailProductName') == null ? "这个菜被删了" : obj[j].get('orderDetailProductName').get('productName') + " 【" + obj[j].get('orderDetailProductName').get('packageString') + "】";
                                if ($.inArray(j, delArray) < 0) {
                                    delArray.push(j);
                                }
                            }
                        }
                        $('#productCount tbody').append("<tr><td>" + orderSC + "</td><td>" + product + "</td><td>" + orderCount + "</td><td>" + realCount + "</td><td>" + dateStr(obj[i].createdAt) + "</td></tr>")
                    }
                    delArray.sort(function(a,b){return b-a});
                    for(var k=0;k<delArray.length;k++) {
                        $('#productCount tbody').find('tr').eq(delArray[k]).remove();
                    }
                }
            }
        })
    }
    else{
        alert("查询日期不能为空!");
    }
}

function bindOrder() {
    var tds=$('#orderCount').find('td');
    var OrderTable=AV.Object.extend('OrderTable');
    var query=new AV.Query(OrderTable);
    query.equalTo("enabled",true);
    query.count({success: function (count) {
        tds[0].innerHTML=count+"笔";
    }});
    query.equalTo("canceled",true);
    query.count({success: function (count) {
        tds[2].innerHTML=count+"笔";
    }});
    query.equalTo("canceled",false);
    query.count({success: function (count) {
        tds[1].innerHTML=count+"笔";
    }});
    for(var i=1;i<11;i++){
        query.equalTo("orderStatus",i);
        (function(i){query.count({success: function (count) {
            tds[i+2].innerHTML=count+"笔";
        }})})(i);
    }


    var queryNow=new AV.Query(OrderTable);
    queryNow.greaterThan("orderTime",nowDay());
    queryNow.equalTo("enabled",true);
    queryNow.count({success: function (count) {
        tds[13].innerHTML=count+"笔";
    }});
    queryNow.equalTo("canceled",true);
    queryNow.count({success: function (count) {
        tds[15].innerHTML=count+"笔";
    }});
    queryNow.equalTo("canceled",false);
    queryNow.count({success: function (count) {
        tds[14].innerHTML=count+"笔";
    }});
    for(var i=1;i<11;i++){
        queryNow.equalTo("orderStatus",i);
        (function(i){queryNow.count({success: function (count) {
            tds[i+15].innerHTML=count+"笔";
        }})})(i);
    }

}
var page=0;
var maincount=0;
function pager(tag) {
    if(tag=="nextpage"){
        page++;
        if(page*100>=maincount){
            page--;
            alert("已经是最后一页了!")
        }
        else{
            $('#orderContent tbody').remove();
            bindOrderSum4SC();
        }
    }
    if(tag=="pastpage"){
        if(page>0){
            $('#orderContent tbody').remove();
            page--;
            bindOrderSum4SC();
        }
        else{
            alert("已经是第一页了!");
        }
    }
}
function bindOrderSum4SC(tag){
    var sameDate='';
    var orderSum4SC=AV.Object.extend('OrderSum4SC');
    $('#orderContent tbody').remove();
    var query=new AV.Query(orderSum4SC);
    query.include('sortingCenter');
    query.include('product');
    query.descending('date');
    if(tag=="main")
    {
        query.count({
            success:function(count){
                maincount=count;
            }
        });
    }
    query.limit(100);
    query.skip(100*page);
    query.find({
        success: function (obj) {
            for(var i=0;i<obj.length;i++) {
                var sc=obj[i].get('sortingCenter')==null?" ":obj[i].get('sortingCenter').get('scName');
                var product=obj[i].get('product')==null?" ":obj[i].get('product').get('productName')+" 【"+obj[i].get('product').get('packageString')+"】";
                var date=dateStr(obj[i].get('date'));
                if (sameDate != date) {
                    $('#orderContent').append("<tbody><tr><th colspan='4' style='text-align: center'>" + shortDateStr(obj[i].get('date')) + "</th></tr></tbody>");
                    if(i==obj.length){
                        sameDate='';
                    }
                    else {
                        sameDate = dateStr(obj[i + 1].get('date'));
                    }
                }
                $('#orderContent').append("<tbody><tr><td>" + sc + "</td><td>" + product + "</td><td>" + obj[i].get('productCount') + "</td><td>" + date + "</td></tr></tbody>");

            }
        },
        error: function (obj, err) {
            alert(err.message);
        }
    })
}