import { parseUrlHash,parseUrlParmas,query$ } from '../public/public'
import { find } from './find'
import { search,searchKeywords } from './search'
import { sendAjaxAndRender } from './find'
import { getSingerById } from './singPage'
import { searchCd } from './searchDetail'
import { mv } from './mv'
import { playHistory } from './playHistory.js'
import { collection } from './collection.js'
import { musicTop } from './musicTop.js'
import { musicTopDetailRender } from './musicTop.js'
import cdSearchPageArt from '../view/cdSearchPage.art'
function hashChange(){
    window.onhashchange= (function(){
        var preTime= 0
        return function(e){
            var time= new Date()
            if(time - preTime > 300){
                e= e || event
                var url= parseUrlHash(e.newURL).substring(0,parseUrlHash(e.newURL).indexOf('?'))
                if(parseUrlHash(e.newURL) === 'find'){
                    find()
                }else if(parseUrlHash(e.newURL) === 'search'){
                    search()
                }else if(url === 'search/detail'){
                    search()
                    searchKeywords(parseUrlParmas(e.newURL).keywords)
                }else if(url === 'find/recommend'){
                    var id= parseUrlParmas(e.newURL).id
                    sendAjaxAndRender(id)
                }else if(url === 'find/singer'){
                    var id= parseUrlParmas(e.newURL).id
                    getSingerById(id)
                }else if(url === 'search/detail/cd'){
                    var id= parseUrlParmas(e.newURL).id
                    searchCd(id,cdSearchPageArt)
                }else if(parseUrlHash(e.newURL) === 'mv'){
                    mv()
                }else if(parseUrlHash(e.newURL) === 'history') {
                    playHistory()
                }else if(parseUrlHash(e.newURL) === 'collection'){
                    collection()
                }else if(parseUrlHash(e.newURL) === 'musicTop'){
                    musicTop()
                }else if(url === 'musicTop/musicTopDetail'){
                    var id= parseUrlParmas(e.newURL).idx
                    musicTopDetailRender(id)
                }
            }
            preTime= time  
        }
    })()
}
export {
    hashChange
}