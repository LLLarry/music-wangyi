import {id$,class$, query$,hangdleMusciTopList,handleRecomMusicList,imgLoading} from '../public/public.js'
import { getMusicTopList } from '../public/require.js'
import musicTopArt from '../view/musicTop.art'
import { renderRecom } from './find.js'
function musicTop(){
    var newMusci= []
    var hotMusic= []
    var firMusic= []
    var upMusic= []
    var P38= getMusicTopList(0) //新歌
    var P39= getMusicTopList(1) //热歌
    var P40= getMusicTopList(2) //原创
    var P41= getMusicTopList(3) //飙升
    P38.then((res)=>{
        hangdleMusciTopList(res,newMusci)
        // console.log(newMusci)
        return P39
    },(err)=>{})
    .then((res)=>{
        hangdleMusciTopList(res,hotMusic)
        return P40
    },(err)=>{})
    .then((res)=>{
        hangdleMusciTopList(res,firMusic)
        return P41
    },(err)=>{})
    .then((res)=>{
        hangdleMusciTopList(res,upMusic)
        window.musicTopDetail= {newMusci,hotMusic,firMusic,upMusic}
        // console.log(JSON.stringify({newMusci,hotMusic,firMusic,upMusic}))
        localStorage.setItem('musicTopDetail',JSON.stringify({newMusci,hotMusic,firMusic,upMusic}))
        musicTopRender(newMusci,hotMusic,firMusic,upMusic)   
    },(err)=>{})
   
}

function musicTopRender(newMusci,hotMusic,firMusic,upMusic){  
    var id= 0
    var section= query$('section')
    section.innerHTML= musicTopArt({newMusci,hotMusic,firMusic,upMusic})
    imgLoading()
    var divList= query$('.content .divs>div','all')
    divList= Array.prototype.slice.call(divList)
    divList.forEach(item =>{
        item.onclick= function(){
            if(item.dataset.idx == 0){
                // recomList= newMusci
                id= 0
            }
            else if(item.dataset.idx == 1){
                // recomList= hotMusic
                id= 1
            }
            else if(item.dataset.idx == 2){
                // recomList= firMusic
                id= 2
            }
            else if(item.dataset.idx == 3){
                // recomList= upMusic
                id= 3
            }
            window.location.hash=  'musicTop/musicTopDetail?idx='+ id
        }     
    })
}

function musicTopDetailRender(id){
    var recomList= []
    var tracks= []
    // var  musicTopDetail= JSON.parse(localStorage.getItem('musicTopDetail')) || [] //获取收藏缓存
    switch(parseInt(id)){
        case 0 : recomList= musicTopDetail.newMusci ; break;
        case 1 : recomList= musicTopDetail.hotMusic ; break;
        case 2 : recomList= musicTopDetail.firMusic ; break;
        case 3 : recomList= musicTopDetail.upMusic ; break;
    }
    var idList= recomList.trackIds
    let arr= JSON.parse(localStorage.getItem('collection')) || [] //获取收藏缓存
    handleRecomMusicList(recomList.tracks,tracks,arr)
    renderRecom(tracks,recomList,id,idList,true)
}

export {
    musicTop,
    musicTopDetailRender
}