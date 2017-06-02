/**
 * Created by zhengyinhua on 15-10-20.
 */

$(document).ready(
	function() {
		view("main");
	}
);
var UserJoinStore = AV.Object.extend("UserJoinStore");
var User = AV.Object.extend('User');
var page = 0;
var maincount = 0;
var query = new AV.Query(UserJoinStore);
var Sum = 10; //记录 店铺名称查询显示的条数
function view(tag) {
	if (tag == "nextpage") {
		page++;
		if (page * 10 >= maincount) {
			alert('当前已经是最后一页了！');
			page--;
			return false;
		}
	}
	if (tag == "pastpage") {
		if (page > 0) {
			page--;
		} else {
			alert('当前已经是第一页了！');
			return false;
		}
	}
	var html = '<thead>' +
		'<tr>' +
		'<th>店铺名称</th>' +
		'<th>店铺地址</th>' +
		'<th>用户名</th>' +
		'<th>编辑</th>' +
		'<th>解除</th>' +
		'</tr>' +
		'</thead>';

	if (tag == "main") {
		query = new AV.Query(UserJoinStore);
		query.count({
			success: function(count) {
				maincount = count;
			}
		});
	}
	if (tag == "searchStore" || tag == 'more') { //第一次搜索时 或者是在 搜索店铺环境下的翻页情况 才触发下面的操作
		hide(); //隐藏翻页按钮 显示  加载按钮
		page = 0;
		if (tag == "searchStore") { //点击查询一次 sum总数 初始为10
			Sum = 10;
			$('#search_more').css('color', "#428BCA");
			$('#search_more').css('text-decoration', "inherit");
			$("#search_more").attr("onclick", "view('more');");
		}
		if (tag == 'more') {
			Sum += 10;
		}
		var storeName = $('#storeName').val();
		if (storeName != '请输入店铺名称') {
			var sql = "select include store,include user,* from UserJoinStore where store in (select * from Store where storeName like \'%" + storeName + "%\')  limit 0," + Sum;
			AV.Query.doCloudQuery(sql, {
				success: function(result) {
					var object = result.results;
					maincount = object.length;
					if (maincount == 0) {
						alert('没有找到该店铺,请重试！')
						window.location.reload();
					}
					if (maincount < Sum) { //没有更多结果了  让 "加载更多"按钮 不可用
						$("#search_more").removeAttr("onclick");
						$('#search_more').css('color', "darkgray");
						$('#search_more').css('text-decoration', "none");
					}
					ShowObject(object, html); //调用函数 输出结果集
				},
				error: function(error) {
					alert('error' + error.message);
				}
			});
		} else {
			alert("请输入店铺名称！");
			return false;
		}
	}
	if (tag == "searchUser") {
		maincount = 0;
		page = 0;
		var username = $('#username').val();
		if (username != '请输入用户名') {
			query = new AV.Query(UserJoinStore);
			var UserQuery = new AV.Query(User);
			UserQuery.equalTo('username', username);
			query.matchesQuery('user', UserQuery);
		} else {
			alert("请输入用户名");
			return false;
		}
		query.count({
			success: function(count) {
				if (count) {
					maincount = count;
				} else {
					alert('查询结果不存在！');
					window.location.reload();
				}
			}
		});
	}
	if (tag != "searchStore" && tag != 'more') { //店铺查询 或在店铺显示更多时不需要再输出
		displa();//显示翻页按钮 隐藏加载按钮
		query.descending("updatedAt");
		query.include("store");
		query.include("user");
		query.limit(10);
		query.skip(10 * page);
		query.find({
			success: function(object) {
				ShowObject(object, html); // //调用函数 输出结果集
			}
		});
	}
}

function deletebatch(id) {
		if (confirm("确定要解除绑定吗？")) {
			var DelID = id;
			var MyObj = new UserJoinStore();
			MyObj.id = DelID;
			MyObj.destroy({
				success: function(MyObj) {
					// 对象的实例已经被删除了.
					alert('解绑成功！');
					window.location.reload();
				},
				error: function(MyObj, error) {
					// 出错了.
					alert('解绑失败，请重试！');
				}
			});
		}
	}
	/*
	 * 输出results结果集 因为会多次用到封装成函数
	 */

function ShowObject(object, html) {
		var len = object.length;
		for (var i = 0; i < len; i++) {
			var storeName = '';
			if (object[i].get("store") != null) {
				storeName = object[i].get("store").get('storeName');
			}
			var username = '';
			if (object[i].get("user") != null) {
				username = object[i].get("user").get('username');
			}
			var address = '';
			if (object[i].get("store") != null) {
				address = object[i].get("store").get('storeAddress');
			}
			var isBoss='';
			if (object[i].get("owner") != null) {
				var bool = object[i].get("owner");
				if(bool){
					isBoss="(店主)";
				}
			}
			var ObjId = object[i].id;
			html += '<tr>' +
				'<td>' + storeName + '</td>' +
				'<td>' + address + '</td>' +
				'<td>' + username +isBoss+'</td>' +
				'<td ><a  href="EditUserJoinStore.html?id=' + ObjId + '">编辑</td>' +
				'<td><a  href="javascript:deletebatch(\'' + ObjId + '\')">解绑</td>';
			html += '</tr>';
		}
		$("#userList").html(html);

	}
	//根据产品类型 进行筛选

function reload() {
	window.location.reload();
}

function hide() { //隐藏翻页按钮 显示  加载按钮
	$("#nextpage").css("display", 'none');
	$("#pastpage").css("display", 'none');
	$(".center").css("display", 'block');

}

function displa() { //显示翻页按钮 隐藏加载按钮
	$("#nextpage").css("display", 'block');
	$("#pastpage").css("display", 'block');
	$(".center").css("display", 'none');
}