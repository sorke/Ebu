/**
 * Created by zhengyinhua on 15-10-7.
 */
$(document).ready(
	function() {
		ShowSCDC(); //显示所有分拣和配送中心
		ShowRoles(); //角色下拉框
	}
);
var SortingCenter = AV.Object.extend("SortingCenter");
var DistributionCenter = AV.Object.extend("DistributionCenter");
function addOpe(){
	var UserID=$("#owner").prop('name');
	var CheckSCList = new Array(); //储存所有选中的分拣中心
	var CheckDCList = new Array(); //储存所有选中的配送中心
	var power = $('#role option:selected').val().split(/,/);  //获取权限数组
	var roleID = $('#role option:selected').attr("id");
	if(UserID==""){
		alert('请输入用户名');
		return false;
	}
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
	if(CheckSCList.length==0){
		alert('请至少选择一个分拣中心！');
		return false;
	}else if (CheckDCList.length==0) {
		alert('请至少选择一个分拣中心对应的配送中心！');
		return false;
	}
	if(checkSubmit(CheckSCList)==false){//检查分拣和分配中心选择合法性
		return false;
	};
	
	AV.Cloud.run('AddOpe', {
			CheckSCList: CheckSCList,
			CheckDCList: CheckDCList,
			power: power,
			roleID: roleID,
			UserID: UserID,
		}, {
			success: function(data) {
				//调用成功，得到成功的应答data
				alert(data);
				subEnd();
				history.back(-1);
			},
			error: function(err) {
				//处理调用失败
				alert(err.message);
				subEnd();
				location.reload();
			}
	});
}
function ShowSCDC() {
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
				html_sc += "<input type='checkbox' name='sc' value=\'"+result.id+ "\' onclick=\'sc_change(this,\""+result.id+"\")\' /> " + scName + ' ';
				var DCrelation = result.relation('distributionCenter');
				DCrelation.query().find({
					success: function(obj) {
						html_dc+="<div id=\'"+result.id+"\' class='checkDIV '>";
						html_dc+="<div class='scNamediv'>"+scName+"："+"</div>";
						for (var i = 0; i < obj.length; i++) {
							var dcName = obj[i].get('dcName');
							html_dc += "&nbsp;&nbsp;&nbsp;<input type='checkbox' name='dc'  value=\'"+ obj[i].id+"\'/> " + dcName + '  ';
						}
						html_dc+="</div>";
						if(flag==len){
							$("#SCenter").html(html_sc);
							$("#DCenter").html(html_dc);
						}
						Addclik(); //增加check的click事件
					}
				});
				promise = promise.then(function() {
					return true;
				});
			});
			return promise;
		}
	});
}
function ShowRoles() {
	var html_op = '<option value="0">--------请选择--------</option>';
	var CustomRole = AV.Object.extend("CustomRole");
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
		}
	});
}
function SearchName() {
	var InputName = $("#owner").val();
	var User = AV.Object.extend("User");
	var UserQuery = new AV.Query(User);
	UserQuery.equalTo("username", InputName);
	UserQuery.include('role');
	UserQuery.find({
		success: function(result) {
			var Alert = '请输入用户名！';
			if (result[0] != null) {
				if (result[0].get("isOperator")) {
					alert('该用户已经是操作员，请重新输入！');
					$("#Alert").css('color', 'red');
				} else {
					var nickname = '无';
					if (result[0].get('nickname')) {
						nickname = result[0].get('nickname');
					}
					var role="";
					if (result[0].get('role')) {
						role = result[0].get('role').id;
						var tempRole = "#role  option[id=\'" + role + "\']";
						$("#role option").attr("selected", false);
						//alert(tempRole);
						$(tempRole).attr("selected", true);
					}
					Alert = '昵称：' + nickname + ' ';
					$("#Alert").css('color', 'green');
					$("#owner").attr('name', result[0].id);
				}
			} else {
				Alert = "该用户不存在！";
				$("#owner").val('请输入用户名并搜索');
				$("#owner").css('color', '#999');
				$("#Alert").css('color', 'red');
				$("#role option").attr("selected", false);
			}
			$("#Alert").html(Alert);
		}
	});
}
function OnInput(event) {
	var value = event.target.value;
	var len = value.length;
	if (len == 11) {
		SearchName();
	} else {
		var html = "请输入11位手机号";
		$("#Alert").html(html);
		$("#user").attr('name', '');
		$("#user").css('color', '#999');
		$("#Alert").css('color', 'red');
	}
}