import {
      query$,
      timeFilter,
      ProAjax,
      parseLyric,
      Handlecomments,
      HandleIncludeThisSong,
      HandleSimilarSong,
      renderList,
      tip,
      handleRecomMusicList,
      random
    } from '../public/public.js'
import {commentsReq} from '../public/require.js' 
import cdPageArt from '../view/cdPage.art'
import commentPage from '../view/commentsPage.art'
import { cdPage } from './cdPage'
function musicPlay(id, idList,from){ //flag是控制是否开机就播放暂停

  // console.log(from)
    // // 获取 audio
    // var audio= query$('#audio')
    // //获取开始时间
    // var startTime= query$('.musicTime span')
    // //获取结束时间
    // var endTime= query$('.musicTime span', 'all')[1]
    // //获取进度条线总元素
    // var progressBar= query$('.progress-bar')
    // //获取实时进度条元素
    // var bar= query$('.bar')
    // //获取进度小圆点
    // var control= query$('.control')
    // 获取上一曲
    // var preSong= query$('.play-icon span','all')[0]
    //获取 开始/暂停 按钮
    // var pauseOrPlay= query$('.play-icon span','all')[1]
     //获取 下一曲 按钮
    //  var nextSong= query$('.play-icon span','all')[2]
    // var controlleft= 0
    // var isPlay= false //正在播放音乐?
    // var url= ''
    // var songDetail= [] //歌曲详细信息
    //这里 ele是传过来的原来，身上有歌曲的id
    // var timer= null
    // var cdPageView= [] //传进cdPage的数据
    // var comments= [] //存放歌曲评论列表的
    // var includeThisSong= [] //包含这首歌的歌单
    // var similarSong= [] //相似歌曲
    // cdPageView.from= from  //接受传过来的歌曲来源
    // var tracks= [] //存放收藏的数组
    // var b= 0
    // var isAutMove= false //判断是不是点击进度条移动了
    // var name, //歌曲名，时间，演唱者,专辑 ,mv
    //     act,
    //     al,
    //     mv
    // var time= '00:00'
    getUrl(id,from,idList)
}
var baseUrl= '//39.97.98.149:3000'
function getUrl(id,from,idList){ //这是封装的请求歌曲url的函数，回调函数返回的是url
  // var id= ele.getAttribute('data-songid') //是歌曲id 重点
  var name //歌曲名，时间，演唱者,专辑 ,mv
  var act
  var  al
  var  mv
  var url= ''
  var similarSong= [] //相似歌曲
  var includeThisSong= [] //包含这首歌的歌单
  var comments= [] //存放歌曲评论列表的
  var cdPageView= [] //传进cdPage的数据
  cdPageView.from= from  //接受传过来的歌曲来源
  cdPageView.lrc= {0:'暂无歌词'}
  var songDetail= [] //歌曲详细信息
  var tracks= [] //存放收藏的数组
  var P8= ProAjax({
      url: baseUrl+'/song/url',  //请求歌曲地址
      params: {id}
    })
  var P9=  ProAjax({
      url: baseUrl+'/song/detail', //请求歌曲详细信息
      params: {ids:id}
   })
  var P10= ProAjax({
    url: 'https://api.imjad.cn/cloudmusic/', //请求歌词
    params: {type:'lyric',id}
  })
  var P11= commentsReq(id,0,10,baseUrl+'/comment/music') //請求第一頁的評論
  var P12= ProAjax({
    url: baseUrl+'/simi/playlist', //包含这首歌的歌单
    params: {id}
  })
  var P13= ProAjax({
    url: baseUrl+'/simi/song', //相似歌曲
    params: {id}
  })

   P8.then(function(res){ 
       url= res.data[0].url  //请求过来的id  
      return P9                      
  },function(err){})
  .then(function(res){
    let arr= JSON.parse(localStorage.getItem('collection')) || [] //获取收藏缓存
    tracks= []
    handleRecomMusicList(res.songs,tracks,arr)
  songDetail.name= res.songs[0].name //歌曲名
  mv= res.songs[0].mv 
  name= res.songs[0].name 
  var ty= res.songs[0].ar
  songDetail.songer= ''
  songDetail.picUrl=res.songs[0].al.picUrl
  ty.forEach((item,i)=>{
      songDetail.songer+= '/'+item.name 
  })
  songDetail.songer= songDetail.songer.substr(1) //歌手名
  cdPageView.songer= songDetail.songer //传进cdPage的数据
  act= songDetail.songer
  cdPageView.name= songDetail.name
  cdPageView.al= res.songs[0].al  //专辑
  al= cdPageView.al
  var b= 0
  return P10
  // return P11
  },function(err){})
  .then(function(res){
    if(res.lrc){
      cdPageView.lrc= parseLyric(res.lrc.lyric) //将歌词传进cdPageView数组中
    }else {
      cdPageView.lrc= {0:'暂无歌词'}
    }
    return P11
  },function(err){})
  .then(function(res){
    Handlecomments(res,comments) //调用歌曲评论处理函数
    return P12
  },function(err){})
  .then((res)=>{
    includeThisSong=[]
    HandleIncludeThisSong(res,includeThisSong)
    return P13
  },(err)=>{})
  .then((res)=>{
    similarSong= []
    HandleSimilarSong(res,similarSong)
    query$('.headimg img').src=songDetail.picUrl
    query$('.musicName').innerHTML= songDetail.name
    query$('.progress .author').innerHTML= '-' + songDetail.songer
    var commentsTotal= {} //这两步是将单个评论总数传进cdPage中
    commentsTotal.total= comments.total
    var cdPageHtml= cdPageArt({cdPageView,includeThisSong,similarSong,commentsTotal,tracks})
    // console.log(commentsTotal)
    query$('.cd-view').innerHTML= cdPageHtml

    var commentPageHtml= commentPage({comments}) //这两部是将评论页面的页面抽出来，单独存放
    query$('.cdPage .goodComment').innerHTML= commentPageHtml
     var musiclist= { id, name, act, al ,mv, from } //将 播放歌曲数据传进去
    playMusic(id,url,musiclist,idList,from) // 调用音乐播放
    playNextOrplayPro(id,from,idList)//这里绑定 上一曲/下一曲的事件
    cdPage(url,name,act,comments.total,id,commentPage)
  },(err)=>{})
}





 //控制音乐播放的部分
function playMusic(id,url,musiclist,idList,from){  
  var time= '00:00'
  var b= 0
      // 获取 audio
  var audio= query$('#audio')
  //获取开始时间
  var startTime= query$('.musicTime span')
  //获取结束时间
  var endTime= query$('.musicTime span', 'all')[1]
  //获取进度条线总元素
  var progressBar= query$('.progress-bar')
  //获取实时进度条元素
  var bar= query$('.bar')
  var isAutMove= false //判断是不是点击进度条移动了
  //获取进度小圆点
  var control= query$('.control')
  //获取 开始/暂停 按钮
  var pauseOrPlay= query$('.play-icon span','all')[1]
  var controlleft= 0
  var isPlay= false //正在播放音乐?
  var timer= null
  var topLeftBg= query$('.top-left-bg') //获取播放图像的动画元素
  var needleImg= query$('.needle-img')
  if(!url){
    tip()
  }
  audio.src= url
  audio.onloadedmetadata = null
  audio.onloadedmetadata = function () { //音频加载后触发
    var songtime= timeFilter(audio.duration, 's') //获取音乐时间
      endTime.innerHTML = "/"+songtime
      time= songtime
      startTime.innerHTML = timeFilter(audio.currentTime,'s')
      // if(!flag){
      //   audio.play()
      // }
      audio.play()
      Mplay()
      isPlay= true
      // 这是将列表信息保存到本地
      // var musiclist= { id, name, act, time, al ,mv, from }
      musiclist.time= time
      var list= JSON.parse(localStorage.getItem('songList')) ||  []
      list= list.filter((item,i) => {
        return item.id != id
      })
      list.unshift(musiclist)
      query$('#listNum').innerHTML= list.length
      localStorage.setItem('songList',JSON.stringify(list))
      var Frag= document.createDocumentFragment()
      var listEle= query$('.list-pop .list ul')
      listEle.innerHTML= ''
      list.forEach((item,i) =>{
        Frag.appendChild(renderList(item,id))
      })
      listEle.appendChild(Frag)
    }
    progressBar.addEventListener('click',null)
    progressBar.addEventListener('click', function (event) {
      let coordStart = this.getBoundingClientRect().left
      let coordEnd = event.pageX
      let p = (coordEnd - coordStart) / this.offsetWidth
      bar.style.width = p.toFixed(3) * 100 + '%'
      control.style.left= p.toFixed(3) * 100 + '%'
      audio.currentTime = p * audio.duration
      audio.play()
      Mplay()
      isPlay= true
    })
    
    control.addEventListener('mousedown',null)
    control.addEventListener('mousedown',function(event){
      var event = event || window.event;
      var leftVal = event.clientX - this.offsetLeft; //左边距离屏幕左边的距离
      var that = this;
      clearInterval(timer)
          document.onmousemove= function(event){
              var event = event || window.event;
              controlleft = event.clientX - leftVal;    
              if(controlleft < 0){
                  controlleft = 0;
              }else if(controlleft > progressBar.offsetWidth - control.offsetWidth) {
                  controlleft = progressBar.offsetWidth - control.offsetWidth
              }
              bar.style.width = controlleft +'px'
              that.style.left = controlleft + "px"
              b= controlleft / (progressBar.offsetWidth - control.offsetWidth)
              isAutMove= true
              // console.log(progressBar.offsetWidth - control.offsetWidth)
              //防止选择内容--当拖动鼠标过快时候，弹起鼠标，bar也会移动，修复bug
              window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
          }
       })
      document.addEventListener('mouseup',null)
      document.addEventListener('mouseup',function(event){
        if(!isAutMove) return
        audio.currentTime = b * audio.duration
        audio.play()
        Mplay()
        document.onmousemove = null
        isAutMove= false
      setTime()
       })
    //这里控制暂停、播放
      pauseOrPlay.onclick= null //在绑定之前先清理下之前的点击事件
      pauseOrPlay.onclick=function(){
      if(isPlay){
          audio.pause()
          Pplay()
          isPlay= false
      }else{
          audio.play() 
          Mplay()
          isPlay= true 
      }
    }
    function Mplay(){ //audio.play()后执行的函数
          pauseOrPlay.childNodes[0].classList.remove('icon-bofang1')
          pauseOrPlay.childNodes[0].classList.add('icon-zantingtingzhi')
          topLeftBg.style.animation= "rotate 30s linear infinite" 
          topLeftBg.style.animationPlayState= 'running'
          needleImg.style.transform= 'rotate(0deg)'
    }
    function Pplay(){ //audio.pause()后执行的函数
          pauseOrPlay.childNodes[0].classList.remove('icon-zantingtingzhi')
          pauseOrPlay.childNodes[0].classList.add('icon-bofang1')
          topLeftBg.style.animationPlayState= 'paused'
          needleImg.style.transform= 'rotate(-26deg)'
    }
    audio.onended= null
    audio.onended= function(){
        //==这里是当歌曲唱完之后自动播放下一曲
      console.log('end')
      var spanList= query$('footer .sound>span','all')[1]
        var category= parseInt(spanList.dataset.category)
        if(category === 1){
          var index= idList.findIndex((item,i)=>{ //获取当前id的索引
            return item.id === parseInt(id)
          })
          index++
          var i= index === idList.length ? 0 : index
          getUrl(idList[i].id,from,idList)
        }else if(category === 2){
          getUrl(parseInt(id),from,idList)
        }else if(category === 3){
          var i= random(0,idList.length)
          getUrl(idList[i].id,from,idList)
        }
    }
    

    setTime()
   function setTime(){
      clearInterval(timer)
      timer= setInterval(() => {
          startTime.innerHTML = timeFilter(audio.currentTime,'s')
          bar.style.width = audio.currentTime / audio.duration.toFixed(3) * 100 + '%'
          control.style.left= audio.currentTime / audio.duration.toFixed(3) * 100 + '%'
        }, 1000)
   }
  //  控制歌词滚动部分开始
   audio.ontimeupdate= null
   audio.ontimeupdate= function(e) {  //监听歌曲播放时间，并滚动歌词
    var time = parseInt(e.target.currentTime);
    var lines = query$('[data-timeline]','all');
    var top = 0;
    var _thisHeight = 0;
    var nextLine = {  //下一行的 索引，时间
        i: 0,
        time: 0
    };
    for( var i=0; i< lines.length; i++){
      var timeline= lines[i].getAttribute('data-timeline') //获取当前li的时间

      nextLine.i = (parseInt(i) + 1) == lines.length ? 0 :  (parseInt(i) + 1); //下一次的索引
       nextLine.time= lines[nextLine.i].getAttribute('data-timeline') //下一次的时间
       
      if(timeline <= time && time < nextLine.time){  //  上一次时间 <= time && time < 下一次时间
        _thisHeight= lines[i].clientHeight;

        // for(var j=0;j<lines.length; j++){  //在每次添加active之前把所有的类样式清除
        //   lines[j].className= ''
        // }
        if(i >= 1){
          lines[i-1].className= ''
        }
       lines[i].className = "active";

       nextLine.i = parseInt(i) + 1; //下一次的索引
       nextLine.time= lines[nextLine.i].getAttribute('data-timeline') //下一次的时间
               if (nextLine.time > 0) {  //判断 下一次还有没有
                    var interval = nextLine.time - timeline;
                    (function(k) {
                        setTimeout(function() {
                            lines[k].className = "";
                        }, interval * 1000);
                    })(i);
                }  // 几秒钟之后当前的 类移除
                query$('.lrc>.lrc-ul').style.marginTop = -(top - _thisHeight) + 'px';
       }else if(timeline < time){
         top += lines[i].clientHeight;
       }
    }
  }
  //  控制歌词滚动部分结束
}




function playNextOrplayPro(id,from,idList){ //点击下一曲，上一曲的按钮控制部分
    var playNextBtn= query$('.play span','all')[2]
    var playpreBtn= query$('.play span','all')[0]
    var spanList= query$('footer .sound>span','all')[1]
    var category= parseInt(spanList.dataset.category)
    // if(category == 1 || category == 2){ //顺序
    //   var index= idList.findIndex((item,i)=>{ //获取当前id的索引
    //     return item.id == parseInt(id)
    //   })
    //   playNextBtn.onclick= null  //调用的时候先把上一次绑定的点击事件清除
    //   playNextBtn.onclick=function(){ 
    //     index++
    //   var i= index === idList.length ? 0 : index
    //     getUrl(idList[i].id,from,idList) //调用 获取url函数，将id传进去
    //   }
    //   playpreBtn.onclick= null  //调用的时候先把上一次绑定的点击事件清除
    //   playpreBtn.onclick=function(){ 
    //     index--
    //  var i= index === -1 ? (idList.length-1) : index
    //     getUrl(idList[i].id,from,idList) //调用 获取url函数，将id传进去
    //   }
      
    // }else if(category == 3){ //随机
    //   playNextBtn.onclick= null  //调用的时候先把上一次绑定的点击事件清除
    //   playNextBtn.onclick=function(){ 
    //     var i= random(0,idList.length)
    //     getUrl(idList[i].id,from,idList) //调用 获取url函数，将id传进去
    //   }
    //   playpreBtn.onclick= null  //调用的时候先把上一次绑定的点击事件清除
    //   playpreBtn.onclick=function(){ 
    //     var i= random(0,idList.length)
    //     getUrl(idList[i].id,from,idList) //调用 获取url函数，将id传进去
    //   }
    // }

    var index= idList.findIndex((item,i)=>{ //获取当前id的索引
      return item.id == parseInt(id)
    })
    playNextBtn.onclick= null  //调用的时候先把上一次绑定的点击事件清除
    playNextBtn.onclick=function(){ 
      if(category == 1 || category == 2){
        index++
        var i= index === idList.length ? 0 : index
        getUrl(idList[i].id,from,idList) //调用 获取url函数，将id传进去
      }else if(category == 3){
        var i= random(0,idList.length)
        getUrl(idList[i].id,from,idList) //调用 获取url函数，将id传进去
      }
    }
    playpreBtn.onclick= null  //调用的时候先把上一次绑定的点击事件清除
    playpreBtn.onclick=function(){ 
      if(category == 1 || category == 2){
        index--
        var i= index === -1 ? (idList.length-1) : index
        getUrl(idList[i].id,from,idList) //调用 获取url函数，将id传进去
      }else if(category == 3){
        var i= random(0,idList.length)
        getUrl(idList[i].id,from,idList) //调用 获取url函数，将id传进去
      }
    }

    
}
export {
    musicPlay 
}