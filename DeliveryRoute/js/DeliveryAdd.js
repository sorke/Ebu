/**
 * Created by liangyi on 15-9-23.
 */
$(document).ready(function () {
    if(geturlarry().length==0){
        $('#deliveryAdd').show();
        bindRoute();
        $('#submit').click(function () {
            newDelivery("add");
        });
    }
    if(geturlarry().length==1){
        $('#deliveryEdit').show();
        edit();
        $('#submit').click(function () {
            newDelivery('edit');
        });
    }
})
function bindRoute(){
    var DeliveryRoute=AV.Object.extend('DeliveryRoute');
    var query=new AV.Query(DeliveryRoute);
    query.find({
        success: function (obj) {
            for(var i=0;i<obj.length;i++) {
                $('#deliveryAdd select').append("<option value="+obj[i].id+">"+obj[i].get('routeName')+"</option>");
            }
        }
    });
}

function edit() {
    var inputs = $('#deliveryEdit').find('input');
    var Delivery = AV.Object.extend('Delivery');
    var query=new AV.Query(Delivery);
    query.include('route');
    query.get(geturlarry()[0],{
        success: function (obj) {
            inputs[0].value=obj.get('deliveryName');
            inputs[1].value=obj.get('deliveryPhone');
            var DeliveryRoute=AV.Object.extend('DeliveryRoute');
            var query=new AV.Query(DeliveryRoute);
            query.find({
                success: function (obj) {
                    for(var i=0;i<obj.length;i++) {
                        $('#deliveryEdit select').append("<option value="+obj[i].id+">"+obj[i].get('routeName')+"</option>");
                    }
                }
            }).then(function () {
                $('#deliveryEdit select').val(obj.get('route').id);
            });
        }
    })

}

function newDelivery(temp) {
    if(temp="add") {
        var inputs = $('#deliveryAdd').find('input');
        var Delivery = AV.Object.extend('Delivery');
        var delivery = new Delivery();
        delivery.set('deliveryName', inputs[0].value);
        delivery.set('deliveryPhone', parseInt(inputs[1].value));
        var DeliveryRoute = AV.Object.extend('DeliveryRoute');
        var deliveryRoute = new DeliveryRoute();
        deliveryRoute.id = $('#deliveryAdd select').find("option:checked").val();
        delivery.set('route', deliveryRoute);
        if (inputs[0].value != "" && inputs[1].value != "") {
            delivery.save(null, {
                success: function () {
                    alert("提交成功!");
                    window.location.href = "Delivery.html";
                },
                error: function (o, e) {
                    alert(e.message);
                }
            });
        }
    }
    if(temp="edit"){
        var inputs = $('#deliveryEdit').find('input');
        var Delivery = AV.Object.extend('Delivery');
        var query=new AV.Query(Delivery);
        query.include('route');
        query.get(geturlarry()[0], {
            success: function (obj) {
                obj.set('deliveryName', inputs[0].value);
                obj.set('deliveryPhone', parseInt(inputs[1].value));
                var DeliveryRoute = AV.Object.extend('DeliveryRoute');
                var deliveryRoute = new DeliveryRoute();
                deliveryRoute.id = $('#deliveryEdit select').find("option:checked").val();
                obj.set('route', deliveryRoute);
                if (inputs[0].value != "" && inputs[1].value != "") {
                    obj.save(null, {
                        success: function () {
                            alert("修改成功!");
                            window.location.href = "Delivery.html";
                        },
                        error: function (o, e) {
                            alert(e.message);
                        }
                    });
                }
                else{
                    alert("姓名或者电话不能为空_(:зゝ∠)_");
                }
            }
        })
    }


}