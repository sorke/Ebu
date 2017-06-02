/**
 * Created by liangyi on 15-9-2.
 */

$(document).ready(
    function(){
        /*var d = new Date().format('dd-MM-yyyy hh:mm:ss');
        alert(d);*/
        // alert(BirthDay);
     //   setul();
        editType();
        $("#dtBox").DateTimePicker();
     //   $("#product").val("111");
        /*var name=getDate(new Date());
        alert(name);*/
    }

);
function judgeoptions(name,id){
    document.getElementById("isTerminateOption").name=id;
    document.getElementById("isTerminateOption").innerHTML=name;
}
function setul(){
    document.getElementById("divall").onmouseover=function(){

        document.getElementById("setul").setAttribute("style","display:block");
    };
    document.getElementById("divall").onmouseout=function(){

        document.getElementById("setul").setAttribute("style","display:none");
    }
}
function editType(){

    var ProductType=AV.Object.extend("ProductType");
    var query=new AV.Query(ProductType);
    query.ascending("orderNumber");
    query.find({
        success:function(object){
            var len=object.length;
            var html='';
            for(var i=0;i<len;i++)
            {

                if(object[i].get("typeName")!=null)
                {
                    html+='<option id='+object[i].id+'>'+object[i].get("typeName")+'</option>';

                }

            }
            $("#productType").html(html);

        }
    }).then(function(){
        edit();
    });

}

function edit(){
    var url=geturl();
    var BatchTable=AV.Object.extend("BatchTable");
    var query=new AV.Query(BatchTable);
    query.equalTo('objectId',url);
    query.include('productType');
    query.include('originQTReport');
    query.include('govQTReport');
    query.include('supplierQTReport');
    query.include('product');
    query.find({
        success:function(object){
            var serialNo='';

            if(object[0].get("serialNo")!=null)
            {
                serialNo=object[0].get("serialNo");

            }

            var batchID='';
            if(object[0].get("batchID")!=null)
            {
                batchID=object[0].get("batchID");

            }

            var productType='';
            if(object[0].get("productType")!=null)
            {

                productType=object[0].get("productType").get("typeName");

            }
            var product='';
            if(object[0].get("product")!=null)
            {
                product=object[0].get("product").get("productName");
                var packageString=object[0].get("product").get("packageString")==null?'':object[0].get("product").get("packageString");
            }
          //  alert(product);
            var cdre='';
            var cdqc='';
            var cdis='';

            if(object[0].get("originQTReport")!=null)
            {
                if(object[0].get("originQTReport").get("reportImage")!=null)
                cdre=object[0].get("originQTReport").get("reportImage").url();
                if(object[0].get("originQTReport").get("qcImage")!=null)
                cdqc=object[0].get("originQTReport").get("qcImage").url();
                cdis=object[0].get("originQTReport").get("isQualified");

            }


            var tnre='';
            var tnqc='';
            var tnis='';
            if(object[0].get("govQTReport")!=null)
            {

                if(object[0].get("govQTReport").get("reportImage")!=null)
                tnre=object[0].get("govQTReport").get("reportImage").url();
                if(object[0].get("govQTReport").get("qcImage")!=null)
                tnqc=object[0].get("govQTReport").get("qcImage").url();
                tnis=object[0].get("govQTReport").get("isQualified");
            }


            var gyre='';
            var gyqc='';
            var gyis='';
            if(object[0].get("supplierQTReport")!=null)
            {

                //supplierQTReport=object[0].get("supplierQTReport").get("supplierQTReport");
                if(object[0].get("supplierQTReport").get("reportImage")!=null)
                gyre=object[0].get("supplierQTReport").get("reportImage").url();
                if(object[0].get("supplierQTReport").get("qcImage")!=null)
                gyqc=object[0].get("supplierQTReport").get("qcImage").url();
                gyis=object[0].get("supplierQTReport").get("isQualified");
            }

            var productionPlace='';
            if(object[0].get("productionPlace")!=null)
            {
                productionPlace=object[0].get("productionPlace");

            }

            var dateTime='';
            if(object[0].get("dateTime")!=null)
            {
                dateTime=object[0].get("dateTime");
                dateTime=new Date(dateTime).format('dd-MM-yyyy hh:mm:ss');

            }

            var isQualified='';
            if(object[0].get("isQualified")!=null)
            {
                isQualified=object[0].get("isQualified");

            }


            var isOverdue='';
            if(object[0].get("isOverdue")!=null)
            {
                isOverdue=object[0].get("isOverdue");

            }

            $("#serialNo").val(serialNo);
            $("#batchID").val(batchID);

            $("#productionPlace").val(productionPlace);
            $("#dateTime").val(dateTime);
     //       alert(productType);
           /* var selectid=document.getElementById("product");
            selectid[0]=new Option(product,0);
            selectid.options[0].selected=true;*/
        //    alert(document.getElementById("product"));


            document.getElementById("productType").value=productType;
            /*var value= document.getElementById("productType");
            console.log(value);
            console.log(value.value);
            // alert(value);
            editProduct(value);*/

            $("#op1").text(product+packageString);
           // document.getElementById("product").value=product;
            var provalue=document.getElementById("product");
            console.log(document.getElementById("product").value);
            console.log(provalue);
          //  document.getElementById("product").value=provalue;
          //  document.getElementById("product").options[1].selected=true;
          //  $("#productType").val(productType);
           /* var selectIndex = document.getElementById("productType").selectedIndex;
            alert(selectIndex);
            document.getElementById("productType").options[selectIndex].selected=true;*/
         //   $("#isQualified").html(isQualified);
           // document.getElementById("isQualified").options.add(Option(isQualified,0));

            if(isQualified===true)
            {
                document.getElementById("isQualified").options[1].selected=true;
            }
            else
            {

                document.getElementById("isQualified").options[0].selected=true;
            }
        //    alert(isOverdue);
            if(isOverdue===true)
            {
                document.getElementById("isOverdue").options[0].selected=true;
            }
            else
            {

                document.getElementById("isOverdue").options[1].selected=true;
            }
            //$("#isOverdue").val(isOverdue);

            document.getElementById("cdre").src=cdre;
            document.getElementById("cdqc").src=cdqc;
           // $("#cdis").val(cdis);
         //   alert(cdis);
            if(cdis===true)
            {
                document.getElementById("cdis").options[1].selected=true;
            }
            else
            {

                document.getElementById("cdis").options[0].selected=true;
            }
            document.getElementById("tnre").src=tnre;
            document.getElementById("tnqc").src=tnqc;
            if(tnis===true)
            {
                document.getElementById("tnis").options[1].selected=true;
            }
            else
            {

                document.getElementById("tnis").options[0].selected=true;
            }

            document.getElementById("gyre").src=gyre;
            document.getElementById("gyqc").src=gyqc;
            if(gyis===true)
            {
                document.getElementById("gyis").options[1].selected=true;
            }
            else
            {

                document.getElementById("gyis").options[0].selected=true;
            }
           // $("cdre").src(cdre.url());
        }
    });

}
function saveis(id,is){

    var QTReport=AV.Object.extend("QTReport");
    var qTReport=new QTReport();
    qTReport.id=id;
    if(is=='不合格')
    {
        qTReport.set("isQualified",Boolean(0));
    }
    else
    {
        qTReport.set("isQualified",Boolean(1));
    }
    qTReport.save();

}
function saveisType(){
    var url=geturl();
    var BatchTable=AV.Object.extend("BatchTable");

    var query=new AV.Query(BatchTable);
    query.equalTo("objectId",url);
 //   query.include("originQTReport");
    query.find({
        success:function(object){

            if(object[0].get("originQTReport")!=null)
            {
                var cdisid=object[0].get("originQTReport").id;
                var cdis=$("#cdis").val();
                saveis(cdisid,cdis);
            }

            if(object[0].get("govQTReport")!=null)
            {
                var tnisid=object[0].get("govQTReport").id;
                var tnis=$("#tnis").val();
                saveis(tnisid,tnis);
            }

            if(object[0].get("supplierQTReport")!=null)
            {
                var gyisid=object[0].get("supplierQTReport").id;
                var gyis=$("#gyis").val();
                saveis(gyisid,gyis);

            }



        }
    });
}
function save(){
    saveisType();
    var url=geturl();
    var type='';
    var selectIndex = document.getElementById("productType").selectedIndex;
    if(parseInt(selectIndex)>=0)
     type = document.getElementById("productType").options[selectIndex].id;
  //  alert(type);

    var selectIndex0 = document.getElementById("product").selectedIndex;
    var productId = document.getElementById("product").options[selectIndex0].id;
    //alert(productId.length);

    var ProductType=AV.Object.extend("ProductType");
    var productType=new ProductType();
    productType.set("objectId",type);

    if(productId.length!=3)
    {
        var Product=AV.Object.extend("Product");
        var product=new Product();
        product.set("objectId",productId);
    }

    var BatchTable=AV.Object.extend("BatchTable");
    var batchTable=new BatchTable();
    var query=new AV.Query(BatchTable);
    query.equalTo("objectId",url);
    query.include("originQTReport");
    query.find({
        success:function(object){

        }
    });
    var batchID= $("#batchID").val();
    var productionPlace=$("#productionPlace").val();
    var dateTime=$("#dateTime").val();
    var isQualified= $("#isQualified").val();
    var isOverdue=$("#isOverdue").val();
    batchTable.set("objectId",url);
    batchTable.set("batchID",batchID);
    if(type!="")
    {
        batchTable.set("productType",productType);
    }if(product!="")
    {
        batchTable.set("product",product);
    }
    batchTable.set("productionPlace",productionPlace);
    if(dateTime!='')
    {
        batchTable.set("dateTime",addTime(dateTime));
    }

    if(isQualified=='不合格')
    {
        batchTable.set("isQualified",Boolean(0));
    }
    else
    {
        batchTable.set("isQualified",Boolean(1));
    }
    if(isOverdue=='过期')
    {
        batchTable.set("isOverdue",Boolean(0));
    }
    else
    {
        batchTable.set("isOverdue",Boolean(1));
    }
    batchTable.save({
        success:function(){
            alert("更新成功!");
            if($("#cdreup")[0].files.length<=0&&$("#cdqcup")[0].files.length<=0&&$("#tnreup")[0].files.length<=0&&$("#tnqcup")[0].files.length<=0&&$("#gyreup")[0].files.length<=0&&$("#gyqcup")[0].files.length<=0)
            {
                window.location.reload();
            }
        }

    });
}
function editProduct(obj){
    var productType=$("#productType option:checked").attr("id");

    var ProductType=AV.Object.extend("ProductType");
    var typeObject=new ProductType();
    typeObject.id=productType;
    var value=obj.value;
    var Product=AV.Object.extend("Product");
    var query=new AV.Query(Product);
    query.ascending("orderNumber");
    query.include("productType");
    query.equalTo("productType",typeObject);
    query.find({
        success:function(object){

            var len=object.length;
            var html='';
            for(var i=0;i<len;i++)
            {

                    var packageString=object[i].get("packageString")==null?'':object[i].get("packageString");

                    html+='<option id='+object[i].id+'>'+object[i].get("productName")+packageString+'</option>';


            }
            $("#product").html(html);
        }
    });

}
var flag=0;
var mask = '<div id="artwl_mask" style="font-size: 100px;padding-top: 100px;text-align: center" >正在上传中..</div>';
var contain = '<div id="artwl_boxcontain">\
                   <div id="artwl_showbox">\
                      <p style="font-size: 500px">正在上传中..</p>\
                   </div>\
               </div>';
var cssCode='#artwl_mask{background-color: #000;position: fixed;top: 0px;left: 0px;z-index:2000;width: 100%;height: 100%;opacity: 0.5;filter: alpha(opacity=50);display: none;}\
             #artwl_boxcontain{margin: 0 auto;position: fixed;z-index: 2002;line-height: 28px;display: none;}\
             #artwl_showbox{padding: 10px;background: #FFF;z-index:2003;border-radius: 5px;margin: 20px;min-width:300px;min-height:200px;}'
function upFile(obj){
    if ($("#artwl_mask").length == 0) {
        $("body").append(mask+contain);
        $("head").append("<style type='text/css'>" + cssCode + "</style>");
        $("#artwl_mask").show();
        $("#artwl_boxcontain").show();


    }
    var file = obj.files[0];

    var name=getDate(new Date())+".jpg";
    var avFile = new AV.File(name, file);
    avFile.save({
        success:function(object){
            flag=1;
            $("#artwl_mask").hide();
            $("#artwl_boxcontain").hide();
        },error:function(obje,err){
            alert(err.message);
        }
    }).then(function(object){

        var url=geturl();
        var BatchTable=AV.Object.extend("BatchTable");
        var query=new AV.Query(BatchTable);
        query.include("originQTReport");
        query.include("govQTReport");
        query.include("supplierQTReport");
        query.equalTo("objectId",url);
        query.find({
            success:function(ob){

                /*  var qtObject={1:"222",}[obj.id]||'';*/
                if(obj.id=="cdreup")
                {
                    ob[0].get("originQTReport").set("reportImage",object);
                    ob[0].get("originQTReport").save({
                        success:function(){
                            window.location.reload();
                        }
                    });
                }

                if(obj.id=="cdqcup")
                {
                    ob[0].get("originQTReport").set("qcImage",object);
                    ob[0].get("originQTReport").save({
                        success:function(){
                            window.location.reload();
                        }
                    });
                }

                if(obj.id=="tnreup")
                {
                    ob[0].get("govQTReport").set("reportImage",object);
                    ob[0].get("govQTReport").save({
                        success:function(){
                            window.location.reload();
                        }
                    });
                }

                if(obj.id=="tnqcup")
                {
                    ob[0].get("govQTReport").set("qcImage",object);
                    ob[0].get("govQTReport").save({
                        success:function(){
                            window.location.reload();
                        }
                    });
                }

                if(obj.id=="gyreup")
                {
                    ob[0].get("supplierQTReport").set("reportImage",object);
                    ob[0].get("supplierQTReport").save({
                        success:function(){
                            window.location.reload();
                        }
                    });
                }

                if(obj.id=="gyqcup")
                {
                    ob[0].get("supplierQTReport").set("qcImage",object);
                    ob[0].get("supplierQTReport").save({
                        success:function(){
                            window.location.reload();
                        }
                    });
                }




            }
        });
    });
    setTimeout(function(){
        if(flag==0)
        {
            $("#artwl_mask").html("加载失败");
            alert("加载失败！");
            window.location.reload();
        }

    },15000);

}
function savecdre(id){
    var fileUploadControl = $("#cdreup")[0];
    if (fileUploadControl.files.length > 0)
    {
        //   alert("888"+fileUploadControl.files.length);
        var file = fileUploadControl.files[0];

        //var name = "avatar.jpg";
        var name=getDate(new Date())+".jpg";
        var avFile = new AV.File(name, file);
        avFile.save().then(
            function(object){
                var QTReport=AV.Object.extend("QTReport");
                var qTReport=new QTReport();
                qTReport.set("objectId",id);
                qTReport.set("reportImage",object);
                qTReport.save({
                    success:function(){
                        window.location.reload();
                    }
                });
            }
        );
    }
}


function savecdqc(id){
    var fileUploadControl = $("#cdqcup")[0];
    if (fileUploadControl.files.length > 0)
    {
        //   alert("888"+fileUploadControl.files.length);
        var file = fileUploadControl.files[0];

        //var name = "avatar.jpg";
        var name=getDate(new Date())+".jpg";
        var avFile = new AV.File(name, file);
        avFile.save().then(
            function(object){
                var QTReport=AV.Object.extend("QTReport");
                var qTReport=new QTReport();
                qTReport.set("objectId",id);
                qTReport.set("qcImage",object);
                qTReport.save({
                    success:function(){
                        window.location.reload();
                    }
                });
            }
        );
    }
}

function savetnre(id){
    var fileUploadControl = $("#tnreup")[0];
    if (fileUploadControl.files.length > 0)
    {
        //   alert("888"+fileUploadControl.files.length);
        var file = fileUploadControl.files[0];

        //var name = "avatar.jpg";
        var name=getDate(new Date())+".jpg";
        var avFile = new AV.File(name, file);
        avFile.save().then(
            function(object){
                var QTReport=AV.Object.extend("QTReport");
                var qTReport=new QTReport();
                qTReport.set("objectId",id);
                qTReport.set("reportImage",object);
                qTReport.save({
                    success:function(){
                        window.location.reload();
                    }
                });
            }
        );
    }
}


function savetnqc(id){
    var fileUploadControl = $("#tnqcup")[0];
    if (fileUploadControl.files.length > 0)
    {
        //   alert("888"+fileUploadControl.files.length);
        var file = fileUploadControl.files[0];

        //var name = "avatar.jpg";
        var name=getDate(new Date())+".jpg";
        var avFile = new AV.File(name, file);
        avFile.save().then(
            function(object){
                var QTReport=AV.Object.extend("QTReport");
                var qTReport=new QTReport();
                qTReport.set("objectId",id);
                qTReport.set("qcImage",object);
                qTReport.save({
                    success:function(){
                        window.location.reload();
                    }
                });
            }
        );
    }
}

function savegyre(id){
    var fileUploadControl = $("#gyreup")[0];
    if (fileUploadControl.files.length > 0)
    {
        //   alert("888"+fileUploadControl.files.length);
        var file = fileUploadControl.files[0];

        //var name = "avatar.jpg";
        var name=getDate(new Date())+".jpg";
        var avFile = new AV.File(name, file);
        avFile.save().then(
            function(object){
                var QTReport=AV.Object.extend("QTReport");
                var qTReport=new QTReport();
                qTReport.set("objectId",id);
                qTReport.set("reportImage",object);
                qTReport.save({
                    success:function(){
                        window.location.reload();
                    }
                });
            }
        );
    }
}


function savegyqc(id){
    var fileUploadControl = $("#gyqcup")[0];
    if (fileUploadControl.files.length > 0)
    {
        //   alert("888"+fileUploadControl.files.length);
        var file = fileUploadControl.files[0];

        //var name = "avatar.jpg";
        var name=getDate(new Date())+".jpg";
        var avFile = new AV.File(name, file);
        avFile.save().then(
            function(object){
                var QTReport=AV.Object.extend("QTReport");
                var qTReport=new QTReport();
                qTReport.set("objectId",id);
                qTReport.set("qcImage",object);
                qTReport.save({
                    success:function(){
                        window.location.reload();
                    }
                });
            }
        );
    }
}