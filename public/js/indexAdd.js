/**
 * Created by liangyi on 15-9-2.
 */
$(document).ready(
    function(){
       // setul();
        editType();
        $("#dtBox").DateTimePicker();
        //editProduct();
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
                   // html+='<a  href="javascript:judgeoptions(\''+object[i].get("typeName")+'\',\''+object[i].id+'\')" class="list-group-item ">'+object[i].get("typeName")+'</a>';

                }

            }
            $("#productType").html(html);

        }
    }).then(function(){
      var value= document.getElementById("productType");
       // alert(value);
      editProduct(value);
    });

}


function add(){      /*实行增加操作*/
    var url=geturl();


    var selectIndex = document.getElementById("productType").selectedIndex;
    var type = document.getElementById("productType").options[selectIndex].id;
    var typeName=document.getElementById("productType").options[selectIndex].text;
   // alert(typeName);
    //var type=document.getElementById("productType").value;
  //  alert(type);
    var selectIndex0 = document.getElementById("product").selectedIndex;
    var productId = document.getElementById("product").options[selectIndex0].id;
    var productName=document.getElementById("product").options[selectIndex0].text;
   //alert(productName);
        var ProductType=AV.Object.extend("ProductType");
        var productType=new ProductType();
        productType.set("objectId",type);

        var Product=AV.Object.extend("Product");
        var productobj=new Product();
        productobj.set("objectId",productId);
   // productType.save();


    var BatchTable=AV.Object.extend("BatchTable");
    var batchTable=new BatchTable();




    var productionPlace=$("#productionPlace").val();
    var dateTime=$("#dateTime").val();

   /* var isQualified= $("#isQualified").val();
    var isOverdue=$("#isOverdue").val();*/
    var date=getNowDate();
   // var batchID=typeName+productName+date+;
    var batchID= $("#batchID").val();
  //  batchTable.set("objectId",url);
    // batchTable.set("serialNo",serialNo);
    batchTable.set("batchID",batchID);
    //   batchTable.set("productType",productType);
    batchTable.set("productionPlace",productionPlace);
    if(dateTime!='')
    {
        batchTable.set("dateTime",addTime(dateTime));
    }

        if(type!="")
        {
            batchTable.set("productType",productType);
        }
    if(productobj!="")
    {
        batchTable.set("product",productobj);
    }



    /*if(isQualified=='false')
    {
        batchTable.set("isQualified",Boolean(0));
    }
    else
    {
        batchTable.set("isQualified",Boolean(1));
    }*/

    // batchTable.set("isQualified",Boolean(parseInt(isQualified)));
    //batchTable.set("isOverdue",Boolean(isOverdue));

    /*if(isOverdue=='false')
    {
        batchTable.set("isOverdue",Boolean(0));
    }
    else
    {
        batchTable.set("isOverdue",Boolean(1));
    }*/
    batchTable.save({
        success:function(object){
            alert("添加成功！");
        //    alert(object.get("originQTReport"));
            /*var fileUploadControl = $("#cdreup")[0];
            if(fileUploadControl.files.length>0)
            {
                if(object.get("originQTReport")!=null)
                {
               //     alert(101);
                    saveReport(object.get("originQTReport").id,object.id,"cdreup");
                    //     saveQTReport(object[0].get("originQTReport").id,url,"cdreup","cdqcup");
                }
                else
                {
                  //  alert(102);
                    saveReport(null,object.id,"cdreup");
                    // saveQTReport(null,url,"cdreup","cdqcup");


                }
            }
            var fileUploadControl01 = $("#cdqcup")[0];
            if(fileUploadControl01.files.length>0)
            {
                object.get("originQTReport")!=null?saveReport(object.get("originQTReport").id,object.id,"cdqcup"):saveReport(null,object.id,"cdqcup");
            }

            var fileUploadControl02 = $("#tnreup")[0];
            if(fileUploadControl02.files.length>0)
            {
                object.get("govQTReport")!=null?saveReport(object.get("govQTReport").id,object.id,"tnreup"):saveReport(null,object.id,"tnreup");
            }

            var fileUploadControl03 = $("#tnqcup")[0];
            if(fileUploadControl03.files.length>0)
            {
                object.get("govQTReport")!=null?saveReport(object.get("govQTReport").id,object.id,"tnqcup"):saveReport(null,object.id,"tnqcup");
            }

            var fileUploadControl04 = $("#gyreup")[0];
            if(fileUploadControl04.files.length>0)
            {
                object.get("supplierQTReport")!=null?saveReport(object.get("supplierQTReport").id,object.id,"gyreup"):saveReport(null,object.id,"gyreup");
            }

            var fileUploadControl05 = $("#gyqcup")[0];
            if(fileUploadControl05.files.length>0)
            {
                object.get("supplierQTReport")!=null?saveReport(object.get("supplierQTReport").id,object.id,"gyqcup"):saveReport(null,object.id,"gyqcup");
            }*/
        }
    }).then(
            function(object){
           //     alert(object.id);
                var QTReport=AV.Object.extend("QTReport");
                var qTReprot=new QTReport();
                qTReprot.save({
                    success:function(obj){
                     //   alert(222);
                        object.set("originQTReport",obj);
                        object.save();

                    }
                });
                return object;
            }
    ).then(
            function(object){
                var QTReport=AV.Object.extend("QTReport");
                var qTReprot=new QTReport();
                qTReprot.save({
                    success:function(obj){
                        object.set("govQTReport",obj);
                        object.save();

                    }
                });
                return object;
            }
    ).then(
            function(object){
                var QTReport=AV.Object.extend("QTReport");
                var qTReprot=new QTReport();
                qTReprot.save({
                    success:function(obj){
                        object.set("supplierQTReport",obj);
                        object.save({
                            success:function(){
                                window.location.href="../BatchTable/index.html";
                            }
                        });

                    }
                });
            }
        );
}
/*function saveReport(qid,id,qtname){

    var QTReport=AV.Object.extend("QTReport");
    var qTReport=new QTReport();
    // qTReport.id=qid!=null?qid:null;
    if(qid!=null)
    {
        qTReport.id=qid;
    }

    qTReport.save({success:function(){
        //   alert(8888888888888);
    }}).try(
        function(object){
            var fileUploadControl = $("#"+qtname)[0];

            if (fileUploadControl.files.length > 0)
            {
                //   alert("888"+fileUploadControl.files.length);
                var file = fileUploadControl.files[0];

                //var name = "avatar.jpg";
                var name=getDate(new Date())+".jpg";
                var avFile = new AV.File(name, file);
                avFile.save({
                    success:function(obj){
                        //     alert("up");
                        var qname={"cdreup":"reportImage","tnreup":"reportImage","cdqcup":"QCImage","tnqcup":"QCImage","gyqcup":"QCImage","gyreup":"reportImage"}[qtname];
                        object.set(qname,obj);
                        object.save({
                            success:function(){
                                alert("upload success!");
                            }
                        });
                    },error:function(obj,error){
                        alert(error.message);
                    }
                });

            }
            return object;
        }
    ).try(
        function(object){
            var BatchTable=AV.Object.extend("BatchTable");
            var batchTable=new BatchTable();
            batchTable.set("objectId",id);
            console.log(object);

            if(qtname=="cdreup"||qtname=="cdqcup")
            {
                //  alert(re);
                batchTable.set("originQTReport",object);
            }
            else if(qtname=="tnreup"||qtname=="tnqcup")
            {
                batchTable.set("govQTReport",object);
            }
            else
            {
                batchTable.set("supplierQTReport",object);
            }

            batchTable.save({
                success:function(){
                 //   alert("set success!");
                }
            });

        }
    );
}*/

function editProduct(obj){
  //  alert(obj.value);
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
       //     alert(object.length);
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

function getNowDate() {
    var date=new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
   // var hour=date.getHours();
    return year.toString() + month.toString() + day.toString();
}