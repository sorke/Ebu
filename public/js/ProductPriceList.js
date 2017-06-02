/**
 * Created by liangyi on 15-9-9.
 */
$(document).ready(function(){
    viewProductPrice("main");
    if($.inArray("231",roleArray)>=0)
    {
        $('#addPrice').attr("disabled",false);
    }
    else
    {
        $('#addPrice').attr("disabled",true);
    }
    $("#dtBox").DateTimePicker();
});
var page=0;
var maincount=0;
function viewProductPrice(tag){
  //  var url=geturl();
    var searchTime=$("#searchTime").val();

    if(tag=="nextpage")
    {

        page++;


        if(page*10>=maincount)
        {
            page--;
            alert("这已经是最后一页了！");
        }
    }
    if(tag=="pastpage")
    {
        if(page>0)
        {
            page--;

        }
        else
        {
            alert("这已经是第一页了！");
        }
    }
    var html='<thead>'+
        '<tr>'+
        '<th><input type="checkbox" id="checkAll"></th>'+
        '<th>农产品</th>'+
        '<th>价格</th>'+

        '<th>包装规格</th>'+

        '<th>标准计量</th>'+
        '<th>计量单位</th>'+

        '<th>单位单价</th>'+

        '<th>生效日期</th>'+
        '<th>录入时间</th>'+
        '<th>所属城市</th>';
    if($.inArray("232",roleArray)>=0)
    {
      html+=  '<th>编辑</th>';
    }
    if($.inArray("233",roleArray)>=0)
    {
      html+=   '<th>删除</th>';
    }

      html+=   '</tr>'+
        '</thead>';
    var ProductPrice=AV.Object.extend("ProductPrice");
    var query=new AV.Query(ProductPrice);
    query.descending("createdAt");
    query.include("product");
    query.equalTo("enabled",true);
    if(searchTime!='')
    {
      //  var timeArray=searchTime.split('-');

        var today= strChangeDate(searchTime,0);
        var tomorrow= strChangeDate(searchTime,1);
      //  alert(today+tomorrow);
        query.lessThanOrEqualTo("inputDateTime",tomorrow);
        query.greaterThanOrEqualTo("inputDateTime",today);
    }
    query.include("city");
    if(tag=="main")
    {
        query.count({
            success:function(count){
                maincount=count;
            }
        });
    }
    query.limit(10);
    query.skip(10*page);
    query.find({
        success:function(object){
            var len=object.length;

            for(var i=0;i<len;i++)
            {
                var product=object[i].get("product")==null?'':object[i].get("product").get("productName");
                var price=object[i].get("price")==null?'':object[i].get("price");
                var packageString=object[i].get("packageString")==null?'':object[i].get("packageString");
                var unitPerPackage=object[i].get("unitPerPackage")==null?'':object[i].get("unitPerPackage");
                var unitString=object[i].get("unitString")==null?'':object[i].get("unitString");
                var proPackageString=object[0].get("product")==null?'':object[i].get("product").get("packageString");
                var paarray=packageString.split('(');
                paarray[1]="("+paarray[1];
                var unitPrice=object[i].get("unitPrice")==null?'':object[i].get("unitPrice");
               // alert(unitPrice);
                var effectiveDate=object[i].get("effectiveDate")==null?'':object[i].get("effectiveDate").toLocaleDateString();
                var inputDateTime=object[i].get("inputDateTime")==null?'':object[i].get("inputDateTime").toLocaleDateString();
                var city=object[i].get("city")==null?'':object[i].get("city").get("cityName");
                html+='<tr>'+
                    '<td><input type="checkbox" value="'+object[i].id+'"></td>' +

                    '<td>'+product+paarray[1]+'</td>'+
                    '<td>'+price+'</td>'+
                    '<td>'+packageString+'</td>'+
                    '<td>'+unitPerPackage+'</td>'+
                    '<td>'+unitString+'</td>'+
                    '<td>'+unitPrice+'</td>'+
                    '<td>'+effectiveDate+'</td>'+
                    '<td>'+inputDateTime+'</td>'+
                    '<td>'+city+'</td>';
                if($.inArray("232",roleArray)>=0)
                {
                    html+='<td><a href="../ProductPrice/ProductPriceAdd.html?id='+object[i].id+'">编辑</td>';
                }
                if($.inArray("233",roleArray)>=0)
                {
                    html+='<td><a href="javascript:deleteProductPrice(\''+object[i].id+'\')">删除</td>';
                }
                    html+='</tr>';
            }
            $("#index").html(html);
            SelectAll();

        }
    });

}
function SelectAll(){

    $("#checkAll").click(function(){
        // alert(2222);
        if(this.checked)
        {
            $("#index tbody tr td  input[type=checkbox]").each(function(){

                //    alert($(this).val());
                this.checked=true;


            });
        }
        else
        {
            $("#index tbody tr td  input[type=checkbox]").each(function(){

                //    alert($(this).val());
                this.checked=false;


            });
        }
    });
}
function renew(){
    var ProductPrice=AV.Object.extend("ProductPrice");
    var Product=AV.Object.extend("Product");
    var CheckList=new Array();
    $("#index tbody tr td  input[type=checkbox]").each(function(){
        if(this.checked){
            //    alert($(this).val());
            CheckList.push($(this).val());
        }
    });
    //alert(CheckList.length);
    if(CheckList.length==0)
    {
        alert("请选择产品！");
    }
    else
    {
        for(var i=0;i<CheckList.length;i++)
        {
            (function(i){
            var query=new AV.Query(ProductPrice);
            query.equalTo("objectId",CheckList[i]);

            query.find({
                success:function(object){
                    var productId=object[0].get("product").id;
                    var product=object[0].get("product")==null?'':object[0].get("product").get("productName");
                    //    alert(product);
                    var proPackageString=object[0].get("product")==null?'':object[0].get("product").get("packageString");
                    //    var productType=object[0].get("product")==null?'':object[0].get("product").get("productName");
                    var price=object[0].get("price")==null?'':object[0].get("price");
                    var packageString=object[0].get("packageString")==null?'':object[0].get("packageString");
                    /*var paarray=packageString.split('(');
                    paarray[1]="("+paarray[1];*/
                    var unitPerPackage=object[0].get("unitPerPackage")==null?'':object[0].get("unitPerPackage");
                    var unitString=object[0].get("unitString")==null?'':object[0].get("unitString");
                    var unitPrice=object[0].get("unitPrice")==null?'':object[0].get("unitPrice");
                   /* var effectiveDate=object[0].get("effectiveDate")==null?'':new Date(object[0].get("effectiveDate")).format('dd-MM-yyyy hh:mm:ss');
                    var inputDateTime=object[0].get("inputDateTime")==null?'':new Date(object[0].get("inputDateTime")).format('dd-MM-yyyy hh:mm:ss');
                    var city=object[0].get("city")==null?'':object[0].get("city").get("cityName");
                  */  var productObj=new Product();
                    productObj.id=productId;
                    productObj.set("productPrice",price);
                    productObj.set("packageString",packageString);
                    productObj.set("unitPerPackage",unitPerPackage);
                    productObj.set("unitString",unitString);
                    productObj.set("unitPrice",unitPrice);
                    productObj.save({
                        success:function(){
                            alert("更新成功！");
                        }
                    });
                }
            })})(i);
        }
    }
}
function deleteProductPrice(id){
    if(confirm("确定要删除吗？"))
    {
        var ProductPrice=AV.Object.extend("ProductPrice");
        var productPrice =new ProductPrice();
        productPrice.id=id;
        productPrice.set("enabled",false);
        productPrice.save({
            success:function(){
                window.location.reload();
            }
        });

    }

}
function searchPrice(){
    /*var key=$("#search").val();
    var ProductPrice=AV.Object.extend("ProductPrice");
    var query=new AV.Query(ProductPrice);
    query.equalTo("price",'%'+1);
    query.find({
        success:function(object){
            alert(object.length);
        }
    });*/
    var ProductPrice=AV.Object.extend("ProductPrice");
    var query = new AV.SearchQuery('Product');
    query.queryString('色');
    query.find({
        success:function(object){
            alert(object[0].get("ProductDescription"));
        }
    }).then(function(results) {
        alert("Find " + results.length + " docs.");
        //处理 results 结果
        alert(results[0].get("productName"));
    }).catch(function(err){
        //处理 err
    });
}