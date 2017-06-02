/**
 * Created by zhengyinhua on 15-10-7.
 */
$(document).ready(
	function() {
		ShowSCDC(); //显示所有分拣配送中心
		EditMain();
		
	}
);
var User = AV.Object.extend("User");
var CustomRole = AV.Object.extend("CustomRole");
var SortingCenter = AV.Object.extend("SortingCenter");
var DistributionCenter = AV.Object.extend("DistributionCenter");
var SClist = new Array(); //修改前的分拣中心
var DClist = new Array(); //修改前的配送中心
function EditMain() {
	//自动填入当前操作员的相关信息---------------
	var UserID = geturl();
	var UserQuery = new AV.Query(User);
	UserQuery.get(UserID, {
		success: function(result) {
			// 成功获得实例
			var obj = result;
			var username = "";
			if (obj.get('username')) {
				username = obj.get('username');
			}
			var nickname = "无";
			if (obj.get('nickname')) {
				nickname = obj.get('nickname');
			}
			var role = "";
			if (obj.get('role')) {
				role = obj.get('role').id;
			}
			$("#owner").val(username);
			$("#Alert").css('color', 'green');
			$("#owner").css('color', '#000');
			$("#owner").attr('name', obj.id);
			var html = '昵称：' + nickname + ' ';
			$("#Alert").html(html);
			ShowRoles(role); //添加角色下拉列表 并且显示该用户的角色 由于会异步所以先显示再设置选中
			//设置默认值
			var SCrelation = result.relation('operableSCs');
			var DCrelation = result.relation('operableDCs');
			SCrelation.query().find({
				success: function(obj) {
					var len = obj.length;
					for (var i = 0; i < len; i++) {
						SClist.push(obj[i].id);
						if (i == len - 1) {
							DCrelation.query().find({
								success: function(obj) {
									var ln = obj.length;
									for (var j = 0; j < ln; j++) {
										DClist.push(obj[j].id);
										if (j == ln - 1) {
											//---a
											ShowSCDC(SClist, DClist);
										}
									}
								}
							});
						}
					}
				}
			});
		},
		error: function(result, error) {
			// 失败了.
		}
	});
}

function editOpe() {
	var power = $('#role option:selected').val().split(/,/);  //获取权限数组
	var roleID = $('#role option:selected').attr("id");
	var CheckSCList = new Array(); //储存所有选中的分拣中心
	var CheckDCList = new Array(); //储存所有选中的配送中心
	if(power=='0'){
		alert('请选择用户角色！');
		return false;
	}
	$("input[type=checkbox][name=sc]").each(function() {
		if (this.checked) {
			if ($(this).val() != 'all')
				CheckSCList.push($(this).val());
		}
	});
	$("input[type=checkbox][name=dc]").each(function() {
		if (this.checked) {
			if ($(this).val() != 'all')
				CheckDCList.push($(this).val());
		}
	});
	if (CheckSCList.length == 0) {
		alert('请至少选择一个分拣中心！');
		return false;
	} else if (CheckDCList.length == 0) {
		alert('请至少选择一个配送中心！');
		return false;
	}
	if(checkSubmit(CheckSCList)==false){//检查分拣和分配中心选择合法性
		return false;
	};
	var UserID = $("#owner").prop('name');
	AV.Cloud.run('EditOpe', {
		CheckSCList: CheckSCList,
		CheckDCList: CheckDCList,
		SClist: SClist,
		DClist: DClist,
		roleID: roleID,
		power: power,
		UserID: UserID
	}, {
		success: function(data) {
			//调用成功，得到成功的应答data
			alert(data);
			subEnd();
			history.back(-1);
			
		},
		error: function(err) {
			//处理调用失败
			alert("shibai "+err.message);
			subEnd();
			window.location.reload();
		}
	});
}

function ShowSCDC(SClist, DClist) {
	var SCquery = new AV.Query(SortingCenter);
	var html_sc = '';
	var html_dc = '';
	SCquery.find({
		success: function(results) {
			var promise = AV.Promise.as();
			var flag = 0; //标记是否输出html
			var len = results.length;
			_.each(results, function(result) {
				flag += 1;
				var scName = result.get('scName');
				html_sc += "<input type='checkbox' name='sc' value=\'" + result.id + "\' onclick=\'sc_change(this,\"" + result.id + "\")\' /> " + scName + ' ';
				var DCrelation = result.relation('distributionCenter');
				DCrelation.query().find({
					success: function(obj) {
						html_dc += "<div id=\'" + result.id + "\' class='checkDIV_block'>";
						html_dc+="<div class='scNamediv'>"+scName+"："+"</div>";
						for (var i = 0; i < obj.length; i++) {
							var dcName = obj[i].get('dcName');
							html_dc += "&nbsp;&nbsp;&nbsp;<input type='checkbox' name='dc'  value=\'" + obj[i].id + "\'/> " + dcName + '&nbsp;';
						}
						
						html_dc += "</div>";
						if (flag == len) {
							$("#SCenter").html(html_sc);
							$("#DCenter").html(html_dc);
							for (var i = 0; i < SClist.length; i++) {
								$(":checkbox[value='" + SClist[i] + "']").prop("checked", true);
							}
							for (var i = 0; i < DClist.length; i++) {
								$(":checkbox[value='" + DClist[i] + "']").prop("checked", true);
							}
							Addclik(); //增加check的click事件
						}
					}
				});
				promise = promise.then(function() {
					return true;
				});
			});
			return promise;
		}
	});
	//----
}
function ShowRoles(role) {
	var html_op = '';
	var Query = new AV.Query(CustomRole);
	Query.find({
		success: function(results) {
			for (var i = 0; i < results.length; i++) {
				result = results[i];
				var roleName = result.get("roleName");
				var power = result.get("power");
				html_op += '<option id=\"' + result.id + '\"value=\"' + power + '\">' + roleName + '</option>';
			}
			var strID = '#' + 'role';
			$(strID).html(html_op);
			var tempRole = "#role  option[id=\'" + role + "\']";
			$(tempRole).attr("selected", true);
		}
	});
}
