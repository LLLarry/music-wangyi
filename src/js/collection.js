import { getSongDetailInfo } from '../public/require.js'
import { handleCollectionData,creatTime,getIdList, query$ } from '../public/public.js'
import { renderRecom } from './find.js'
function collection(){
    let recomList= []
    let idList= []
    let tracks= JSON.parse(localStorage.getItem('collection')) || []
    let createTime= localStorage.getItem('createTime')
  
    if(!createTime){
        createTime= creatTime(new Date)
        localStorage.setItem('createTime',createTime)
    }
    if(tracks.length > 0){
        var P37= getSongDetailInfo(tracks[0].id)
        P37.then((res)=>{
            handleCollectionData(res.songs[0],recomList,createTime,tracks)
            getIdList(tracks,idList)
            console.log(idList)
            renderRecom(tracks,recomList,999,idList)
        })


    }else {
        query$('section').innerHTML= '<div class="noMusic" >赶快去收藏你喜欢的音乐<div>'
        
    }
}
export {
    collection
}