/**
 * Created by liangyi on 15-9-23.
 */
$(document).ready(function () {
    bindDelivery('main');
})

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
            $('#delivery tbody tr').remove();
            bindDelivery();
        }
    }
    if(tag=="pastpage"){
        if(page>0){
            $('#delivery tbody tr').remove();
            page--;
            $('#delivery tbody tr').remove();
            bindDelivery();
        }
        else{
            alert("已经是第一页了!");
        }
    }
}
function bindDelivery(tag) {
    $('#delivery tbody tr').remove();
    var Delivery=AV.Object.extend('Delivery');
    var query=new AV.Query(Delivery);
    query.include('route');
    query.equalTo("enabled",true);
    if (tag == "main") {
        query.count({
            success: function (count) {
                maincount = count;
            }
        });
    }
    query.limit(10);
    query.skip(10 * page);
    query.find({
        success: function (obj) {
            for(var i=0;i<obj.length;i++) {
                $('#delivery tbody').append("<tr id="+obj[i].id+"><td>" + obj[i].get('deliveryName') + "</td><td>"+obj[i].get('deliveryPhone')+"</td><td>"+obj[i].get('route').get('routeName')+"</td><td><a href='DeliveryAdd.html?id="+obj[i].id+"'>编辑</a>|<a href='#' name='delete'>删除</a></td></tr>");
                $('#delivery a[name="delete"]').unbind('click').click(function () {
                    if(confirm("确认删除?")){
                        var Delivery=AV.Object.extend('Delivery');
                        var query=new AV.Query(Delivery);
                        query.get($(this).parent().parent().attr('id'),{success: function (obj) {
                            obj.set('enabled',false);
                            obj.save(null,{success: function () {
                                bindDelivery();
                            }})
                        }});
                    }
                })
            }
        }
    });
}
