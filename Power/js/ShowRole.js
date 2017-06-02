/**
 * Created by zhengyinhua on 15-10-5.
 */
var PowerArray={
	"1":"后台登录",
	"100":"订单管理","110":"订单查询","111":"新建订单","112":"删除订单","113":"编辑订单","114":"查看订单","115":"订单客户信息浏览/查看","116":"分拣订单","117":"详情打印",
	"130":"订单统计","131":"订单数量统计","132":"分拣中心订货数量统计",
	"200":"产品管理","210":"产品类别管理","211":"新增产品类别","212":"编辑产品类别","213":"删除产品类别","220":"产品管理","221":"增加产品","222":"编辑产品","223":"删除产品","230":"产品价格管理","231":"新增产品价格","232":"编辑产品价格","233":"删除产品价格",
	"310":"批次管理","311":"新增批次","312":"编辑批次","313":"删除批次",
	"400":"用户管理","410":"用户账号管理","411":"增加用户","412":"编辑用户","413":"删除用户","420":"商铺管理","421":"增加店铺","422":"编辑店铺","423":"删除店铺","430":"店铺操作员管理","440":"店铺分组管理","450":"业务员管理",
	"500":"物流管理","510":"物流路线","511":"新增线路","512":"编辑线路","513":"删除线路","520":"物流人员","521":"新增物流人员","522":"编辑物流人员","523":"删除物流人员",
	"610":"工单管理","611":"新增工单","612":"编辑工单","613":"删除工单","614":"打印工单","615":"打印订单",
	"700":"权限管理","710":"角色管理","720":"操作员管理"
};
$(document).ready(
	function() {
		view("main");
	}
);
var page = 0;
var maincount = 0;
var CustomRole = AV.Object.extend("CustomRole");
var query = new AV.Query(CustomRole);
var Sum=10;//记录 店铺名称查询显示的条数
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
		'<th>角色名称</th>' +
		'<th>角色权限</th>'+
		'<th>编辑</th>'+
		'<th>删除</th>'+
		'</tr>'+
		'</thead>';
	if (tag == "main") {
		query = new AV.Query(CustomRole);
		query.equalTo("enabled", true);
		query.count({
			success: function(count) {
				maincount = count;
			}
		});
	}
	query.descending("updatedAt");
	query.limit(10);
	query.skip(10 * page);
	query.find({
		success: function(object) {
			//----
			ShowObject(object, html);
		}
	});
	
	
}

function deletebatch(id) {
	if (confirm("确定要删除吗？")) {
		var CustomRole = AV.Object.extend("CustomRole");
		var query = new AV.Query(CustomRole);
		query.get(id, {
			success: function(role) {
				role.set('enabled', false);
				role.save(null, {
					success: function(role) {
						// 成功保存之后，执行其他逻辑.
						alert('删除成功！');
						window.location.reload();
					},
					error: function(role, error) {
						alert('删除失败！' + error.message);
					}
				});
			},
			error: function(role, error) {
				alert('删除失败！' + error.message);
			}
		});
	}
}

function reload() {
	window.location.reload();
}

function ShowObject(object, html) { //输出一个query find方法返回的结果集 到table里
	var len = object.length;
	for (var i = 0; i < len; i++) {
		var roleName = '';
		if (object[i].get("roleName") != null) {
			roleName = object[i].get("roleName");
		}
		var power='';
		if (object[i].get("power") != null) {
			power = object[i].get("power");
		}
		var ObjId = object[i].id;
		html += '<tr>' +
			'<td>' + roleName + '</td>'+
			'<td><div class="PowerList">' + PowerNumberToString(power); + '</div></td>';
			html += '<td><a href="RoleEdit.html?id=' + ObjId + '">编辑</td>';
			html += '<td><a href="javascript:deletebatch(\'' + ObjId + '\')">删除</td>';
			html += '</tr>';
	}
	$("#RoleList").html(html);
	
}
function PowerNumberToString(ArrayList){
	var PowerString='';
	for(var i=0;i<ArrayList.length;i++){
		var key=ArrayList[i];
		if(PowerArray[key]){
			PowerString+='['+PowerArray[key]+']'+',';
		}
	
	}
	return PowerString;
}
