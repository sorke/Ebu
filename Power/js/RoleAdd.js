/**
 * Created by zhengyinhua on 15-10-6.
 */
//提交表格-------------------------
function addRole() {
	subStart(); //设置按钮禁用
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
	//------------正式提交数据-------
	var CustomRole = AV.Object.extend('CustomRole');
	var CustomRole = new CustomRole();
	CustomRole.set('roleName', roleName);
	CustomRole.set('power', CheckList);
	CustomRole.save(null, { //保存更新的对象
		success: function(role) {
			// 成功保存之后，执行其他逻辑.
			subEnd(); //按钮设为禁用
			alert('增加角色成功！');
			history.go(-1);
		},
		error: function(role, error) {
			alert('增加角色失败，请重试！');
			
		}
	});
}