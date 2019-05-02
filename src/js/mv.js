import {   getMvNew,
    getMvPersonalized
} from '../public/require'
import {
    handleNewMv,
    handlePreMv,
    id$,
	class$,
    query$,
    imgLoading } from '../public/public'
import mvArt from '../view/mv.art'
import {mvPlay} from './mvPlay'

function mv(){
    var mvNewContent= []
    var mvPerContent= []
    // 发送ajax请求
    var P35= getMvNew(10)
    var P36= getMvPersonalized()
    P35.then((res)=>{
        // console.log('zx',res)
        // if(res.code === 200) return
        handleNewMv(res.data,mvNewContent)
        console.log(mvNewContent)
        return P36
    },(err)=>{})
    .then((res)=>{
        // console.log(res)
        // if(res.code != 200) return
        handlePreMv(res.result,mvPerContent)
        console.log(mvPerContent)
        var mvHtml= mvArt({mvNewContent,mvPerContent})
        query$('section').innerHTML= mvHtml
        imgLoading()
        mvHan()
    },(err)=>{})

}

function mvHan(){ //处理mv界面业务逻辑
    var mvSelect= query$('section .mv-select')
    var list= query$('.mv-video li', 'all')
    for(let i= 0; i< list.length ; i++){
        list[i].onclick= function(){
            var id= this.getAttribute('data-id')
            mvPlay(id)
        }
    }
}
export {
    mv
}