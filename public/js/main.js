/**
 * Created by liangyi on 15-7-20.
 */

function testData(){
    var SortingOrder=AV.Object.extend("SortingOrder");
    var query=new AV.Query(SortingOrder);

    query.find({
        success:function(object){
            var len=object.length;
            var array=new Array();
            for(var i=0;i<len;i++)
            {

                 //   alert(i);
                   object[i].set("enabled",true);
                   object[i].save();





            }

            }


    });
}
var roleArray=getCookieValue("roleArray");
roleArray=roleArray.split(',');
function addTime(str){
    if(str!='')
    {
        var num=[];
        // var str="8-7-2012 13:52:50";
        var  arr= str.split('-');
        num.push(arr[0]);
        num.push(arr[1]);
        var year=arr[2].split(' ');
        num.push(year[0]);
        var time=year[1].split(':');
        num.push(time[0]);
        num.push(time[1]);
        num.push(time[2]);
        var settime=new Date(parseInt(num[2]),parseInt(num[1]-1),parseInt(num[0]),parseInt(num[3]),parseInt(num[4]),parseInt("00"));
        /*for(var i=0;i<num.length;i++)
         {
         alert(num[i]);
         }*/
//    alert(settime);
        return settime;
    }else
    {
        return '';
    }


}
$(document).ready(
    function(){
     //   testData();
    //    document.write('<script src="../public/js/leancloud.js"></script>');
 if(AV.User.current()==null){
            window.location.href='../index.html';
        }
        else {
             if($.inArray("130",roleArray)>=0){
                 $('#orderSummary').css('display','none');
             }

        }
        bindMenu();
        bindBanner();
        loadCss();
        $("form").filter('.navbar-right').find("input").remove();
        $("title").text("星创一步");

    }
);
function logout(){
    if(confirm("确定要注销吗？"))
    {
        AV.User.logOut();
       // $.cookie('userName', '', { expires: -1 });
      //  document.cookie="password"+'=0;expires=' + new Date( 0).toUTCString();
      /*  document.cookie="userName=;expires=" + new Date( 0).toUTCString()+";path=/";

        document.cookie="password=;expires=" + new Date( 0).toUTCString()+";path=/";
*/
        window.location.href="../index.html";
    }

}   /*注销*/

function geturl(){
    var url = location.search.substr(1);
    var gethref;
    if(url.length > 0)
    {
        var  ar = url.split(/[&=]/);
        for(var i=0;i<ar.length;i+=2)
        {
            gethref=ar[i+1];
            //alert("参数:"+ar[i]+":"+ar[i+1]+"<br>");
            // alert(ar[i+1]);
        }

    }
    return gethref;
}   /*获取传参（1个）*/
function getDate(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour=date.getHours();
    return year.toString() + month.toString() + day.toString() + hour.toString();
}  /*获取年月日标记*/
function geturlArry(){
    var url = location.search.substr(1);
    var gethref=[];
    if(url.length > 0)
    {
        var  ar = url.split(/[&=]/);
        for(var i=0;i<ar.length;i++)
        {
            gethref.push(ar[i]);
            //alert("参数:"+ar[i]+":"+ar[i+1]+"<br>");
            // alert(ar[i+1]);
        }

    }
    return gethref;
}  /*获取传参数组*/
function geturlarry(){
    var url = location.search.substr(1);
    var gethref=[];
    if(url.length > 0)
    {
        var  ar = url.split(/[&=]/);
        for(var i=0;i<ar.length;i+=2)
        {
            gethref.push(ar[i+1]);
            //alert("参数:"+ar[i]+":"+ar[i+1]+"<br>");
            // alert(ar[i+1]);
        }

    }
    return gethref;
}

Date.prototype.format = function(format) {
    var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
} ; /*改变时间格式*/

function getList(){

    var menu1=$("#menu");
    if(menu1.css("display")=="none")
    {
        //    alert(555);
        menu1.css("display","block");
    }
    else
    {
        menu1.css("display","none");
    }
} /*获取下拉列表（产品）*/

function getCookieValue(name){  /**获取cookie的值，根据cookie的键获取值**/
//用处理字符串的方式查找到key对应value
var cookie = escape(name);
    //读cookie属性，这将返回文档的所有cookie
    var allcookies = document.cookie;
    //查找名为name的cookie的开始位置
    name += "=";
    var pos = allcookies.indexOf(name);
    //如果找到了具有该名字的cookie，那么提取并使用它的值
    if (pos != -1){                                             //如果pos值为-1则说明搜索"version="失败
        var start = pos + name.length;                  //cookie值开始的位置
        var end = allcookies.indexOf(";",start);        //从cookie值开始的位置起搜索第一个";"的位置,即cookie值结尾的位置
        if (end == -1) end = allcookies.length;        //如果end值为-1说明cookie列表里只有一个cookie
        var value = allcookies.substring(start,end); //提取cookie的值
        return (value);                           //对它解码
    }else{  //搜索失败，返回空字符串
        return "";
    }
} /*获得cookie*/


function bindMenu(){
    var html='';
    if($.inArray("310",roleArray)>=0)
    {
     html+= '<li ><a  href="../BatchTable/index.html">批次管理</a></li>';
    }
        if($.inArray("200",roleArray)>=0)
    {
     html+=   '<li><a href="javascript:getList()">产品管理</a></li>'+
        '<div id="menu" style="display: none">'+
            '<ul class="nav nav-sidebar">';
        if($.inArray("210",roleArray)>=0)
        {
            html+=        '<li class="manuli"><a href="../ProductType/ProductTypeList.html">产品类别管理</a></li>';
        }
        if($.inArray("220",roleArray)>=0)
        {
            html+=        '<li class="manuli"><a href="../htdocs/product.html">产品管理</a></li>';
        }
        if($.inArray("230",roleArray)>=0)
        {
            html+=        '<li class="manuli"><a href="../ProductPrice/ProductPriceList.html">产品价格管理</a></li>';
        }
        html+='</ul>'+
        '</div>';
    }
   // alert($.inArray("100",roleArray));
    if($.inArray("100",roleArray)>=0)
    {
        html+= '<li><a href="javascript:getOrderMenu()">订单管理</a></li>'+
        '<div id="orderMenu" style="display: none">'+
            '<ul class="nav nav-sidebar">';
        if($.inArray("110",roleArray)>=0)
        {
           html+= '<li class="manuli"><a  href="../order/queryOrder.html">订单查询</a></li>';
        }
        if($.inArray("130",roleArray)>=0)
        {
           html+= '<li id="orderSummary" class="manuli"><a  href="../order/statistics.html">订单统计</a></li>';
        }
           html+=   '</ul>'+
        '</div>';
    }
    if($.inArray("400",roleArray)>=0)
    {
    html+= '<li><a href="javascript:getUserMenu()">用户管理</a></li>'+
        '<div id="UserMenu" style="display: none">'+
        '<ul class="nav nav-sidebar">';
        if($.inArray("420",roleArray)>=0)
        {
          html+=  '<li class="manuli"><a  href="../htdocs/index.html">商铺管理</a></li>';
        }
        if($.inArray("410",roleArray)>=0)
        {
          html+=  '<li class="manuli"><a  href="../User/index.html">用户账户管理</a></li>';
        }
        if($.inArray("430",roleArray)>=0)
        {
            html+=  '<li class="manuli"><a  href="../User/ShowUserJoinStore.html">店铺操作员管理</a></li>';
        }
        if($.inArray("440",roleArray)>=0)
        {
            html+=  '<li class="manuli"><a  href="../htdocs/ShowStoreGroup.html">店铺分组管理</a></li>';
        }
        if($.inArray("450",roleArray)>=0)
        {
            html+=  '<li class="manuli"><a  href="../htdocs/ShowSalesman.html">业务员管理</a></li>';
        }
          html+= '</ul>'+
        '</div>';
    }
    if($.inArray("610",roleArray)>=0)
    {
          html+=  '<li ><a  href="../SortingOrder/SortingOrderList.html">工单管理</a></li>';
    }
    if($.inArray("500",roleArray)>=0)
    {
              html+= '<li><a href="javascript:getDeliveryMenu()">物流管理</a></li>'+
            '<div id="DeliveryMenu" style="display: none">'+
            '<ul class="nav nav-sidebar">';
        if($.inArray("510",roleArray)>=0)
        {
           html+='<li class="manuli"><a  href="../DeliveryRoute/DeliveryRouteList.html">物流路线</a></li>';
        }
        if($.inArray("520",roleArray)>=0)
        {
           html+= '<li class="manuli"><a  href="../DeliveryRoute/Delivery.html">物流人员</a></li>';
        }
           html+= '</ul>'+
            '</div>';
    }


    if($.inArray("700",roleArray)>=0)
    {
        html+= '<li><a href="javascript:getPowerMenu()">权限管理</a></li>'+
            '<div id="PowerMenu" style="display: none">'+
            '<ul class="nav nav-sidebar">';
        if($.inArray("710",roleArray)>=0)
        {
            html+='<li class="manuli"><a  href="../Power/role.html">角色管理</a></li>';
        }
        if($.inArray("720",roleArray)>=0)
        {
            html+= '<li class="manuli"><a  href="../Power/operator.html">操作员管理</a></li>';
        }
        html+= '</ul>'+
            '</div>';
    }
   /* html+='<ul class="nav nav-sidebar" style="margin-left: 0px">'+
        '<li><a href="javascript:testData()">设置enabled</a></li>'+
        '</ul>';*/

    $("ul").filter('.nav-sidebar').html(html);


} /*绑定菜单*/

function bindBanner(){
    var html='';
    html+='<li><a href="javascript:logout()">注销</a></li>';
    $("ul").filter('.navbar-right').html(html);
   // $("#banner").html(html);
}  /*绑定banner*/

function loadCss(){
    $("<link>")
        .attr({ rel: "stylesheet",
            type: "text/css",
            href: "../public/css/main.css"
        })
        .appendTo("head");
}  /*加载css*/

function dateStr(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour=date.getHours();
    return year + "-" + month + "-" + day + " " + hour +"时";
}
function shortDateStr(date){
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    return year + "-" + month + "-" + day
}
function nowDay() {
    var date=new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    return new Date(year,month,day,0,0,0);
}
function strChangeDate(str,AddDayCount) {
    var arr=str.split(/-/);
    var dd = new Date(arr[2],arr[1]-1,arr[0],0,0,0);
    dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = dd.getMonth();//获取当前月份的日期
    var d = dd.getDate();
    return new Date(y,m, d,0,0,0);
}
function getUserMenu(){
    var menu1=$("#UserMenu");
    if(menu1.css("display")=="none")
    {
        //    alert(555);
        menu1.css("display","block");
    }
    else
    {
        menu1.css("display","none");
    }
}

function getPowerMenu(){
    var menu1=$("#PowerMenu");
    if(menu1.css("display")=="none")
    {
        //    alert(555);
        menu1.css("display","block");
    }
    else
    {
        menu1.css("display","none");
    }
}

function getOrderMenu(){

    var menu1=$("#orderMenu");
    if(menu1.css("display")=="none")
    {
        //    alert(555);
        menu1.css("display","block");
    }
    else
    {
        menu1.css("display","none");
    }


}

function getNeedsMenu(){

    var menu1=$("#needsMenu");
    if(menu1.css("display")=="none")
    {
        //    alert(555);
        menu1.css("display","block");
    }
    else
    {
        menu1.css("display","none");
    }


}

function getDeliveryMenu(){

    var menu1=$("#DeliveryMenu");
    if(menu1.css("display")=="none")
    {
        //    alert(555);
        menu1.css("display","block");
    }
    else
    {
        menu1.css("display","none");
    }


}
/*session*/
(function($){

    $.session = {

        _id: null,

        _cookieCache: undefined,

        _init: function()
        {
            if (!window.name) {
                window.name = Math.random();
            }
            this._id = window.name;
            this._initCache();

            // See if we've changed protcols

            var matches = (new RegExp(this._generatePrefix() + "=([^;]+);")).exec(document.cookie);
            if (matches && document.location.protocol !== matches[1]) {
                this._clearSession();
                for (var key in this._cookieCache) {
                    try {
                        window.sessionStorage.setItem(key, this._cookieCache[key]);
                    } catch (e) {};
                }
            }

            document.cookie = this._generatePrefix() + "=" + document.location.protocol + ';path=/;expires=' + (new Date((new Date).getTime() + 120000)).toUTCString();

        },

        _generatePrefix: function()
        {
            return '__session:' + this._id + ':';
        },

        _initCache: function()
        {
            var cookies = document.cookie.split(';');
            this._cookieCache = {};
            for (var i in cookies) {
                var kv = cookies[i].split('=');
                if ((new RegExp(this._generatePrefix() + '.+')).test(kv[0]) && kv[1]) {
                    this._cookieCache[kv[0].split(':', 3)[2]] = kv[1];
                }
            }
        },

        _setFallback: function(key, value, onceOnly)
        {
            var cookie = this._generatePrefix() + key + "=" + value + "; path=/";
            if (onceOnly) {
                cookie += "; expires=" + (new Date(Date.now() + 120000)).toUTCString();
            }
            document.cookie = cookie;
            this._cookieCache[key] = value;
            return this;
        },

        _getFallback: function(key)
        {
            if (!this._cookieCache) {
                this._initCache();
            }
            return this._cookieCache[key];
        },

        _clearFallback: function()
        {
            for (var i in this._cookieCache) {
                document.cookie = this._generatePrefix() + i + '=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            }
            this._cookieCache = {};
        },

        _deleteFallback: function(key)
        {
            document.cookie = this._generatePrefix() + key + '=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            delete this._cookieCache[key];
        },

        get: function(key)
        {
            return window.sessionStorage.getItem(key) || this._getFallback(key);
        },

        set: function(key, value, onceOnly)
        {
            try {
                window.sessionStorage.setItem(key, value);
            } catch (e) {}
            this._setFallback(key, value, onceOnly || false);
            return this;
        },

        'delete': function(key){
            return this.remove(key);
        },

        remove: function(key)
        {
            try {
                window.sessionStorage.removeItem(key);
            } catch (e) {};
            this._deleteFallback(key);
            return this;
        },

        _clearSession: function()
        {
            try {
                window.sessionStorage.clear();
            } catch (e) {
                for (var i in window.sessionStorage) {
                    window.sessionStorage.removeItem(i);
                }
            }
        },

        clear: function()
        {
            this._clearSession();
            this._clearFallback();
            return this;
        }

    };

    $.session._init();

})(jQuery);
/*session*/