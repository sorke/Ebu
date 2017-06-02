/**
 * Created by liangyi on 15-9-2.
 */

$(document).ready(
    function(){
        view("main");
        if($.inArray("311",roleArray)>=0)
        {
            $('#addBatch').attr("disabled",false);
        }
        else
        {
            $('#addBatch').attr("disabled",true);
        }

    }

);
var page=0;
var maincount=0;
function view(tag){

   // alert(page);
    if(tag=="nextpage")
    {

        page++;


        if(page*10>=maincount)
        {
            page--;
            alert("已经是最后一页！");

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
            alert("已经是第一页！");
        }

    }

    var html='<thead>'+
        '<tr>'+
        '<th>批次流水号</th>'+
        '<th>批次ID</th>'+
        '<th>产品名称</th>'+
        '<th>产地</th>'+
        '<th>到仓时间</th>'+
        '<th>质检是否合格</th>'+
        '<th>批次是否过期</th>';
    if($.inArray("312",roleArray)>=0)
    {
      html+=  '<th>编辑</th>';
    }
    if($.inArray("313",roleArray)>=0)
    {
      html+=  '<th>删除</th>';
    }
      html+=  '</tr>'+
        '</thead>';
    var BatchTable=AV.Object.extend("BatchTable");
    var query=new AV.Query(BatchTable);
    query.include('productType');


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

    query.include("product");
    query.descending("createdAt");
    query.equalTo("enabled",true);
    query.find({
        success:function(object){
            var len=object.length;


            for(var i=0;i<len;i++)
            {
                var serialNo='';
                if(object[i].get("serialNo")!=null)
                {
                    serialNo=object[i].get("serialNo");

                }

                var batchID='';
                if(object[i].get("batchID")!=null)
                {
                    batchID=object[i].get("batchID");

                }

                var productType='';
                if(object[i].get("productType")!=null)
                {

                    productType=object[i].get("productType").get("typeName");

                }

                var productionPlace='';
                if(object[i].get("productionPlace")!=null)
                {
                    productionPlace=object[i].get("productionPlace");

                }

                var dateTime='';
                if(object[i].get("dateTime")!=null)
                {
                    dateTime=object[i].get("dateTime").toLocaleDateString();

                }

                var isQualified='';
                if(object[i].get("isQualified")!=null)
                {
                    isQualified=object[i].get("isQualified");
                    if(isQualified===true)
                    {
                        isQualified="合格";
                    }
                    else
                    {
                        isQualified="不合格";
                    }
                }


                var isOverdue='';
                if(object[i].get("isOverdue")!=null)
                {
                    isOverdue=object[i].get("isOverdue");
                    if(isOverdue===true)
                    {
                        isOverdue="正常";
                    }
                    else
                    {
                        isOverdue="过期";
                    }

                }
                var product=object[i].get("product")==null?'':object[i].get("product").get("productName");
                var packageString=object[i].get("product")==null?'':object[i].get("product").get("packageString");
                if(packageString!=null)
                {

                }

                var paarray=packageString.split('(');
                paarray[1]="("+paarray[1];
            //    console.log(paarray);
                html+='<tr>'+
                    '<td>'+serialNo+'</td>'+
                    '<td>'+batchID+'</td>'+
                    '<td>'+product+paarray[1]+'</td>'+
                    '<td>'+productionPlace+'</td>'+
                    '<td>'+dateTime+'</td>'+
                    '<td>'+isQualified+'</td>'+
                    '<td>'+isOverdue+'</td>';
                if($.inArray("312",roleArray)>=0)
                {
                  html+=  '<td><a href="indexEdit.html?id='+object[i].id+'">编辑</td>';
                }
                if($.inArray("313",roleArray)>=0)
                {
                  html+=  '<td><a href="javascript:deletebatch(\''+object[i].id+'\')">删除</td>';
                }
                  html+=  '</tr>';

            }
            $("#index").html(html);

        }
    });

}
function deletebatch(id){
if(confirm("确定要删除吗？"))
{
    var BatchTable=AV.Object.extend("BatchTable");
    var batchTable=new BatchTable();
    batchTable.id=id;
    batchTable.set("enabled",false);
    batchTable.save({
        success:function(){
            window.location.reload();
        }
    });


}
    else
{

}

}