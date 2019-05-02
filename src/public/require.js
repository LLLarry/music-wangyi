import {ProAjax} from '../public/public.js'
var baseUrl= '//39.97.98.149:3000'
function commentsReq(id,offset,limit,url){ //請求歌曲評論
    return ProAjax({
            url: url,
            params: {id,offset,limit}
        })
}
function searchReq(keywords,offset,limit,type){
    return ProAjax({
        url: baseUrl + '/search',
        params: {keywords,offset,limit,type}
    })
}
function Searchmultimatch(keywords){ //搜索多重匹配
    return ProAjax({
        url: baseUrl + '/search/multimatch',
        params: {keywords}
    })
}
function searchSingerById(id){ 
    return ProAjax({
        url: baseUrl + '/artists',
        params: {id}
    })
}
function searchCdBySingerId(id){ //搜索专辑通过歌手id
    return ProAjax({
        url: baseUrl + '/artist/album',
        params: {id}
    })
}
function searchMvBySingerId(id){
    return ProAjax({
        url: baseUrl + '/artist/mv',
        params: {id}
    })
}
function getSongerDescribe(id){ //获取歌手描述
    return ProAjax({
        url: baseUrl + '/artist/desc',
        params: {id}
    })
}
function getCdList(id){ //获取歌手描述
    return ProAjax({
        url: baseUrl + '/album',
        params: {id}
    })
}
function getHotSinger(offset,limit){ //发送热门歌手请求
    return ProAjax({
        url: baseUrl + '/top/artists',
        params: {offset,limit}
    })
}
function getSongerList(cat,initial,offset,limit){ //获取歌手分类列表
    return ProAjax({
        url: baseUrl + '/artist/list',
        params: {cat,initial,offset,limit}
    })
}
function getMvUrl(id){ //获取mv地址
    return ProAjax({
        url: baseUrl + '/mv/url',
        params: {id}
    })
}
function getSimiMv(mvid){ //获取相似mv
    return ProAjax({
        url: baseUrl + '/simi/mv',
        params: {mvid}
    })
}
function getMvComment(id){ //获取mv评论
    return ProAjax({
        url: baseUrl + '/comment/mv',
        params: {id}
    })
}
function getMvDetail(mvid){ //获取mv详细信息
    return ProAjax({
        url: baseUrl + '/mv/detail',
        params: {mvid}
    })
}
function getMvNew(limit){ //获取最新mv
    return ProAjax({
        url: baseUrl + '/mv/first',
        params: {limit}
    })
}
function getMvPersonalized(){ //获取推荐mv
    return ProAjax({
        url: baseUrl + '/personalized/mv'
    })
}
function getSongDetailInfo(ids){
    return ProAjax({
        url: baseUrl + '/song/detail',
        params: {ids}
    })
}

function getMusicTopList(idx){
    return ProAjax({
        url: baseUrl + '/top/list',
        params: {idx}
    })
}
export {
    commentsReq,
    searchReq,
    Searchmultimatch,
    searchSingerById,
    searchCdBySingerId,
    searchMvBySingerId,
    getSongerDescribe,
    getCdList,
    getHotSinger,
    getSongerList,
    getMvUrl,
    getSimiMv,
    getMvComment,
    getMvDetail,
    getMvNew,
    getMvPersonalized,
    getSongDetailInfo,
    getMusicTopList
}
