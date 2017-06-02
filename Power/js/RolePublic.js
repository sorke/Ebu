/**
 * Created by zhengyinhua on 15-10-6.
 */

function change(id, obj) {
	var temp = "#" + id;
	var ClassNames = obj.className.split(" ");
	var temp2 = '.' + ClassNames[0];
	if ($(temp).css("display") != "none") {
		$(temp).css("display", "none");
		$(temp2).css("background-image", "url(img/jia.png)");
	} else {
		$(temp).css("display", "block");
		$(temp2).css("background-image", "url(img/jian.png)");
	}

}
function SelectGroup(obj,name){
	var temp="input[type=checkbox][name="+name+"]";
	if ($(temp).prop('checked') == true){
		$(temp).prop('checked',true);
	}else{
		$(temp).prop('checked',false);
	}
	
}
$("input[type=checkbox][name=order]").click(function() {
	if ($("input[type=checkbox][name=order][value=all]").is(":checked") == true) {
		$("input[type=checkbox][name=order]").attr("checked", true);
	} else {
		$("input[type=checkbox][name=order]").attr("checked", false);
	}
});
function subStart() {
	$("#subButton").attr("disabled", "disabled"); //按钮禁用
	$("#subButton").css("background-color", "#808080");
}
function subEnd() {
	$("#subButton").removeAttr("disabled"); //将按钮可用	
	$("#subButton").css('background-color', 'rgb(66, 139, 202)');
}
//获取url上传入的id
function geturl(){
    var url = location.search.substr(1);
    var gethref;
    if(url.length > 0)
    {
        var  ar = url.split(/[&=]/);
        for(i=0;i<ar.length;i+=2)
        {
            gethref=ar[i+1];
        }

    }
    return gethref;
}
function sc_change(obj,id){
	if ($(obj).prop('checked') == true){
		$('#'+id).css("display","block");
	}
	else{
		$('#'+id).css("display","none");
	}
}
function checkSubmit(CheckSCList) {
	for (var i = 0; i < CheckSCList.length; i++) {
		var obj = CheckSCList[i];
		var temp="#"+obj+" input[type=checkbox]:checked";
		var scName=$('#'+obj+' .scNamediv').text().split('：')[0];
		var len_checked=0;
		$(temp).each(function() {
			len_checked+=1;
		});
		if(len_checked==0){
			alert(scName+"中的配送中心至少选择一个！或取消该分拣中心。");
			return false;
		}
	}
}
function Addclik(){
	$("#SCenter input[type=checkbox]").click(function() {
		$("#SCenter input").each(function(){
			if($(this).is(":checked") == false){
				var value=$(this).attr('value');
				$("#"+value+" input").each(function(){
					$(this).attr("checked", false);
				});
			}
		});
	});
	$("#DCenter input[type=checkbox]").click(function() {
		$("#DCenter input").each(function(){
			if($(this).is(":checked") == true){
				var parent_id=$(this).parent().attr('id');
				
				$("#SCenter input[value="+parent_id+"]").each(function(){
					$(this).attr("checked", true);
				});
				
			}
		});
	});
}
