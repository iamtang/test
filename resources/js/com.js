$(window).on("load", function(){
	//页面入口
	sapp.page.go(location.hash.substr(1));

	//loading
	$("#loading").removeClass("in");
});

$(function(){
	//初始化
	sapp.init({
		page:".page",
		preload:2
	});

	//页面滑动逻辑
	var lock = false;
	sapp.event.on("SWIPE", function(e){
		if(sapp.page.now==3) return; 
		if(sapp.page.now==2) {
			if(e.dir=="swipeLeft" && !lock) {
				lock = true;
				setTimeout(function(){
					lock=false;
					fn.binding();
				},1500);
			}
		}

		if(sapp.page.now==4) {
			if(e.dir=="swipeRight" && !lock) {
				lock = true;
				setTimeout(function(){
					lock = false;
					fn.binding();
				},1500);
			}
		}
		switch(e.dir){
			case "swipeLeft" : sapp.page.next(); break;
			case "swipeRight" : sapp.page.prev(); break;
		}
	});


	//自适应
	sapp.fill({
		target : ".main",
		 width : 1200,
		height : 960,
		  mode : "50% 100%"
	});



	//分享
	var share = sapp.share({
		text : $("meta[name='shareText']").attr("content"),
		icon : $("meta[name='shareIcon']").attr("content")
	});
	sapp.event.on("SHARE", function(e){
		Mar.Seed.request("sapp","click","share"); //分享统计
	});
	
	//分享弹层
	$("#btnShare").on("click", function(){
		$("#popShare").addClass("on");
	});
	$("#popShare").on("click", function(){
		$(this).removeClass("on");
	});


	//页面到达统计
	sapp.event.on("PAGE_NEXT",function(e){
		Mar.Seed.request("sapp","swipe",("page"+e.page));
	});


});

