/**
 * Created by zhengyinhua on 15-10-20.
 */
//页面加载后执行--------全局 申明-------
$(document).ready(
	function() {
		EditMain();
	}
);
var User = AV.Object.extend("User");
var Store = AV.Object.extend("Store");
var UserJoinStore = AV.Object.extend("UserJoinStore");
var STOREID = ''; //修改前的店铺ID
var USERID = ''; //修改前的用户ID
function EditMain() {
		//自动填入当前绑定的相关信息---------------
		var ID = geturl();
		var Query = new AV.Query(UserJoinStore);
		Query.include('user');
		Query.include('store');
		Query.get(ID, {
			success: function(result) {
				// 成功获得实例
				var obj = result;
				var nickname = '无';
				var user_username = '';
				if (obj.get('user')) {
					nickname = obj.get('user').get('nickname');
					user_username = obj.get('user').get('username');
					var userID = obj.get("user").id;
					USERID = userID;
				}
				var storeName = '';
				if (obj.get('store')) {
					var storeName = obj.get('store').get('storeName');
					var storeAddress=obj.get('store').get('storeAddress');
					STOREID = obj.get('store').id;
				}
				//设置默认值
				var html=storeName+"<samll>("+storeAddress+")</small>"
				$("#store").html(html);
				$("#user").val(user_username);
				$("#userAlert").css('color', 'green');
				$("#user").css('color', '#000');
				$("#user").attr('name', userID);
				var html = '昵称：' + nickname;
				$("#userAlert").html(html);
			},
			error: function(result, error) {
				// 失败了.
				alert('失败了' + error.message);
			}
		});
	}
	//提交表格-------------------------

function EditUserJoinStore() {
	subStart(); //设置按钮禁用
	var userID = $('#user').attr('name');
	if (userID == '') {
		alert('请输入绑定用户名并搜索');
		subEnd();
		return false;
	} else if (userID == USERID) {
		subEnd(); //按钮启用
		alert('修改成功！');
		history.go(-1);
	}
	var NewUser = new User();
	NewUser.id = userID;
	var NewStore = new Store();
	NewStore.id = STOREID;
	/*
	 * 检测该用户是否已经绑定该店铺
	 */
	var myquery = new AV.Query('UserJoinStore');
	myquery.equalTo('store', NewStore);
	myquery.equalTo('user', NewUser);
	myquery.count({
		success: function(count) {
			if (count) {
				alert('该用户已经绑定该店铺，请不要重复绑定');
				subEnd(); //按钮可用
			} else {
				//------------正式提交数据-------
				var EditID = geturl(); //获取ID
				var query = new AV.Query(UserJoinStore);
				query.get(EditID, {
					success: function(obj) {
						obj.set('user', NewUser);
						obj.save(null, { //保存更新的对象
							success: function(obj) {
								// 成功保存之后，执行其他逻辑.
								subEnd(); //按钮启用
								alert('编辑成功！');
								history.go(-1);
							},
							error: function(obj, error) {
								alert('编辑失败，请重试！');
								subStart();
							}
						});
					},
					error: function(obj, error) {
						alert('编辑失败，请重试！');
					}
				});
			}
		},
		error: function(error) {
			// 失败了
			alert(error);
		}
	});
}