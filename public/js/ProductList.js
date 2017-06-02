/**
 * Created by liangyi on 15-9-9.
 */
$(document).ready(function(){
    //alert(777777);
    viewProduct("main");
});
var page=0;
var maincount=0;
function viewProduct(tag){
    if(tag=="nextpage")
    {

        page++;


        if(page*10>=maincount)
        {
            page--;

        }
    }
    if(tag=="pastpage")
    {
        if(page>0)
        {
            page--;

        }
    }
    var html='<thead>'+
        '<tr>'+
        '<th>产品名称</th>'+
        '<th>产品编号</th>'+
        '<th>农产品ID</th>'+
        '<th>产品类别</th>'+

        '<th>产品价格</th>'+
        '<th>产品单价</th>'+


        '<th>单位</th>'+

        '<th>所属城市</th>'+
        '<th>是否启用</th>'+
        '<th>编辑</th>'+
        '<th>删除</th>'+
        '</tr>'+
        '</thead>';
    var Product=AV.Object.extend("Product");
    var query=new AV.Query(Product);
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
    query.include("productType");
    query.descending("createdAt");
    query.include("city");
    query.find({
        success:function(object){

            var len=object.length;
            for(var i=0;i<len;i++)
            {
                var productName=object[i].get("productName")==null?'':object[i].get("productName");
                var productNumber=object[i].get("productNumber")==null?'':object[i].get("productNumber");
                var productID=object[i].get("productID")==null?'':object[i].get("productID");
                var productType=object[i].get("productType")==null?'':object[i].get("productType").get("typeName");
                var productPrice=object[i].get("productPrice")==null?'':object[i].get("productPrice");
                var unitPrice=object[i].get("unitPrice")==null?'':object[i].get("unitPrice");
                var productUnit=object[i].get("productUnit")==null?'':object[i].get("productUnit");
                var enabled=object[i].get("enabled")==null?'':object[i].get("enabled");
                enabled=enabled===true?"启用":"停用";
                var city=object[i].get("city")==null?'':object[i].get("city").get("cityName");
                html+='<tr>'+
                    '<td>'+productName+'</td>'+
                    '<td>'+productNumber+'</td>'+
                    '<td>'+productID+'</td>'+
                    '<td>'+productType+'</td>'+
                    '<td>'+productPrice+'</td>'+
                    '<td>'+unitPrice+'</td>'+
                    '<td>'+productUnit+'</td>'+
                    '<td>'+city+'</td>'+
                    '<td>'+enabled+'</td>'+
                    '<td><a href="/StarCreate/ProductManage/Product/ProductAdd.html?id='+object[i].id+'">编辑</td>'+
                    '<td><a href="javascript:deleteProduct(\''+object[i].id+'\')">删除</td>'+

                    '</tr>';
            }
            $("#index").html(html);
        }
    });
}

function deleteProduct(id){
    if(confirm("确认要删除吗？")){
        var Product=AV.Object.extend("Product");
        var product=new Product();
        product.id=id;
        product.destroy({
            success:function(){
                window.location.reload();
            }
        });
    }
}