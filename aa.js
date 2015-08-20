/**
 * 专题 MZT 组件
 * @author 蕉皮
 * @version 1.8.3 2015-08-04
 * @wiki   http://wiki.corp.vipshop.com/pages/viewpage.action?pageId=33373848
 */

window.MZT = window.MZT || {};


//参数
MZT.info = (function(){
  var _e={};
  var reg = location.href.match(/s(\d+)_([^_]+).*_index/) || undefined;
  _e.urlName   = reg && reg[0];//链接上的文件名(如s12345_nh_index)
  _e.urlSid    = reg ? reg[1] : 0;//链接上的sid
  _e.urlWh     = reg ? reg[2] : 'nh';//链接上的分仓
  _e.urlIsWap  = /m\.vip\.com/i.test(location.hostname);//链接上的是否wap判断
  _e.isTemp    = /_index\.html$/.test(location.pathname);//是否模板状态
  _e.isWeixin  = /micromessenger/i.test(navigator.userAgent);//是否微信
  _e.isAndroid = /android/i.test(navigator.userAgent);//是否安卓
  _e.isIos     = /iphone|ipad/i.test(navigator.userAgent);//是否ios
  _e.isApp     = /appvipshop\.com/.test(location.hostname);//是否是app域判断

  var userType =  location.href.match( /s\d+_[^_]+_([^_]+)_index/ );
  if( userType = userType ? userType[1] : false ){
    _e.userType  = userType;  //用户类型标识
    _e.isNew     = userType === 'new';    //是否是新客
    _e.isRegular = userType === 'regular';  //是否是老客
  }
  

  $(function(){
    _e.isWap  = /wap/i.test(window.source); //是否wap判断
    _e.VIP_WH = window.warehouse; //带VIP_的大写分仓
    _e.wh     = window.warehouse && window.warehouse.toLowerCase().substr(4);//分仓

    //专题参数补全
    _e.mztPara = "";
    var para = {
             width : window.width        || "",
            height : window.height       || "",
            client : window.client       || "wap",
            source : window.source       || "",
         warehouse : window.warehouse    || "VIP_NH",
           area_id : window.area_id      || "",
               net : window.net          || "",
          mars_cid : window.mars_cid     || "",
        is_preload : window.is_preload   || "",
       newcustomer : window.newcustomer  || "",
      wap_consumer : window.wap_consumer || "",
       app_version : window.app_version  || "5.1.0",
          app_name : window.app_name     || ""
    };
    for(var p in para) _e.mztPara += "&"+p+"="+para[p];
  });
  return _e;
})();

//通用链接模块
MZT.link = (function(){
  var _e={}, _p={};

  //链接格式
  _e.APP_SPECIAL = "http://msp.appvipshop.com/uploadfiles/exclusive_subject/te/v1/s{sid}_{wh}_index.php?wapid=mzt_{sid}&wh=VIP_{WH}{webview}&title=唯品会";
  _e.APP_SPECIAL1 = "http://msp.appvipshop.com/uploadfiles/exclusive_subject/te/v1/s{sid}_{wh}_{userType}index.php?wapid=mzt_{sid}&wh=VIP_{WH}{webview}&title=唯品会";
    _e.APP_SPECIAL2 = "http://mst.vip.com/uploadfiles/exclusive_subject/te/v1/{sid}.php?wapid=mst_{sid}&_src=mst";
  
  _e.WAP_SPECIAL2 = "http://m.vip.com/index.php?m=special&p=/te/v1/{sid}.php&h=mst.vip.com&wapid=mst_{sid}&_src=mst";
  _e.WAP_SPECIAL = "http://m.vip.com/index.php?m=special&p=/te/v1/s{sid}_{wh}_index.php";
  _e.WAP_SPECIAL1 = "http://m.vip.com/index.php?m=special&p=/te/v1/s{sid}_{wh}_{userType}index.php";
  _e.WAP_BRAND   = "http://m.vip.com/brand-{area}-0-0-0-1-0-1-40.html?m=brand&brand_id={area}";
  _e.WAP_PRODUCT = "http://m.vip.com/product-{area}-{item}.html?m=product&brand_id={area}&product_id={item}&title=";
  _e.WAP_PRODUCT_ADDCART = "javascript:core.addcart(window.global_domain_url+'/index/addcart?','jsonp','callbackaddcart',window.client,window.warehouse,{area},{item},window.mars_cid,'',true);"
  



  _e.WEIXIN_SPECIAL = "http://weixin.vip.com/purchase/special?m=special&p=/te/v1/s{sid}_{wh}_index.php&h=mzt.vip.com";
  _e.WEIXIN_SPECIAL1 = "http://weixin.vip.com/purchase/special?m=special&p=/te/v1/s{sid}_{wh}_{userType}index.php&h=mzt.vip.com";
  _e.WEIXIN_BRAND   = "http://weixin.vip.com/brand-{area}.html";
  _e.WEIXIN_PRODUCT = "http://weixin.vip.com/product-{area}-{item}.html";

  //参数替换
  _e.replace = function(string, para){
    for(p in para){
      string = string.replace(new RegExp("{"+p+"}", "g"), para[p]);
    }
    return string;
  }

  //端映射
  _e.router = function(map, mars_sead, hash){
    if(mars_sead) Mar.Seed.request("mzt","click",mars_sead);//埋点
    var redirect = function(url){
      location.href = url + (hash||'');
    }
    switch(true){
      case MZT.info.isWeixin:
      redirect(map["weixin"] || map["wap"]);
      break;

      case !MZT.info.isWap:
      redirect(map["app"] || map[MZT.info.isIos ? "iosApp" : "andApp"] || map["wap"]);
      break;

      default:
      redirect(map["wap"]);
    }
  }

  //万能跳转
  _e.go = function(type, para, target, hash){
    hash = /^#/.test(target) ? target : hash || '';
    var wh = "all";
    var value = para;
    var webview = "";
    switch(true){
      case target=="_self":
        webview="";
        break;
      case target=="_blank":
        webview="&m=webview";
        break;
      default:
        //缺省新窗口打开
        webview="&m=webview";
    }
    if(para && typeof para === "object"){
      wh = MZT.info.wh || "nh";
      value = para[wh];
    }

    switch(type){
      //专题
      case "special":
      var userType =  MZT.info.userType ?  MZT.info.userType+'_' :  '';
      _e.router({
          weixin : _e.replace(_e.WEIXIN_SPECIAL1, {sid:value, wh:wh, userType: userType}) + MZT.info.mztPara,
             wap : _e.replace(_e.WAP_SPECIAL1, {sid:value, wh:wh, WH:wh.toUpperCase(), userType: userType}) + MZT.info.mztPara,
             app : _e.replace(_e.APP_SPECIAL1, {sid:value, wh:wh, WH:wh.toUpperCase(), userType: userType, webview:webview}) + MZT.info.mztPara
        }, "special-"+value, hash);
      
      break;

      //专题
      case "special2":
      _e.router({
           wap : _e.replace(_e.WAP_SPECIAL2, {sid:value}) + MZT.info.mztPara,
           app : _e.replace(_e.APP_SPECIAL2, {sid:value, webview:webview}) + MZT.info.mztPara
      }, "special2-"+value, hash);
      break;

      //专场
      case "brand":
      _e.router({
        weixin : _e.replace(_e.WEIXIN_BRAND, {area:value}),
           wap : _e.replace(_e.WAP_BRAND, {area:value})
      }, "brand-"+value, hash);
      break;

      //单品
      case "product":
      if( !value )return; //没有仓位不跳转
      value = value.split("-");
      _e.router({
        weixin : _e.replace(_e.WEIXIN_PRODUCT, {area:value[0], item:value[1]}),
           wap : _e.replace(window.hawk ? _e.WAP_PRODUCT_ADDCART : _e.WAP_PRODUCT, {area:value[0], item:value[1]})
      }, "product-"+value[0]+"-"+value[1], hash);
      //
      break;

      //首页
      case "index":
      _e.router({
        weixin : "http://weixin.vip.com",
           wap : "http://m.vip.com?m=home",
        andApp : "http://m.vip.com?m=home",
        iosApp : parseFloat(window.app_version)>=5.1 ? "http://m.vip.com?m=home" : "vipshop://showMenuItem?typeID=0&typeValue=0"
      }, "backIndex");
      break;

      //美妆频道
      case "makeup":
      case "makeUp":
      _e.go("special", $(window).width()<1024 ? 16903 : 16904);
      break;

      //亲子频道
      case "kids":
      _e.go("special", $(window).width()<1024 ? 16907 : 16908);
      break;

      //居家频道
      case "home":
      _e.go("special", $(window).width()<1024 ? 16905 : 16906);
      break;

      //ma域活动链接
      case "ma":
      _e.router({
           wap : para,
           app : para.replace("ma.vip.com", "ma.appvipshop.com") + webview + "&source=app" + MZT.info.mztPara
      }, (para.match(/wapid=(ma_423)/)||[])[1], hash);
    }
  }
  return _e;
}());


//自适应模块
MZT.adaption = (function(){
  var _e={}, _p={};
  _p.win = $(window);

  _e.psdWidth = 640;

  $(function(){
    $(".wrapper:not(.mzt-frame-nopad) .mzt-block:not(.mzt-frame-nopad)").addClass("mzt-frame-pad");
  });

  _e.update = function(){
    try{_e.setRootFontSize()}catch(e){}
    try{_e.setPatImage()}catch(e){}
  }

  //响应式图片切换
  _e.setPatImage = function(){
    var pat = _p.win.width()<1024 ? "phone" : "pad";
    var patImg = $("img[data-pat-src]");
    var patImgPhone = $(".mzt-frame-nopad img[data-pat-src]");
    patImgPhone.each(function(){
      var patSrc = this.getAttribute("data-pat-src").replace(/{pat}/g, "phone");
      this.setAttribute("data-pat-src", patSrc);
    });

    patImg.each(function(){
      var src = this.getAttribute("data-pat-src").replace(/{pat}/g, pat);
      if(!/{.*}/.test(src)) this.setAttribute("src", src);
    });
  }

  //根元素的字体缩放函数
  _e.setRootFontSize = function(){
    var ww = _p.win.width();
    var min = 320;
    var max = _e.psdWidth;
    if(ww<min) ww=min;
    if(ww>max) ww=max;
    $("html").css("font-size", ww*100/max+"px");
  }

  //
  window.addEventListener("resize", _e.update, false);
  $(_e.update);
  return _e;
})();


//悬浮贴顶导航模块
MZT.fixbar = (function(){
  var _e={}, _p={};
  _p.win = $(window);

  _e.set = function(para){
    //参数解析
    var bar = para || {};
    bar.psdWidth = para.psdWidth || 640;
    bar.phone = $.extend({height:0, fixtop:0, top:0}, para.phone);
    bar.pad = $.extend({height:0, fixtop:0, top:0}, para.pad);
    bar.usePadding = typeof(para.usePadding)!='undefined' ? para.usePadding : true;

    //滚动触发
    var onScrolling = function(){
      var st = _p.win.scrollTop();
      if(st < bar.status.delta){
        if(bar.status.now!="auto"){
          bar.dom.removeClass("fixed").css(bar.status.auto);
          bar.status.now = "auto";
          //针对安卓某些渣渣机型悬浮导航贴顶后回不来的bug的修复
          if(/android/i.test(navigator.userAgent)){
            bar.dom.hide();
            setTimeout(function(){
              bar.dom.show();
            }, 50);
          }
        }
      }else{
        if(bar.status.now!="fixed"){
          bar.dom.addClass("fixed").css(bar.status.fixed);
          bar.status.now = "fixed";
        }
      }
    }

    //初始化
    var init = function(){
      bar.dom = $(para.dom || "").addClass("mzt-fixbar");
      if(bar.usePadding && !bar.padding){
        bar.padding = bar.dom.after('<div class="mzt-fixbar-padding"></div>').next();
      }
      if(!_p.wrapper) _p.wrapper = $(".wrapper");

      var isPhone = _p.wrapper.width()<1024;

      var mode = bar[isPhone ? 'phone' : 'pad'];
      var rate = Math.max(Math.min(isPhone ? 640 : bar.psdWidth, _p.win.width()), 320)/bar.psdWidth;
      var ttop = mode.top * rate;
      var tfix = mode.fixtop * rate;
      var height = mode.height * rate;
      bar.dom.css('max-width', isPhone ? 640 : 1024);

      bar.status = {
         auto : {position:'absolute', top:ttop, height:height},
        fixed : {position:'fixed',    top:tfix, height:height},
        delta : ttop - tfix + _p.wrapper.offset().top,
          now : ''
      };

      if(bar.padding) bar.padding.height(height);

      onScrolling();
    }

    $(init);
    window.addEventListener("resize", init, false);
    window.addEventListener("scroll", onScrolling, false);
    window.addEventListener("touchmove", onScrolling, false);
    $('.mzt-nav').css('visibility', 'visible');
  }

  return _e;
})();



//倒计时
MZT.counter = (function(){
  var _e={},_p={};

  _p.init = function(){
    var targets = document.querySelectorAll(".mzt-counter time");
    for(var c=0; c<targets.length; c++){
      targets[c].deadline = +new Date(targets[c].getAttribute("datetime"));
      targets[c].shortDay = targets[c].getAttribute("data-shortDay")==="true";
      targets[c].timesup = false;
    }
    var count = function(){
      var now = Date.now();
      for(var c=0; c<targets.length; c++){
        if(targets[c].timesup) continue;

        var delta = Math.max(targets[c].deadline - now, 0);
        var time = {
          dd : parseInt((delta/8.64e7)),
          hh : parseInt((delta%8.64e7)/3.6e6),
          mm : parseInt((delta%3.6e6)/6e4),
          ss : parseInt((delta%6e4)/1e3),
          ms : parseInt((delta%1e3)/1e2)
        }
        var tstr;
        if(targets[c].shortDay && !!time.dd){
          tstr = ""
             + (time.dd<10 ? "" : "<span>"+parseInt(time.dd/10)+"</span>")
                 + "<span>"+(time.dd%10)+"</span>"
                 + "<b>天</b>"
        }else{
          tstr = ""
             + (!time.dd ? "" : "<span>"+parseInt(time.dd/10)+"</span>")
                 + (!time.dd ? "" : "<span>"+(time.dd%10)+"</span>")
                 + (!time.dd ? "" : "<b>天</b>")
                 + "<span>"+parseInt(time.hh/10)+"</span>"
                 + "<span>"+(time.hh%10)+"</span>"
                 + "<b>时</b>"
                 + "<span>"+parseInt(time.mm/10)+"</span>"
                 + "<span>"+(time.mm%10)+"</span>"
                 + "<b>分</b>"
                 + "<span>"+parseInt(time.ss/10)+"</span>"
                 + "<span>"+(time.ss%10)+"</span>"
                 + "<b>秒</b>"
                 + "<span>"+(time.ms%10)+"</span>"
        }
        if(targets[c].innerHTML!=tstr) targets[c].innerHTML = tstr;
        if(delta<=0) targets[c].timesup = true;
      }
    }
    
    setInterval(count, 100);
    count();
  }

  _e.init = _p.init;  //给外部暴露重新初始化的接口
  $(_p.init);
  return _e;
})();


//加商品即将揭晓的遮罩
MZT.mask = (function(){
  var _e={},_p={};
  _p.getMaskStyle = function(maskID){
    return ""
    + ".mzt-o-item [href*='"+maskID+"']{pointer-events:none;}"
    + ".mzt-o-item [href*='"+maskID+"'] .tpl_pic::before{display:block;}"
    ;
  }
  _p.mask = function(maskID){
    var str = "";
    for(var i=0;i<maskID.length;i++) str += _p.getMaskStyle(maskID[i]);
    $(function(){
      $("body").append('<style class="mzt-style" rel="stylesheet" type="text/css">'+str+'</style>');
    });
  }
  return _p.mask;
})();



//组件加载器
MZT.comLoader = (function(){
  var _e={},_p={};
  _p.FORMAT_SCRIPT = '<script class="mzt-script" src="{link}"></script>';
  _p.FORMAT_STYLE = '<link class="mzt-style" href="{link}" rel="stylesheet" type="text/css">';

  _e.m = {};

  //加载器
  _e.use = function(para){
    para = $.extend({
          path : '',
          name : '',
          wrap : '',
      onLoaded : null
    }, para);

    if(!para.name) return;
    if(!para.path) console.log("本地组件:%c"+para.name, "color:blue;font-size:16px;");
    if(para.path=='mzt_com') para.path = 'http://weixin-static.vip.com/uploadfiles/mzt_com';

    _e.m[para.name] = para;
    para.path = para.path.replace(/[^\/]$/,'$&/');
    _e.load(para.name, "index.js", parseInt(Date.now()/1000));
  };

  //加载文件
  _e.load = function(name, file, version){
    if(!_e.m[name]) return;
    var file = _e.m[name].path + name +"/"+ file +"?v="+ version;
    var format;
    switch(true){
      case /\.js/.test(file)  : format=_p.FORMAT_SCRIPT;break;
      case /\.css/.test(file) : format=_p.FORMAT_STYLE;break;
      default: return;
    }
    document.write(format.replace(/{link}/, file));
  }

  return _e;
}());



//重写item单品收藏后实时更新收藏数据接口
$(function () {
    window.core = window.core || {};
    window.core.ajaxfavourite = function (type,brand_id,brand_sn,sell_time_from,sell_time_to){
    
    if( /^http:/.test(type) ){  //item里的收藏
      var ajax_url = type;
    }else{  //自定义收藏
       var para = {
                  type : type           || 'add',
              brand_id : brand_id       || '',
              brand_sn : brand_sn       || '',
        sell_time_from : sell_time_from || '',
          sell_time_to : sell_time_to   || ''
     };
     var pstr = "";
     for(var p in para) pstr += "&"+p+"="+para[p];
     var ajax_url = "http://mzt.vip.com/cmstopic/index/ajaxbrandfavourite?" + pstr.substr(1) + MZT.info.mztPara;
  }

  if( MZT.info.isApp ){ //app切换域
      ajax_url = ajax_url.replace('mzt.vip.com', location.hostname);
    }

    $.ajax({
      url : ajax_url,
      async : true,
      dataType : 'jsonp',
      success:function(data){
            var brand_data = data.info.data;
            var type = data.filter_args.type;
            if(data.info.code==1){
              for(var i=0; i<brand_data.length; i++){
                if(brand_data[i].status!=1) continue;
                var btnFav = $("[data-favorite-status-brand-sn='"+brand_data[i].brand_sn+"']");
                if(btnFav.length==0) continue;
                //
              if(type=="add"){
                  btnFav.children().attr("onclick",data.next_action).addClass("off");
              }else if(type=="cancel"){
                  btnFav.children().attr("onclick",data.next_action).removeClass("off");
              }

              //收藏人数+1/-1
              var numFav = $("[data-favorite-brand-sn='"+brand_data[i].brand_sn+"']");
              if(numFav.length){
                var curNum = +numFav.html().replace(/,/g, '') + ((type=='add')?1:-1);
              numFav.html(curNum.toString().replace(/\B(?=(?:\d{3})+$)/g,','));
            }
              }
            }else if(data._redirect){
                location.href = data._redirect;
                return;
            }
            if(window.notify_tips) window.notify_tips(data.info.pms_msg||data.info.msg,2000);
        }
    });
   }
});


//埋点提示
$(function(){
  window.Mar = window.Mar || {
    Seed : {
      init:(function(){
        $("[mars_sead]").click(function(){
          Mar.Seed.request('','',$(this).attr("mars_sead"));
        });
      }()),
      request:function(a,b,mars_sead){
        console.log("埋点:%c"+mars_sead, "color:blue;font-size:16px;");
      }
    }
  }
});



//item功能
$(function(){
  //收藏时阻止a的跳转
  $(".mzt-o-item").delegate(".tpl_btn_fav","click",function(){return false});

  //item埋点
    $(".mzt-o-item").delegate("a", "click", function(){
        var link = $(this).attr("href");
    var bid = link.match(/brand_id=(\d+)|brandId=(\d+)/);
    var pid = link.match(/product_id=(\d+)|goodsId=(\d+)/);
    var vis = link.match(/vis\/pages\/(\d+)/);
    if(bid && pid){
      bid = bid[1] || bid[2];
      pid = pid[1] || pid[2];
      Mar.Seed.request("mzt","click","item-product-"+bid+"-"+pid);
    }else if(bid){
      bid = bid[1] || bid[2];
      Mar.Seed.request("mzt","click","item-brand-"+bid);
    }else if(vis){
      Mar.Seed.request("mzt","click","item-vis-"+vis);
    }
    });

    //导航自动埋点
    $(".mzt-nav a").each(function(i){
      var index = i;
      $(this).click(function(){
        Mar.Seed.request("mzt","click","nav-"+index);
      });
    });

    //导航自动加高亮样式
    $(".mzt-nav nav").each(function(){
        var now = 0;
        var nav = $(this).addClass("nav"+now);
        var len = nav.children().length;
        $(document).scroll(function(){
          var i;
            var st = $(document).scrollTop() + nav.height() + 5;
            for(i=0;i<len;i++){
                var ft = (document.getElementById("floor"+(i+1)) || {offsetTop:0}).offsetTop;
                if(st<ft) break;
            }
            if(now!=i){
                now=i;
                nav.removeClass().addClass("nav"+now);
            }
        });
    });
});


$(function(){
    //品购图片区lazyload
    var scImage = $(".mzt-staticcut-image p");
    var scImageLazyload = function(){
        var len = scImage.length;
        var wh = $(window).height();
        var st = $(document).scrollTop();
        var delta = 100;
        if(len<=0) {
          $(document).off("scroll", scImageLazyload);
          return;
        }
        for(var i=0; i<len; i++){
            var image = scImage.eq(i);
            if(image.offset().top-st-wh>delta) break;
            image.addClass("onload");
        }
        scImage = scImage.filter(":not(.onload)");
    }
    $(document).on("scroll", scImageLazyload);
    $(window).on("load", function(){
      scImageLazyload(); //修复一些bug强制刷新
      setTimeout(scImageLazyload, 100); //修复一些bug再强制刷新一下
    });
    scImageLazyload();

    //已售完icon
    $(".mzt-staticcut-product .seldout:not(.mzt-pwh-"+(MZT.info.wh||'nh')+")").remove();
    try{scroll.init()}catch(e){}//已售完的初始化
});



//收藏接口--start------------------
/**
 * 收藏接口
 * @param  {[type]}   type               [添加收藏： add,   取消收藏：cancel]
 * @param  {[type]}   brand_id__brand_sn [档期id-品牌id，6位-8位]
 * @param  {[type]}   sell_time_from     [收藏开始时间： YYYY/MM/DD HH:MM:SS]
 * @param  {[type]}   sell_time_to       [收藏结束时间： YYYY/MM/DD HH:MM:SS]
 * @return {[type]}                      [description]
 
 usage: 
  MZT.fav('add','465081-10013224', '2015/07/01 00:00:00' ,'2015/07/30 00:00:00', function (data) {
    console.log(data);
  })
  .done(function (data) {
    console.log(data);
  })
  .fail(function (data) {
    console.log(data);
  })
  .always(function (data){
    console.log('always')
  });
 */
MZT.fav = (function () {
  var _p = {};
    function ajaxclientfavourite(type,brand_id__brand_sn,sell_time_from,sell_time_to){

        var _index = brand_id__brand_sn.indexOf('-');

        var brand_id = brand_id__brand_sn.substring(0, _index);
        var brand_sn = brand_id__brand_sn.substring(_index+1);
        var sell_time_from = +new Date(sell_time_from)/1000;    //开始时间，s
        var sell_time_to = +new Date(sell_time_to)/1000;      //结束时间, s

        var me = arguments.callee;
        var  
              client        =  window.client
              ,app_name     =  window.app_name
              ,app_version  =  window.app_version
              ,wap_consumer =  window.wap_consumer
              ,mars_cid     =  window.mars_cid
              ;

        //debug
        if( /debug=mzt_fav/.test(location.search) ){
          var  
              client        = 'wap'
              ,app_name     = 'wap'
              ,app_version  = '4.0'
              ,wap_consumer = 'B'
              ,mars_cid     = '1435298928566_7d06d3e9b659d66205aca90ef0fa0031'
              ;
              window.notify_tips = function () {
                
              }
        }

        var ajax_url="http://mzt.vip.com/cmstopic/index/ajaxbrandfavourite?"+"&type="+type+"&client="+client+"&brand_id="+brand_id+"&brand_sn="+brand_sn+"&sell_time_from="+sell_time_from+"&sell_time_to="+sell_time_to;
            ajax_url+="&app_name="+app_name+"&app_version="+app_version+"&wap_consumer="+wap_consumer+"&mars_cid="+mars_cid;
           
            if( MZT.info.isApp ){
              ajax_url = ajax_url.replace('mzt.vip.com', location.hostname);
            }

                 $.ajax({
                   async:true,
                   url : ajax_url,
                   dataType : 'jsonp',
                   success:function(data){
                      var data_info=data.info;
                      var data_brand=data_info.data;
                      var filter_args=data.filter_args;
                      var type=filter_args.type;
                      var next_action=data.next_action;

                      if(data_info.code==1){
                          $.each(data_brand, function(key2, val2) {
                            if(val2.status==1){
                            if(type=="add"){
                              if(data_info.pms_msg!="" && data_info.pms_msg!=null){
                                 
                                 _p.execSuccess(data_info);//mzt
                                 window.notify_tips(data_info.pms_msg,2000);
                              }else{
                                 
                                  _p.execSuccess(data_info);//mzt
                                 window.notify_tips(data_info.msg,2000);
                              }
                            }else if(type=="cancel"){
                              
                              _p.execSuccess(data_info);//mzt
                              window.notify_tips(data_info.msg,2000);
                            }
                          }
                          });
                    
                      }else{
                          
                        if(data._redirect!=""){
                           window.location.href=data._redirect;
                           return false;
                        }else{
                           _p.execFail(data_info);  //mzt
                           window.notify_tips(data_info.msg,2000);
                        }//end if  
                      }//end if

                      typeof _p.execAlways === 'function' && _p.execAlways(data_info);  //mzt
                  }
                });
               
        return _p;
    }

    /**
     * [success description]
     * @param  {[type]} successCb [收藏/取消收藏  成功后的回调]
     * @return {[type]}           [description]
     */
    _p.done = _p.success = function (successCb) {
      this.execSuccess = successCb || function (){};
      return this;
    };

    /**
     * [fail description]
     * @param  {[type]} failCb [收藏/取消收藏  失败后的回调]
     * @return {[type]}        [description]
     */
    _p.fail = function (failCb) {
      this.execFail = failCb || function (){};
      return this;
    };

    /**
     * [always description]
     * @param  {[type]} alwaysCb [成功或失败都会执行的回调]
     * @return {[type]}          [description]
     */
    _p.always = function (alwaysCb) {
      this.execAlways = alwaysCb || function (){};
      return this;
    };

    return ajaxclientfavourite;
})();

//收藏接口--end------------------

alert(1);


