/**
 * Created by zhengyinhua on 15-10-6.
 */
$(document).ready(
	function() {
		EditMain();
	}
);
var CustomRole = AV.Object.extend("CustomRole");
var ListStart = new Array(); //储存角色修改前的信息 以便后面比较是否需要更改
function EditMain() {
		//自动填入当前角色信息---------------
		var roleID = geturl();
		var RoleQuery = new AV.Query(CustomRole);
		RoleQuery.get(roleID, {
			success: function(result) {
				// 成功获得实例
				var obj = result;
				var roleName = "";
				if (obj.get('roleName')) {
					roleName = obj.get('roleName');
				}
				var power = "";
				if (obj.get('power')) {
					power = obj.get('power');
				}
				//加入修改前的信息到数组 以便提交时进行比较
				ListStart['roleName'] = roleName;
				ListStart['power'] = power;
				//设置默认值
				//载入下拉框列表并选择餐厅对应下拉属性----------------------
				$("#roleName").val(roleName);
				for (var i = 0; i < power.length; i++) {
					var temp = "input[type=checkbox][value=" + power[i] + "]";
					$(temp).attr("checked", true);
				}
			},
			error: function(result, error) {
				// 失败了.
				alert(error.messages);
			}
		});
	}

//--------------提交修改------------
function editRole() {
	//设置按钮样式 表示正在提交并且禁用按钮
	subStart();
	//获取提交时 当前页面的字段默认信息
	var roleName = $('#roleName').val();
	var CheckList = new Array(); //储存所有选中的checkbox
	$("input[type=checkbox]").each(function() {
		if (this.checked) {
			if ($(this).val() != 'all')
				CheckList.push($(this).val());
		}
	});
	var listLen = CheckList.length;
	//----------输入格式判断------------
	if (roleName == '') {
		alert('角色名称不能为空！');
		subEnd();
		return false;
	}
	if (listLen == 0) {
		alert('请至少选择一个权限！');
		subEnd();
		return false;
	}
	if ($("input[type=checkbox][name=login]").prop('checked') == false) {
		if (confirm("该用户没有设置后台登录权限是否继续提交？")) {

		} else {
			subEnd();
			return false;
		}
	}
	var roleID = geturl(); //获取ID
	var roleQuery = new AV.Query(CustomRole);
	roleQuery.get(roleID, {
		success: function(role) {
			//如果字段没有修改 则不需要再更新该字段
			
			role.set('roleName', roleName);
			role.set('power', CheckList);
			role.save(null, { //保存更新的对象
				success: function(role) {
					// 成功保存之后，执行其他逻辑.
					subEnd(); //按钮设为禁用
					alert('编辑角色成功！');
					history.go(-1);
				},
				error: function(role, error) {
					alert('编辑角色失败！，请重试！');
				}
			});
		},
		error: function(role, error) {
			alert('打开编辑窗失败！');
		}
	});
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
	//查询人员----------------------