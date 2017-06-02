/**
 * Created by zhengyinhua on 15-10-20.
 */
//页面加载后执行--------全局 申明-------
var User = AV.Object.extend("User");
var Store = AV.Object.extend("Store");
var UserJoinStore = AV.Object.extend("UserJoinStore");
//提交表格-------------------------
function addUserJoinStore() {
	subStart(); //设置按钮禁用
	var storeID = $('#store').attr('name');
	var userID = $('#user').attr('name');
	if (storeID == '') {
		alert('请输入店铺名称！');
		subEnd();
		return false;
	}
	if (userID == '') {
		alert('请输入待绑定用户！');
		subEnd();
		return false;
	}
	var NewUser = new User();
	NewUser.id = userID;
	var NewStore = new Store();
	NewStore.id = storeID;
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
				var NewUserJoinStore = new UserJoinStore();
				NewUserJoinStore.set('store', NewStore);
				NewUserJoinStore.set('user', NewUser);
				NewUserJoinStore.save(null, {
					success: function(pro) {
						subEnd(); //按钮设为禁用
						alert('绑定成功！');
						history.back(-1);
					},
					error: function(pro, error) {
						subEnd(); //按钮可用
						alert('绑定失败，请重试！', error);
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
