/**
 * Created by liangyi on 15-9-10.
 */
$(document).ready(
    function(){
     //   alert(111);
     //   alert(new Date("07-08-2012 15:51"));
     //   addTime();
        judgeEditAdd();
        $("#dtBox").DateTimePicker();
        ShowPrice();
    }
);
function judgeEditAdd(){
    var url=geturl();
    if(url==null)
    {
        editCityTypeProduct();
    }
    else
    {

        getProductPrice();
    }
}
function getProductPrice(){
    var url=geturl();

    var ProductPrice=AV.Object.extend("ProductPrice");
    var query=new AV.Query(ProductPrice);
    query.equalTo("objectId",url);
    query.include("product");
    query.include("city");
    query.find({
        success:function(object){

            var product=object[0].get("product")==null?'':object[0].get("product").get("productName");
        //    alert(product);
            var proPackageString=object[0].get("product")==null?'':object[0].get("product").get("packageString");
        //    var productType=object[0].get("product")==null?'':object[0].get("product").get("productName");
            var price=object[0].get("price")==null?'':object[0].get("price");
            var packageString=object[0].get("packageString")==null?'':object[0].get("packageString");
            var paarray=packageString.split('(');
            paarray[1]="("+paarray[1];
            var unitPerPackage=object[0].get("unitPerPackage")==null?'':object[0].get("unitPerPackage");
            var unitString=object[0].get("unitString")==null?'':object[0].get("unitString");
            var unitPrice=object[0].get("unitPrice")==null?'':object[0].get("unitPrice");
            var effectiveDate=object[0].get("effectiveDate")==null?'':new Date(object[0].get("effectiveDate")).format('dd-MM-yyyy hh:mm:ss');
            var inputDateTime=object[0].get("inputDateTime")==null?'':new Date(object[0].get("inputDateTime")).format('dd-MM-yyyy hh:mm:ss');
            var city=object[0].get("city")==null?'':object[0].get("city").get("cityName");
            jQuery("#product").prepend("<option value='0'>"+product+proPackageString+"</option>");
           // $("#product").val(product);
            $("#price").val(price);
            $("#packageString").val(paarray[0]);
            $("#pack").text(paarray[1]);
            $("#unitPerPackage").val(unitPerPackage);

            $("#unitString").val(unitString);
            $("#unitPrice").val(unitPrice);
            $("#effectiveDate").val(effectiveDate);
            $("#inputDateTime").val(inputDateTime);
          //  jQuery("#city").prepend("<option value='0'>"+city+"</option>");
           // $("#city").val(city);
            getProductInfo(object[0].get("product").id);

        }
    });

}
function getProductInfo(id){
  //  alert(id);
    var Product=AV.Object.extend("Product");
    var query=new AV.Query(Product);
    query.equalTo("objectId",id);
    query.include("productType");
    query.include("city");
    query.find({
        success:function(object){
           // alert(object[0].get("productType").id);
            var productType=object[0].get("productType")==null?'':object[0].get("productType").get("typeName");
            jQuery("#productType").prepend("<option value='0'>"+productType+"</option>");
            var city=object[0].get("city")==null?'':object[0].get("city").get("cityName");
            jQuery("#city").prepend("<option value='0'>"+city+"</option>");

        }
    });

}
function saveProductPrice(){
    var url=geturl();
 //   var product=$("#product").val();
    var productId='';
    var selectIndex = document.getElementById("product").selectedIndex;
    if(parseInt(selectIndex)>=0)
    {
        productId = document.getElementById("product").options[selectIndex].id;
    }


    var Product=AV.Object.extend("Product");
    var productob=new Product();

    productob.set("objectId",productId);

    /*绑定城市*/
    var cityId='';
    var selectIndex0 = document.getElementById("city").selectedIndex;
    if(parseInt(selectIndex0)>=0)
    {
        cityId = document.getElementById("city").options[selectIndex0].id;
    }
    var City=AV.Object.extend("City");
    var city=new City();
    city.set("objectId",cityId);
    /*绑定城市*/
    var price=$("#price").val();
    var pack=$("#pack").text();
    var packageString=$("#packageString").val();
    var unitPerPackage=$("#unitPerPackage").val();
    var unitString=$("#unitString").val();
    var unitPrice=$("#unitPrice").val();
    var effectiveDate=$("#effectiveDate").val();
    var inputDateTime=$("#inputDateTime").val();
 //   alert(inputDateTime);
    var ProductPrice=AV.Object.extend("ProductPrice");
    var productPrice=new ProductPrice();
    if(url!=null)
    {
        productPrice.set("objectId",url);

    }
    else
    {
        productPrice.set("product",productob);
        productPrice.set("city",city);
    }

    productPrice.set("price",parseFloat(price));

    productPrice.set("packageString",packageString+pack);

    productPrice.set("unitPerPackage",parseFloat(unitPerPackage));
    productPrice.set("unitString",unitString);
    productPrice.set("unitPrice",parseFloat(unitPrice));
  //  alert(typeof effectiveDate);
   // effectiveDate=effectiveDate+":00";
   // alert(effectiveDate.length);
  /*  effectiveDate=addTime(effectiveDate);
    alert(effectiveDate);*/
    /*console.log(addTime(effectiveDate));
    console.log(addTime(inputDateTime));
    console.log(new Date(effectiveDate));
    console.log(inputDateTime);
    console.log(new Date(inputDateTime));*/
    if(effectiveDate!='')
    {
        productPrice.set("effectiveDate",addTime(effectiveDate));
    }
    if(inputDateTime!='')
    {
        productPrice.set("inputDateTime",addTime(inputDateTime));
    }


   // productPrice.set("city",city);
    productPrice.save({
        success:function(){
           url==null?alert("新增产品价格成功！"):alert("更新产品价格成功！");
            window.location.href="../ProductPrice/ProductPriceList.html";
        }
    });


}
function editCityTypeProduct(){
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
        var City=AV.Object.extend("City");
        var query0=new AV.Query(City);
        query0.descending("createdAt");

        query0.find({
            success:function(object){
                //  alert(object.length);
                var len=object.length;
                var html='';
                for(var i=0;i<len;i++)
                {

                    if(object[i].get("cityName")!=null)
                    {
                        html+='<option id='+object[i].id+'>'+object[i].get("cityName")+'</option>';

                    }

                }
                //  alert(html);
                $("#city").html(html);

            }
        }).then(function(object){
            queryProduct();
        });
    });


}

function queryProduct(tag){
   // alert(2222);
    var cityId='';
    var selectIndex0 = document.getElementById("city").selectedIndex;
    if(parseInt(selectIndex0)>=0)
    {
        cityId = document.getElementById("city").options[selectIndex0].id;
    }
    var City=AV.Object.extend("City");
    var cityOb=new City();
    cityOb.set("objectId",cityId);


   // alert(cityId);


    var productTypeId='';
    var selectIndex1 = document.getElementById("productType").selectedIndex;
    if(parseInt(selectIndex1)>=0)
    {
        productTypeId = document.getElementById("productType").options[selectIndex1].id;
    }
    var ProductType=AV.Object.extend("ProductType");
    var productTypeOb=new City();
    productTypeOb.set("objectId",productTypeId);
 //   alert(productTypeId);
    var city=$("#city").val();
    var productType=$("#productType").val();
 //   alert(city+productType);
    var Product=AV.Object.extend("Product");
    var query=new AV.Query(Product);
    query.descending("createdAt");
    query.include("productType");
    query.equalTo("productType",productTypeOb);
    query.equalTo("city",cityOb);
    query.equalTo("enabled",true);
    query.include("city");
    query.find({
        success:function(object){
          //  alert(object.length);
          //    alert(object[0].get("city").get("cityName")+object[1].get("productType").get("typeName"));
            var len=object.length;
            var html='';
            for(var i=0;i<len;i++)
            {
                if(object[i].get("productName")!=null)
                {
                    //    alert(555);
                    html+='<option id='+object[i].id+'>'+object[i].get("productName")+"["+object[i].get("packageString")+']</option>';
                    //   alert(html);
                }
            }
           /* for(var i=0;i<len;i++)
            {
                if(object[i].get("city")!=null&&object[i].get("productType")!=null)
                {
                    if(object[i].get("city").get("cityName")==city&&object[i].get("productType").get("typeName")==productType)
                    {*/
                      //  alert(object[i].get("productName"));

                  /*  }
                }



            }*/
             // alert(html);
            $("#product").html(html);

        }
    }).then(function(){
        //alert(tag);
        if(tag==null)
        {
          //  alert(111);
            var url=geturl();
            if(url!=null)
            {
                getProductPrice();
            }
        }

    });
}


function ShowPrice() {
    $("#unitPrice").change(function() {
      //  alert(111);
        var unitPrice = $(this).val();
        var unitPerPackage = $("#unitPerPackage").val();
        var productPrice = unitPrice * unitPerPackage;
        $("#price").val(productPrice.toFixed(2));
    });
    $("#unitString").change(function() { //动态显示 包装规格
        var unitString = $(this).val();
        var unitPerPackage = $("#unitPerPackage").val();
        var pack = "(" + unitPerPackage + " " + unitString + "装)";
        $("#pack").text(pack);
    });
    $("#unitPerPackage").change(function() {
        var unitPerPackage = $(this).val();
        var unitPrice = $("#unitPrice").val();
        var productPrice = unitPrice * unitPerPackage;
        $("#price").val(productPrice.toFixed(2));

        var unitString = $("#unitString").val(); //动态显示 包装规格
        var pack = "(" + unitPerPackage + " " + unitString + "装)";
        $("#pack").text(pack);
    });
}