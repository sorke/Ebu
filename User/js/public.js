/**
 * Created by zhengyinhua on 15-10-20.
 */
//查询人员和店铺----------------------
function SearchName(type) {
	var InputName = $("#"+type).val();
	if(type=='store'){
		var query = new AV.Query(Store);
		var UserQuery = new AV.Query(User);
		UserQuery.equalTo('username',InputName);
		query.matchesQuery("owner", UserQuery);//利用关系查询 查出owner的用户名为输入用户名的这个店铺
	}else{
		var query = new AV.Query(User);
		query.equalTo("username", InputName);
	}
	query.find({
		success: function(result) {
			var len=result.length;
			var html = '查询成功！';
			if (len) {
				if(type=='store'){
					for(var i=0;i<len;i++){
						var obj=result[i];
						var storeName=obj.get('storeName');
						if(i==0){
							html+='请选择一个店铺。';
							html+=" <input type='radio' name='store' value=\'"+obj.id+"\'checked='checked' />"+storeName;
							continue;
						}
						html+=" <input type='radio' name='store' value=\'"+obj.id+"\' />"+storeName;
					}
					$("#storeAlert").css('color', 'green');
				}else{
					var obj=result[0];
					var nickname='无';
					if(obj.get('nickname')){
						nickname=obj.get('nickname');
					}
					html+='昵称：'+nickname;
					$("#userAlert").css('color', 'green');
					$("#user").attr('name', obj.id);
				}
			} else {
				html = "查询结果不存在！";
				if(type=='store'){
					$("#store").val('店铺管理人用户名');
					$("#store").css('color', '#999');
					$("#storeAlert").css('color', 'red');
				}else{
					$("#user").val('待绑定用户名');
					$("#user").attr('name','');
					$("#user").css('color', '#999');
					$("#userAlert").css('color', 'red');
				}
			}
			if(type=='store'){
				$("#storeAlert").html(html);
			}else{
				$("#userAlert").html(html);
			}
			
		}
	});
}
/*
 * 查询店铺 并且显示在input下拉列表中
 * 
 */
function SearchStore() {
	var storeName = $("#store").val();
	if (storeName == '') {
		return false;
	}
	var sql = "select * from Store where enabled=true and storeName like \'%" + storeName + "%\'";
	AV.Query.doCloudQuery(sql, {
		success: function(result) {
			var object = result.results;
			len = object.length;
			if(len!=0){
				var Storeli='';
				for(var i=0;i<len;i++){
					var obj=object[i];
					var storeName=obj.get('storeName');
					var address=obj.get('storeAddress');
					var storeID=obj.id;
					Storeli+="<li onclick=\'checkStore(\""+storeID+"\",\""+storeName+"\")\'><a>"+storeName+"<small>"+address+"</small></a></li>";
				}
				$("#input_ul").html(Storeli);
				$(".search_results").css('display','block');
			}
		},
		error: function(error) {
			//alert('error' + error.message);
		}
	});
}

function subStart() {
	$("#subButton").attr("disabled", "disabled"); //按钮禁用
	$("#subButton").css("background-color", "#808080");
}

function subEnd() {
	$("#subButton").removeAttr("disabled"); //将按钮可用	
	$("#subButton").css('background-color', 'rgb(66, 139, 202)');
}
//获取url上传入的id
function geturl() {
	var url = location.search.substr(1);
	var gethref;
	if (url.length > 0) {
		var ar = url.split(/[&=]/);
		for (i = 0; i < ar.length; i += 2) {
			gethref = ar[i + 1];
		}

	}
	return gethref;
}
function checkStore(id,storename){
	$(".search_results").css('display','none');
	$("#store").val(storename);
	$("#store").attr('name',id);
}
/*
 * input值监控函数  输入11位手机号后立即进行查询
 */
var INPUTNAME='';//用户保存输入的店铺名称 用于比较是否变化
function OnInput(event, tage) {
	var value = event.target.value;
	var len = value.length;
	if (tage == 'user') {
		if (len == 11) {
			SearchName(tage);
		} else {
			var html = "请输入11位手机号";
			$("#userAlert").html(html);
			$("#user").attr('name', '');
			$("#user").css('color', '#999');
			$("#userAlert").css('color', 'red');
		}
	}
	else{
		if(INPUTNAME!=value){
			SearchStore();//查询店铺
			INPUTNAME=value;
		}
	}
}
