var UserJoinStore = AV.Object.extend("UserJoinStore");
var query = new AV.Query(UserJoinStore);
//var User = AV.Object.extend('User');
//var Store = AV.Object.extend('Store');
//var storequery = new AV.Query(Store);
//storequery.include("owner");
/*storequery.find({
			success: function(object) {
				var len=object.length;
				alert(len);
				for (var i=0;i<len;i++) {
					var obj=object[i];
					var storeid=obj.id;
					var userid='';
					if(obj.get('owner')!=null){
						userid=obj.get('owner').id;
					}else{
						continue;
					}
					var mystore=new Store();
					mystore.id=storeid;
					var myuser=new User();
					myuser.id=userid;
					var newObj=new UserJoinStore();
					newObj.set('user',myuser);
					newObj.set('store',mystore);
					newObj.set('owner',true);
					newObj.save();
				}
				alert('success!');
			}
		});*/
query.find({
	success: function(object) {
		var len = object.length;
		alert(len);
		for (var i = 0; i < len; i++) {
			var obj = object[i];
			obj.set("owner",true);
			obj.save()
		}
		alert('success!');
	}
});

