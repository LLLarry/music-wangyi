import {id$,class$,query$,ajax,ProAjax,filters,creatTime,timeFilter,imgLoading,handleRecomMusicList,playAllMusic,getIdList} from '../public/public.js'
import {musicPlay} from './musicPlay.js'
import findArt from '../view/find.art'
import recomArt from '../view/recommendDeatil.art'
import personRecomArt from '../view/personRecom.art'
import recommonedDetailSongListArt from '../view/recommonedDetailSongList.art'
import {singPage} from './singPage.js'
import { mvPlay } from './mvPlay.js'
// import { musicTop } from './musicTop.js'
var bannerList= [] //轮播图
var musicList= [] //推荐歌单
var Sole= [] //独家放送
var newSong= [] //最新音乐
var recommendMv= [] //推荐mv
var anchorStation= [] //主播电台


var index= 3
var ind
var timer= null

function find(pathn){
    //点击发现音乐就要发送请求
    //获取轮播图
    // window.location.hash= 'find'
    // window.location.pathname= 'find'
    var P0= ProAjax({
        url: '//39.97.98.149:3000/banner'
    })
    // 首先发送 推荐歌单 ，
    var P1= ProAjax({
        url: '//39.97.98.149:3000/personalized'
    })
    // 独家放送

    var P2= ProAjax({
        url: '//39.97.98.149:3000/personalized/privatecontent'
    })
     // 最新音乐

    var P3= ProAjax({
        url: '//39.97.98.149:3000/personalized/newsong'
    })
      // 推荐mv

    var P4= ProAjax({
        url: '//39.97.98.149:3000/personalized/mv'
    })
     // 主播电台
     var P5= ProAjax({
        url: '//39.97.98.149:3000/personalized/djprogram'
    })

    P0.then(function(res){
        // console.log(res)
        bannerList= res.banners
        return P1
    },function(err){})
    P1.then(function(res){
        // console.log(res)
        musicList= res.result.slice(0,12)
       for(var i=0; i< musicList.length; i++){
        musicList[i].playCount= filters(musicList[i].playCount)
       }
        return P2
    },function(err){})
    .then(function(res){
        // console.log(res)
        Sole=res.result
        return P3
    },function(err){})
    .then(function(res){
        // console.log(res)
        newSong= res.result
        return P4
    },function(err){})
    .then(function(res){
        // console.log(res)
        recommendMv= res.result
        return P5
    },function(err){})
    .then(function(res){
        // console.log(res)
        anchorStation= res.result
        //走到这一步的时候，说明前面几个数据已经获取好了，所以，我们需要在这里将页面渲染
        // console.log(bannerList)
        renderFind()
        //渲染页面之后轮播图要开始转动
        bannerFun()
        //渲然之后给推荐歌单绑定时间
        clickRecom()
        clickMusicTop() //处理 点击音乐排行榜
        clickReMV() //点击推荐mv
    },function(err){})

function renderFind(){  //渲染页面的函数
//     var findHtml= findArt({musicList,Sole,newSong,recommendMv,anchorStation,bannerList})
//    query$('section').innerHTML= findHtml
   var findHtml= findArt()
   query$('section').innerHTML= findHtml
   var personRecomHtml= personRecomArt({musicList,Sole,newSong,recommendMv,anchorStation,bannerList})
   query$('.find .main').innerHTML= personRecomHtml
   imgLoading()
//    点击切换个性推荐个歌手
   var listObj= query$('.find-nav .openul li','all') //获取导航li
   listObj[0].onclick= function(){
        listObj[1].classList.remove('active')
        this.classList.add('active')
        find()
   }
   listObj[1].onclick= function(){
        listObj[0].classList.remove('active')
        this.classList.add('active')
        singPage()
    }
   
}

function bannerFun(){ //轮播图函数
    var arr= []
    var aList= document.querySelectorAll('.buttons a')
    var list= document.querySelectorAll('.Cooldog_content li')
    var buttons= document.querySelector('.buttons')
    var CooldogContainer= document.querySelector('.Cooldog_container')
    for(var i=0; i<aList.length; i++){
        aList[i].style.width= 180/aList.length + 'px'
    }
    for(var i=0; i< list.length; i++){
        arr.push([getAttr(list[i],'transform'),getAttr(list[i],'opacity'),getAttr(list[i],'zIndex')])
    }
    setTime(arr,aList,list)
    buttons.onmouseover= function(e){
        clearInterval(timer)
        e= e || window.event
        var target= e.target
        if(target.nodeName.toLowerCase() === 'a'){
            ind= parseInt(target.dataset.index)
            if(ind - index == 1){
                var t= arr.pop()
                arr.unshift(t)
                index= arr.findIndex((item,i)=>{ //找到index的值
                    return item[2] === '4'
                })
                dot(aList,index)
               
            }else if(ind - index == -1){
                var t= arr.shift()
                arr.push(t)
                index= arr.findIndex((item,i)=>{ //找到index的值
                    return item[2] === '4'
                })
                dot(aList,index)
                
            }else{
                while(index !== ind){
                    var t= arr.shift()
                    arr.push(t)
                    index= arr.findIndex((item,i)=>{ //找到index的值
                        return item[2] === '4'
                    })
                }
                dot(aList,index)
            }
            for(var j=0; j< list.length; j++){
                list[j].style.transform= arr[j][0]
                list[j].style.opacity= arr[j][1]
                list[j].style.zIndex= arr[j][2]
            }
        }
    }
    buttons.onmouseleave= function(){
        setTime(arr,aList,list)
    }
}



function setTime(arr,aList,list){
    clearInterval(timer)
    timer= setInterval(function(){
        var t= arr.pop()
        arr.unshift(t)
        index= arr.findIndex((item,i)=>{ //找到index的值
            return item[2] === '4'
        })
        dot(aList,index)
        for(var j=0; j< list.length; j++){
            list[j].style.transform= arr[j][0]
            list[j].style.opacity= arr[j][1]
            list[j].style.zIndex= arr[j][2]
        }
    },5000)
}



function dot(aList,index){
    for(var i=0; i< aList.length; i++){
        aList[i].classList.remove('color')
    }
    aList[index].classList.add('color')
}


function getAttr(obj,attr){ //获取元素的css内部的属性值
    if(obj.currentStyle){
        return obj.currentStyle[attr]
    }else{
        return getComputedStyle(obj,false)[attr]
    }
}
//点击推荐歌单
function clickRecom(){
    var recomObj= query$('.recommend-song > div','all')
    for(var i=0;i< recomObj.length;i++){
        recomObj[i].onclick= null
        recomObj[i].onclick= function(){
            var id= this.getAttribute('data-recommendid')
            // 发送请求
            sendAjaxAndRender(id)
           }
    }
 
}

}
function sendAjaxAndRender(id){
    var recomList= [] //推荐详细列表
    var tracks= []
    ProAjax({
        url: '//39.97.98.149:3000/playlist/detail',
        params: {id}
    }).then(function(res){
        // 在这里筛选有价值的信息
        console.log(res)
        recomList.name= res.playlist.name
        recomList.coverImgUrl= res.playlist.coverImgUrl
        recomList.playCount= filters(res.playlist.playCount)
        recomList.createTime= creatTime(res.playlist.createTime)
        recomList.description= res.playlist.description //介绍
        recomList.subscribedCount=  filters(res.playlist.subscribedCount) //收藏数
        recomList.commentCount= filters(res.playlist.commentCount)   //评论数
        recomList.shareCount=  filters(res.playlist.shareCount) //分享数
        recomList.tags= res.playlist.tags  //标签
        recomList.avatarUrl= res.playlist.creator.avatarUrl //头像地址
        recomList.nickname= res.playlist.creator.nickname //名称
        recomList.tracks= res.playlist.tracks //歌曲
        recomList.trackIds= res.playlist.trackIds //整个列表数组
        // recomList.time=timeFilter()

        for(var i=0; i<res.playlist.tracks.length;i++){
            res.playlist.tracks[i].dt= timeFilter(res.playlist.tracks[i].dt)
            
        }
        let arr= JSON.parse(localStorage.getItem('collection')) || [] //获取收藏缓存
        handleRecomMusicList(recomList.tracks,tracks,arr)
    //     var recomHtml= recomArt({recomList})
    //     var recommonedDetailSongListHtml= recommonedDetailSongListArt({tracks})
    //     query$('section').innerHTML= recomHtml
    //     var musicList= query$('.recomDetail .music-list')
    //     musicList.innerHTML= recommonedDetailSongListHtml
    //     window.location.hash= 'find/recommend?id='+id
    // //    在这里推荐歌单的详情已经渲染好了了
    //     HaSearch(tracks,musicList,recomList.trackIds,recomList.name)
    //     recomDetail(recomList.trackIds,recomList.name)
    var idList= recomList.trackIds
         renderRecom(tracks,recomList,id,idList)
    },function(err){})
}

function renderRecom(tracks,recomList,id,idList,flag) { //渲染推荐页面  flag //是判断是不是排行榜页面进来的
    var recomHtml= recomArt({recomList})
    var recommonedDetailSongListHtml= recommonedDetailSongListArt({tracks})
    query$('section').innerHTML= recomHtml
    var musicList= query$('.recomDetail .music-list')
    musicList.innerHTML= recommonedDetailSongListHtml
    imgLoading
    if(!flag){
        window.location.hash= 'find/recommend?id='+id
    }
    // window.location.hash= flag? 'musicTop/musicTopDetail?idx='+ id : 'find/recommend?id='+id
//    在这里推荐歌单的详情已经渲染好了了
    HaSearch(tracks,musicList,idList,recomList.name)
    recomDetail(idList,recomList.name)
}
function HaSearch(tracks,musicList,idList,from){
     // 在推荐歌单里面进行搜索
     var muiscTotal= query$('.muisc-total')
     var muiscTotalHtml= muiscTotal.innerHTML
     var copyTracks= tracks
     var copyIdList= idList
     var recSearch= query$('.recSearch')
     recSearch.onkeyup= null
     recSearch.onkeyup= function(e){
        var arr= []
         e= e || window.event
         var value= e.target.value.trim()
         if(value.length <= 0){
            tracks= copyTracks
            idList= copyIdList
            var recommonedDetailSongListHtml= recommonedDetailSongListArt({tracks})
            musicList.innerHTML= recommonedDetailSongListHtml
            muiscTotal.innerHTML= muiscTotalHtml
         }else if(e.keyCode === 13) {
            idList= []
            tracks.forEach((item,i) =>{
                if(item.name.match(value) || item.cdName.match(value) || item.arName.match(value)){
                    arr.push(item)
                }
             })
             tracks= arr
             tracks.value= value
             getIdList(tracks,idList)
             var recommonedDetailSongListHtml= recommonedDetailSongListArt({tracks})
             musicList.innerHTML= recommonedDetailSongListHtml
             muiscTotal.innerHTML= ''
         }
         recomDetail(idList,from)
     }
}

function recomDetail(idList,from){
  
    var listObj= query$('.recomDetail .music-list li','all')
    for(var i=0; i< listObj.length;i++){
        listObj[i].addEventListener('mouseover',function(){
            if(!this.isClick){
                this.style.backgroundColor= '#F4F4F6'
            }   
        })
        listObj[i].addEventListener('mouseleave',function(){
            if(!this.isClick){
                this.style.backgroundColor= ''
            } 
        })
        listObj[i].addEventListener('click',function(){
            listObj.forEach((item,i)=> {
                if(listObj[i].isClick){ //找到上次被点击的那个
                    listObj[i].isClick= false  //将上一次的isClick改为false
                    listObj[i].style.backgroundColor= ''  //移除掉背景色
                    listObj[i].querySelector('.music-list-mid').style.display= "none"
                }
            })
            this.style.backgroundColor= '#E8E8EA'
            this.querySelector('.music-list-mid').style.display= "block"
            this.isClick= true
            // 这里 播放图标显示出来了，所以可以绑定点击事件，发送ajax请求
            this.querySelector('.music-list-mid .icon-bofang').addEventListener('click',function(){
                var id= this.getAttribute('data-songid')
                if(from === undefined){
                     from= this.getAttribute('data-from')
                }
                musicPlay(id,idList,from)//参数1 当前需要播放的id , 参数2 当前id所在的id列表, 参数3：来源哪里 

            })
        })
        var allPlay= query$('.allPlay')
        allPlay.onclick= null
        allPlay.onclick= function(){
            // console.log(idList,from)
            playAllMusic(idList,from)
        }  
    }
}

function clickMusicTop(){ //处理点击音乐排行事件
    var musiTopList= query$('section .music-top')
    musiTopList.onclick= null
    musiTopList.onclick= function(){
        window.location.hash= 'musicTop'
    }
}

function clickReMV(){ //处理点击推荐mv
    var divList= query$('.recommend-mv>div', 'all')
    for(var i= 0; i< divList.length; i++){
        divList[i].onclick= null
        divList[i].onclick= function(){
            var id= parseInt(this.dataset.id)
            mvPlay(id)
        }
    }
}

export {
    find,
    sendAjaxAndRender,
    recomDetail,
    renderRecom
}