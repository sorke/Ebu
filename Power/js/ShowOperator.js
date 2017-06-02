/**
 * Created by zhengyinhua on 15-10-7.
 */
/**
 * Created by zhengyinhua on 15-10-5.
 */
$(document).ready(
	function() {
		view("main");
	}
);
var page = 0;
var maincount = 0;
var User = AV.Object.extend("User");
var query = new AV.Query(User);
var Sum = 10; //记录 店铺名称查询显示的条数

var SClistid = new Array();
var DClistid = new Array();
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
		'<th>用户名</th>' +
		'<th>昵称</th>' +
		'<th>角色</th>' +
		'<th>可操作分拣中心</th>' +
		'<th>可操作配送中心</th>' +
		'<th>编辑</th>' +
		'<th>删除</th>' +
		'</tr>' +
		'</thead>';
	if (tag == "main") {
		query = new AV.Query(User);
		query.equalTo("enabled", true);
		query.equalTo("isOperator", true);
		query.count({
			success: function(count) {
				maincount = count;
			}
		});
	}
	query.descending("updatedAt");
	query.limit(10);
	query.skip(10 * page);

	query.include('role');
	query.find().then(function(results) {
		var promise = AV.Promise.as();
		var flag=0;  //标记是否输出html
		var len=results.length;
		_.each(results, function(result) {
			var SClist = new Array();
			var DClist = new Array();
			flag+=1;
			var username = '';
			if (result.get("username") != null) {
				username = result.get("username");
			}
			var nickname = '';
			if (result.get("nickname") != null) {
				nickname = result.get("nickname");
			}
			var roleName=""
			if (result.get("role") != null) {
				roleName = result.get("role").get('roleName');
			}
			var SCrelation = result.relation('operableSCs');
			var DCrelation = result.relation('operableDCs');
			var ObjId = result.id;
			SCrelation.query().find({
				success: function(obj) {
					for (var i = 0; i < obj.length; i++) {
						SClist.push(obj[i].get('scName'));
						SClistid.push(obj[i].id);
					}
					DCrelation.query().find({
						success: function(obj) {
							for (var i = 0; i < obj.length; i++) {
								DClist.push(obj[i].get('dcName'));
								DClistid.push(obj[i].id);
							}
							html += '<tr>' +
								'<td>' + username + '</td>' +
								'<td>' + nickname + '</td>' +
								'<td>' + roleName + '</td>' +
								'<td><div class="OpeList">' + SClist + '</div></td>' +
								'<td><div class="OpeList">' + DClist + '</div></td>';
							html += '<td><a href="OpeEdit.html?id=' + ObjId + '">编辑</td>';
							html += '<td><a href="javascript:deletebatch(\'' + ObjId + '\')">删除</td>';
							html += '</tr>';
							if(flag==len){
								$("#OpeList").html(html);
							}
						}
					});
				}
			});
			promise = promise.then(function() {

				return true;
			});
		});
		return promise;
	}).then(function() {
	});
}

function deletebatch(id) {
	if (confirm("确定要删除该操作员吗？")) {
		AV.Cloud.run('deletOpe', {
			UserID: id,
			SClistid: SClistid,
			DClistid: DClistid
		}, {
			success: function(data) {
				//调用成功，得到成功的应答data
				alert(data);
				window.location.reload();
				subEnd();
			},
			error: function(err) {
				//处理调用失败
				alert(err.message);
				subEnd();
				window.location.reload();
			}
		});
	}
}
function reload() {
	window.location.reload();
}
function ArrayToString(ArrayList) {
	var PowerString = '';
	for (var i = 0; i < ArrayList.length; i++) {
		var key = ArrayList[i];
		if (PowerArray[key]) {
			PowerString += '[' + PowerArray[key] + ']' + ',';
		}
	}
	return PowerString;
}