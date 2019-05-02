import {id$,class$,query$,ajax,renderList,getIdList,isDetailLocationStore} from '../public/public.js'
import { hashChange } from './hashChange'
import {search} from './search'
import {find} from './find'
import {mv} from './mv'
import {mvPlay} from './mvPlay.js'
import {musicPlay} from './musicPlay.js'
var pathn= ''
var spanList= query$('.nav-icon li span','all')
var list= []
tagCdPage()
hashChange()
clickListPop() //加载点击列表
renderHistoryList()
soundContol()
clickLogin()
tagPlayMode() //切换播放模式
// firstMusic() //打开播放第一首音乐
for(var i=0; i<spanList.length; i++){
   list.push(spanList[i].parentNode)
}
// find(pathn) //页面一加载先调用find()
window.location.hash= 'find'
find()
for(var i=0; i<list.length; i++){
    list[i].addEventListener('click',function(){
        for(var i=0; i<list.length; i++){
            list[i].classList.remove('active')
        }
        this.classList.add('active')
        // 获取li列表上的data-index
        var index= parseInt(this.getAttribute('data-index'))
        // console.log(window.location)
        // window.location.hash= index
        switch(index){
            case 1: pathn = "/view/search.art"; window.location.hash= 'search'; break;
            case 2: pathn = "/view/find.art";window.location.hash= 'find'; break;
            case 3: pathn = "/view/mv.html";window.location.hash= 'mv'; break;
            // case 4: pathn = "/view/find.html";find(pathn); break;
            // case 5: pathn = "/view/find.html";find(pathn); break;
            // case 6: pathn = "/view/find.html";find(pathn); break;
            case 7: pathn = "/view/find.html";window.location.hash= 'history'; break;
            case 8: pathn = "/view/collection.html";window.location.hash= 'collection'; break;
        }
    })

 }

//  function find(pathn){
//      console.log(555)
//     //  ajax()
//      $('section').load(pathn)
//     // query$('section').loaction= pathn

//  }

 // 给body绑定事件，判断点击mv之后播放mv
 var body= query$('body')
 body.onclick= function(e){
     e= e || window.event
     var target=  e.target
     var regExp = /icon-MV/
     var regExp2= /icon-xihuan/
     var regExp3= /icon-shoucang/ 
     if(target.nodeName.toLowerCase() === 'i' && regExp.test(target.className)){
         // 发送请求并渲染
         var id= target.getAttribute('data-id')
         mvPlay(id)
     }
     if(target.nodeName.toLowerCase() === 'i' && regExp2.test(target.className)){
         console.log(target.classList[1])
        target.classList.remove('icon-xihuan')
        target.classList.add('icon-shoucang')
        let songDetail= JSON.parse(target.dataset.song)
        let id= songDetail.id
        isDetailLocationStore(songDetail,id,true)
     }else if(target.nodeName.toLowerCase() === 'i' && regExp3.test(target.className)){
        target.classList.remove('icon-shoucang')
        target.classList.add('icon-xihuan')
        let songDetail= JSON.parse(target.dataset.song)
        let id= songDetail.id
    
        isDetailLocationStore(songDetail,id,false)
     }
 }
function tagCdPage(){ //cdPage 页面显示和隐藏
    var isHidden= true
    var headimg= query$('footer .headimg')
    var cdView= query$('.cd-view')
    headimg.onclick=function(){
        var topLeftBg= query$('.top-left-bg')
        var needleImg= query$('.needle-img')
        if(cdView.innerHTML.length > 0){
            if(isHidden){
                cdView.style.display= "block" 
                topLeftBg.style.animation= "rotate 30s linear infinite" 
                topLeftBg.style.animationPlayState= 'running'
                needleImg.style.transform= 'rotate(0deg)'
                isHidden= false
            }else {
                cdView.style.display= "none"
                // topLeftBg.style.animation= "none"
                topLeftBg.style.animationPlayState= 'paused'
                needleImg.style.transform= 'rotate(-26deg)'
                isHidden= true 
            }
        }
          
    }
}

function clickListPop(){ //点击列表弹框显示列表
    // var list= JSON.parse(localStorage.getItem('songList')) || []
    var listEle= query$('.list-pop .list ul')
    var list= query$('.list-pop')
    var listNum= query$('#listNum')
    var listSpan= query$('.sound span', 'all')[3]
    var isBlock= false
    listSpan.onclick= function(){
        if(!isBlock){
            list.style.display= "block"
            isBlock= true
        }else {
            list.style.display= "none"
            isBlock= false
        }
    }
    var titleSpan= query$('.list-pop .title span','all')
        titleSpan[1].onclick= function(e){
        // 清除所有的列表
        localStorage.setItem('songList',"[]")
        listEle.innerHTML= ''
        listNum.innerHTML= 0
    }
    titleSpan[2].onclick= function(e){
        list.style.display= "none"
        isBlock= false
    }
}
function renderHistoryList(){
    // 1获取本地列表，2渲染列表，3实现功能
    var num= 0
    var listEle= query$('.list-pop .list ul')
    var list= JSON.parse(localStorage.getItem('songList')) || []
    num= list.length
    if(num === 0 ) return
    var Frag= document.createDocumentFragment()
    // var liObj= document.createElement('li')
    list.forEach((item,i) => {
        Frag.appendChild(renderList(item))
    })
    listEle.appendChild(Frag)
    query$('#listNum').innerHTML= num
    // 绑定点击事件
    listEle.onclick= function(e){
        var listObj= query$('.list-pop .list ul li', 'all')
        e= e || window.event
        var target= e.target
        listObj.forEach((item,i) =>{
            item.classList.remove('active')
           
        })
        if(target.nodeName == 'LI'){
            target.classList.add('active')
        }
        if(target.nodeName == 'SPAN'){
            target= target.parentNode
            target.classList.add('active')
        }
        var id= target.getAttribute('data-id')
        //获取列表
        list= JSON.parse(localStorage.getItem('songList')) || []
        var arr= []
        getIdList(list,arr)
        console.log(arr)
        musicPlay(id,arr,'播放列表')
    }
}

function soundContol(){
    var timer= null
    var audio= query$('#audio')
    var isBlock= false
    var soundSpan= query$('.sound>span','all')
    var soundLine= query$('footer .sound-line')
    var musicVol= query$('footer .sound-line .tt')
    var musicVolLine= query$('footer .sound-line .line')
    var upLine= query$('footer .sound-line .line .up-line') 
    var dotSpan=  query$('footer .sound-line .line .up-line > span')
    var volLeft= 0
    var musicVolLineWidth= 0

    function setTime(){
        clearTimeout(timer)
        timer= setTimeout(function(){
            soundLine.style.display= "none" 
            isBlock= false
        },4000)
    }
    soundSpan[2].onclick= function(e){
        if(isBlock){
            soundLine.style.animation= "no .5s"
            soundLine.style.display= "none"
            isBlock= false
        }else{
            soundLine.style.animation= "bl .5s"
            soundLine.style.display= "flex"
            isBlock= true
            setTime()
        }
        
    }
    musicVol.onclick= function(e){
        e= e || window.event
        volLeft= musicVolLine.getBoundingClientRect().left
        musicVolLineWidth= musicVolLine.offsetWidth
        var ratio= (e.clientX- volLeft) / musicVolLineWidth
        upLine.style.width= ratio * 100 + '%'
        audio.volume=  ratio
        setTime()
    }
    dotSpan.onmousedown= function(e){
        e= e || window.event
        clearTimeout(timer)
        volLeft= musicVolLine.getBoundingClientRect().left
        musicVolLineWidth= musicVolLine.offsetWidth
        document.onmousemove= null
        document.onmousemove= function(e){
            e= e || window.event
            var moveLong= e.clientX- volLeft
            if(moveLong < 0){
                moveLong= 0
            }else if(moveLong > musicVolLineWidth){
                moveLong = musicVolLineWidth
            }
            var ratio= moveLong / musicVolLineWidth
            // console.log(moveLong,musicVolLineWidth,ratio)
            upLine.style.width= ratio * 100 + '%'
            audio.volume=  ratio
            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
        }
    }
    document.onmouseup= function(e){
        document.onmousemove= null
        setTime()
    }
}

function clickLogin(){
    var isBlock= false
    var musicLogin=  query$('.music-login')
    var close= query$('.login1 .close')
    var login1= query$('.login1')
    var iphone= query$('.login1 .top .iphone')
    var reg= query$('.login1 .register')
    var top= query$('.login1 .top')
    var top1= query$('.login1 .top1')
    var top2= query$('.login1 .top2')
    var retu= query$('.login1 .return','all')
    var mask= query$('.mask-bg')
    musicLogin.onclick= null
    musicLogin.onclick= function(){
        if(isBlock){
            login1.style.display= "none"
            mask.style.display= "none"
            isBlock= false
        }else {
            login1.style.display= "block"
            mask.style.display= "block"
            isBlock= true
        }  
    }

    close.onclick= null
    close.onclick= function(){
        login1.style.display= "none"
        mask.style.display= "none"
        isBlock= false
    }

    iphone.onclick= null
    iphone.onclick= function(){
        top.style.display= "none"
        top2.style.display= "none"
        top1.style.display= "flex"
    }
    var fn1= function(){
        top.style.display= "flex"
        top1.style.display= "none"
        top2.style.display= "none"
    }

    retu[0].onclick= null
    retu[1].onclick= null
    retu[0].onclick= fn1
    retu[1].onclick= fn1
   
    reg.onclick= null
    reg.onclick= function(){
        top.style.display= "none"
        top1.style.display= "none"
        top2.style.display= "flex"
    }
}

function tagPlayMode(){
    var spanList= query$('footer .sound>span','all')[1]
    var iList= query$('footer .playMode i')
    var tipTag= query$('.tip-tag')
    var tipTagP= query$('.tip-tag p')
    var timer= null
    spanList.onclick= null
    spanList.onclick= function(){
        clearTimeout(timer)
        var category= parseInt(this.dataset.category)
        if(category === 1){ //顺序模式
            tipTagP.innerHTML= '单曲循环'
            iList.classList.remove('icon-shunxu')
            iList.classList.add('icon-danquxunhuan')
            this.setAttribute('data-category','2')
        }else if(category === 2){ // 单曲循环
            tipTagP.innerHTML= '随机播放'
            iList.classList.remove('icon-danquxunhuan')
            iList.classList.add('icon-suijibofang')
            this.setAttribute('data-category','3')
        }else if(category === 3){ //随机播放
            tipTagP.innerHTML= '顺序播放'
            iList.classList.remove('icon-suijibofang')
            iList.classList.add('icon-shunxu')
            this.setAttribute('data-category','1')
        }
        tipTag.style.display="flex"
        timer= setTimeout(()=>{
            tipTag.style.display="none"
        },1000)
    }
}

// function firstMusic(){
//     var idList= JSON.parse(localStorage.getItem('songList')) || []
//     if(idList.length <= 0){
//         idList= [{id: 25906124},{id: 569213220}]
//     }
//     musicPlay(idList[0].id, idList,'播放列表')
// }

// function LoadingLine(){
//     var load= document.querySelector('.load')
//     var img= document.getElementsByTagName('img')
//     img= Array.prototype.slice.call(img)
//     console.log(img)
//     for(var i= 0; i< img.length; i++){
//         (function(i){
//             var imgO= new Image()
//             imgO.onload= function(){
//                 imgO.onload= null
//                 i++  
//                 load.style.width= Math.round( i / img.length) * 100 *2 +'px'
//                 if( i === img.length ){
//                     // load.style.display= "none"
//                 }
//             }
//        imgO.src= img[i].src  //这样做的目的： 1,写在onload的后面是为了，先绑定事件在添加src属性，加载图片，避免图片先 加载好了，onload还没执行
//                             //2,为什么要重新定义一个imgO,折也是为了避免在html中图片已经加载完了，后面的onload还没有绑定，从而导致进度条不执行或者直接跳过去
//         })(i)
//     }
// }