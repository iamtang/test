
var fn=fn||{};

(function()
  {
      var x,xStart,xMove,xEnd,pageWidth,nowX,winWidth,page3Width;
      var bgX=0,pType=1,pageTurn=false,collideR=false,collideL=false,openArr=true;


      var _fn=_fn||{};
      var page3bg=document.getElementById('page3bg');
      var popBg=document.getElementById('popBg');
      var popArr=document.getElementsByClassName("pop");
      var nextPage=document.getElementById('nextPage');
      var phoneBg=document.getElementById('phoneBg');
      var share=document.getElementsByClassName('share');


      var _product=_product||{};
      var product=document.getElementsByClassName('product');
      var productArr=document.getElementsByClassName('productArr');
      var product_border=document.getElementsByClassName('product_border');
      var leftProduct=document.getElementsByClassName('leftProduct');
      var rightProduct=document.getElementsByClassName('rightProduct');
      var openProduct=document.getElementsByClassName('openProduct');
      var closeProduct=document.getElementsByClassName('closeProduct');


      var openEgg=document.getElementById('openEgg');
      var egg5=document.getElementById('egg5');
      var eggArr=document.getElementsByClassName('egg');
      var closeEggArr=document.getElementsByClassName('closeEgg');




      //_fn
      _fn.init=function()
      {
          nextPage.addEventListener("touchstart",_fn.nextPage,false); 
          
          // setTimeout(function()
          //   {
          //     setInterval(function()
          //       {
          //         _fn.phoneSp();
          //       },2000);
          //   },1000);
      }

      _fn.phoneSp=function()
      {
        phoneBgClassName=phoneBg.className;
        if(phoneBgClassName=="")
        {
          phoneBg.className="sp";
        }else
        {
          phoneBg.className="";
        }
      }

      _fn.bgTouchStart=function(evt)
      {
        var touch = evt.touches[0]; 
        xStart = Number(touch.pageX);
        collideL=collideR=false;
      }


      _fn.bgTouchMove=function(evt)
      {
        var touch = evt.touches[0]; 
        xMove = Number(touch.pageX);
        x=xStart-xMove;
        nowX=bgX-x;
        openArr=false;
        
        if(nowX>0){nowX=0;collideL=true;}
        else if(nowX<pWidth){nowX=pWidth;collideR=true;}
        else{pageTurn=false;collideL=false;collideR=false;}
        page3bg.style.webkitTransform="translateX("+nowX+"px)";

      }


      _fn.bgTouchEnd=function(evt)
      {
        evt.stopPropagation();
        var touch = evt.changedTouches[0]; 
        xEnd = Number(touch.pageX);
        openArr=true;
        if(nowX<=0&&nowX>=pWidth)
        {
            bgX=bgX-(xStart-xEnd);
            page3bg.style.webkitTransform="translateX("+(nowX)+"px)";

        }

        _fn.collide();
        
      }


      _fn.collide=function()
      {
        if(collideL)
        {
          if(xStart-xEnd<0)
          {
            bgX=0;
            if(pageTurn)
            {
              _fn.removed();
              sapp.page.prev();

            }
          }

        }

        if(collideR)
        {
          if(xStart-xEnd>0)
          {
            bgX=pWidth;
            if(pageTurn)
            {
              _fn.removed();
              sapp.page.next();

            }

          }
            
        }


        pageTurn=true;

      }

      _fn.winWidth=function()
      {
        if (window.innerWidth) 
        winWidth = window.innerWidth; 
        else if ((document.body) && (document.body.clientWidth)) 
        winWidth = document.body.clientWidth; 

        return winWidth;
      }

      _fn.page3Width=function()
      {
        var page3Width=page3bg.clientWidth;

        return page3Width;
      }

      _fn.removed=function()
      {
        page3bg.removeEventListener("touchstart",_fn.bgTouchStart,false); 
        page3bg.removeEventListener("touchmove",_fn.bgTouchMove,false); 
        page3bg.removeEventListener("touchend",_fn.bgTouchEnd,false); 

      }   

      _fn.nextPage=function()
      {
        sapp.page.next();
      }

      //fn
      fn.binding=function()
      {
        page3bg.addEventListener("touchstart",_fn.bgTouchStart,false); 
        page3bg.addEventListener("touchmove",_fn.bgTouchMove,false); 
        page3bg.addEventListener("touchend",_fn.bgTouchEnd,false); 

        pWidth=_fn.winWidth()-_fn.page3Width();


        for(var i=0;i<share.length;i++)
        {
          
              //product[i].addEventListener("touchstart",function(e){e.stopPropagation();},false); 
              share[i].addEventListener("touchstart",function(e){goShare();},false); 

           

        }


        for(var i=0;i<product.length;i++)
        {
          (function()
            {
              var p=i;
              //product[i].addEventListener("touchstart",function(e){e.stopPropagation();},false); 
              product[i].addEventListener("touchend",function(e){_product.productArr(p);},false); 

            })();

        }

        for(var i=0;i<openProduct.length;i++)
        {

          (function()
            {
              var p=i;
              openProduct[i].addEventListener("touchstart",function(e){e.stopPropagation();_product.productOpen(p);},false); 
            })();


        }

         for(var j=0;j<closeProduct.length;j++)
        {
          closeProduct[j].addEventListener("touchstart",_product.productClose,false); 
         }


        for(var i=0;i<rightProduct.length;i++)
        {
          (function()
            {
              var p=i;
              rightProduct[i].addEventListener("touchstart",function(e){e.stopPropagation();_product.productNext(p,1);},false);
              rightProduct[i].addEventListener("touchend",function(e){e.stopPropagation();},false); 
            })();


        }

        for(var i=0;i<leftProduct.length;i++)
        {
          (function()
            {
              var p=i;
              leftProduct[i].addEventListener("touchstart",function(e){e.stopPropagation();_product.productNext(p,-1);},false); 
              leftProduct[i].addEventListener("touchend",function(e){e.stopPropagation();},false); 
            })();


        }


        openEgg.addEventListener("touchstart",function(){fn.eggClose();fn.eggOpen(1);},false); 
        egg5.addEventListener("touchstart",function(){fn.eggOpen(3);},false); 


        for(var i=0;i<eggArr.length;i++)
        {
          //eggArr[i].addEventListener("touchstart",function(e){e.stopPropagation();},false); 
          eggArr[i].addEventListener("touchend",function(e){fn.eggOpen(0);},false); 


        }


         for(var j=0;j<closeEggArr.length;j++)
        {
          closeEggArr[j].addEventListener("touchstart",fn.eggClose,false); 
         }


        
        
      }

      //_product

      _product.productNext=function(num,type)
      {
        var product_pop=document.getElementsByClassName("product_hide")[num].getElementsByTagName("li");
        num++;
        product_pop[pType-1].className="product"+num+"_"+pType;
        pType=pType+type;
        if(pType==product_pop.length+1)pType=1;
        else if(pType==0)pType=product_pop.length;
        var product=document.getElementsByClassName("product"+num+"_"+pType);
        product[0].className="product"+num+"_"+pType+" on";
      }

      _product.productArr=function(num)
      {
          if(openArr)
          {
            productArr[num].className="productArr on";
            num++;
            var product_pop=document.getElementById("product_pop_"+num);
            product_pop.className="on";
            popBg.className="on";
          }
        
          
      }

      _product.productOpen=function(num)
      {
        product_border[num].className="product_border on";
        product_border[num].getElementsByTagName("li")[0].className="product"+(num+1)+"_1 on";
        num++;
        var product_pop=document.getElementById("product_pop_"+num);
        product_pop.className="";

     }

      _product.productClose=function()
      {
        for(var j=0;j<productArr.length;j++)
        {
          productArr[j].className="productArr";

         }


         for(var j=0;j<product_border.length;j++)
        {
          product_border[j].className="product_border";

         }
         
        popBg.className="";
      }


      //fn

      fn.eggOpen=function(num)
      {
        if(openArr)
        {
          popArr[num].className="pop on";
          popBg.className="on";
        }
      }


      fn.eggClose=function()
      {
        for(var j=0;j<popArr.length;j++)
        {
          popArr[j].className="pop";

         }
        popBg.className="";
      }

      


      _fn.init();
      return fn; 


  })();

  sapp.event.on("PAGE_RESIZE", function(e){
      $("html").css("font-size", e.ratio*15+"px");
  })
    // $(function(){
    //     // 设置根字体大小
    //     var win = $(window);
    //     setRootFontSize = function(){
    //         var ww = win.width();
    //         var root;

    //         if(ww<480)  root=ww*(10/480);
    //         else if(480<=ww)            root=10;

    //         $("html").css("font-size", root+"px");
    //     }
    //     win.resize(setRootFontSize).load(setRootFontSize).resize();
    // });

// 点击分享  加入5.1了
function goShare(){
  var ua = navigator.userAgent.toLocaleLowerCase();

  //展开微信分享提示
  function show_weixin() {
    $('.pop-share-wx').show();
  }

  //展开普通分享
  function show_share() {
    $('#sharePop').toggleClass('hide');
  }

  if (fromApp == "1") { // 为 1 or 'app'??
    if (ua.indexOf("micromessenger") >= 0) {
      show_weixin();
    } else if (ua.indexOf("weibo") >= 0 || ua.indexOf("ipad") >= 0) {
      show_share();
    } else {
      if (parseFloat(appVer) >= 5.1) {
        window.location.href = "vipshop://shareActivity?shareId=85&activityId=10258"; //分享id待定 ??
      } else {
        window.location = "vipshop://shareActivity?activityId=10258";
      }
    }
  } else {
    if (ua.indexOf("micromessenger") >= 0) {
      show_weixin();
    } else {
      show_share();
    }
  }
}

VIP.Share.wap({
      auto: true,
      title: '618限量品牌红包开枪啦！！莫愁钱路无知己，品牌红包最懂你！购物立减，马上领取！',
      pic: IMAGE_BASE_URL + '/weixin_share_02.jpg',
      url: location.href,
      custom: '&summary=' + encodeURIComponent('莫愁钱路无知己，品牌红包最懂你！购物立减，马上领取！')
    });
