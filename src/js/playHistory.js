import {id$,class$,query$,getIdList,isCheck,handleRecomMusicList} from '../public/public.js'
import playHistoryArt from '../view/playHistory.art'
import { recomDetail } from './find'
function playHistory(){
    var idList= []
    var tracks= []
    var list= JSON.parse(localStorage.getItem('songList')) || []
    var collectionArr= JSON.parse(localStorage.getItem('collection')) || []
    handleRecomMusicList(list,tracks,collectionArr)
    console.log(tracks)
    getIdList(list,idList) //获取idList
    query$('section').innerHTML= playHistoryArt({list,tracks})
    recomDetail(idList)
    var checked= query$('.history-recomDetail .musicMid span','all')[1]
    var mask= query$('.mask.clear-history')
    if(checked){
        checked.onclick= function(e){
            var history= query$('.history-recomDetail')
            mask.style.display= "block"
            isCheck(function(flag){
                if(!flag) return
                // 删除缓存中的所有音乐
                localStorage.setItem('songList',"[]")
                history.innerHTML= `<div class="find-nav">
                                    <p>发现音乐</p>
                                    <ul class="openul">
                                        <li class="active">歌曲                              
                                        </li>
                                    
                                    </ul>
                                </div>
                                <div class="noMusic">暂无播放记录</div>`
                         query$('.list-pop .list ul').innerHTML= ''
                         query$('#listNum').innerHTML= 0
            })
        }
    }
    
}

export {
    playHistory
}