/**
 * Created by liangyi on 15-9-9.
 */
$(document).ready(
    function(){

        editType();
        $("#dtBox").DateTimePicker();

    }
);
function judgeAddEdit(){
    var url=geturl();
    //  alert(url);

    if(url==null)
    {

    }
    else
    {
        editProduct();
    }
}
function editProduct(){
    var url=geturl();
    var Product=AV.Object.extend("Product");
    var query=new AV.Query(Product);
    query.include("productType");
    query.include("city");
    query.equalTo("objectId",url);

    query.find({
        success:function(object){
            var productName=object[0].get("productName")==null?'':object[0].get("productName");
   /*   int  */    var productNumber=object[0].get("productNumber")==null?'':parseInt(object[0].get("productNumber"));
            var productID=object[0].get("productID")==null?'':object[0].get("productID");
            var productType=object[0].get("productType")==null?'':object[0].get("productType").get("typeName");
            /*  float */       var productPrice=object[0].get("productPrice")==null?'':parseFloat(object[0].get("productPrice"));
            var unitPrice=object[0].get("unitPrice")==null?'':object[0].get("unitPrice");
            var productImg=object[0].get("productImg")==null?'':object[0].get("productImg").url();
            var ProductDescription=object[0].get("ProductDescription")==null?'':object[0].get("ProductDescription");
            var productUnit=object[0].get("productUnit")==null?'':object[0].get("productUnit");
            var priceUpdateTime=object[0].get("priceUpdateTime")==null?'':new Date (object[0].get("priceUpdateTime")).format('dd-MM-yyyy hh:mm:ss');
       //    alert(priceUpdateTime);
            var enabled=object[0].get("enabled")==null?'':object[0].get("enabled");
            var orderNumber=object[0].get("orderNumber")==null?'':object[0].get("orderNumber");

            var city=object[0].get("city")==null?'':object[0].get("city").get("cityName");
        //    productNumber=parseInt(productNumber);
          //  productPrice=parseFloat(productPrice);
            $("#productName").val(productName);
            $("#productNumber").val(productNumber);
            $("#productID").val(productID);
            $("#productType").val(productType);
            $("#productPrice").val(productPrice);
            $("#unitPrice").val(unitPrice);

            document.getElementById("productImg").src=productImg;
            //$("#productImg").src(productImg);
            $("#ProductDescription").val(ProductDescription);
            $("#productUnit").val(productUnit);
            $("#priceUpdateTime").val(priceUpdateTime);
            $("#orderNumber").val(orderNumber);
            $("#city").val(city);
            if(enabled===true)
            {
                document.getElementById("enabled").options[0].selected=true;
            }
            else
            {

                document.getElementById("enabled").options[1].selected=true;
            }

        }
    });
}

function saveProduct(imgObject){
    var url=geturl();
    var productName=$("#productName").val();
    var productNumber=parseInt($("#productNumber").val());
    var productID=$("#productID").val();
  //  var productType=$("#productType").val();
    var productPrice=parseFloat($("#productPrice").val());
    var unitPrice=$("#unitPrice").val();
    var ProductDescription=$("#ProductDescription").val();
    var productUnit=$("#productUnit").val();
    var orderNumber=$("#orderNumber").val();
    var enabled=$("#enabled").val();
    var priceUpdateTime=new Date($("#priceUpdateTime").val());
  //  var productUnit=$("#productUnit").val();
    var type='';
    var selectIndex = document.getElementById("productType").selectedIndex;
    if(parseInt(selectIndex)>=0)
    {
        type = document.getElementById("productType").options[selectIndex].id;
    }

    var cityid='';
    var selectIndex0 = document.getElementById("city").selectedIndex;
    if(parseInt(selectIndex0)>=0)
    {
        cityid = document.getElementById("city").options[selectIndex0].id;
    }

    var ProductType=AV.Object.extend("ProductType");
    var productType=new ProductType();
    productType.set("objectId",type);

    var City=AV.Object.extend("City");
    var city=new City();
    city.set("objectId",cityid);

    var Product=AV.Object.extend("Product");
    var product=new Product();
    if(url!=null)
    {
        product.set("objectId",url);

    }
    if(enabled=="启用")
    {
        product.set("enabled",true);
    }
    else
    {
        product.set("enabled",false);
    }
    product.set("productName",productName);
    product.set("productNumber",productNumber);
    product.set("productID",productID);
    product.set("orderNumber",parseInt(orderNumber));
    product.set("productType",productType);
    product.set("productPrice",productPrice);
    product.set("unitPrice",unitPrice);
    product.set("ProductDescription",ProductDescription);
    product.set("productUnit",productUnit);
    product.set("priceUpdateTime",priceUpdateTime);
    product.set("city",city);
    product.set("productImg",imgObject);
    product.save({
        success:function(){
            if(url==null)
            {
                alert("新增产品成功!");

            }
            else
            {
                alert("更新产品成功!");
            }
            window.location.href="/StarCreate/ProductManage/Product/ProductList.html";
        }
    });




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
        editCity();
    });

}

function editCity(){

    var City=AV.Object.extend("City");
    var query=new AV.Query(City);

    query.find({
        success:function(object){
            var len=object.length;
            var html='';
            for(var i=0;i<len;i++)
            {

                if(object[i].get("cityName")!=null)
                {
                    html+='<option id='+object[i].id+'>'+object[i].get("cityName")+'</option>';

                }

            }
            $("#city").html(html);

        }
    }).then(function(){
        judgeAddEdit();
    });

}

function saveFile(){
    var fileUploadControl = $("#productImgup")[0];
  //  alert(fileUploadControl);
    if (fileUploadControl.files.length > 0)
    {
        //   alert("888"+fileUploadControl.files.length);
        var file = fileUploadControl.files[0];

        //var name = "avatar.jpg";
        var name=getDate(new Date())+".jpg";
        var avFile = new AV.File(name, file);
        avFile.save().then(
            function(object){
                saveProduct(object);
            }
        );

    }
    else
    {
        saveProduct();
    }
}

