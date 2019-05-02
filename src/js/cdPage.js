import { query$ , downloadFile} from '../public/public'
import {fenye} from '../public/commentPage.js' 
function cdPage(url,name,act,total,id,commentPage){
    console.log(act)
    const fenList= query$('.cdPage .comment-paging').getElementsByTagName('li') //获取所有评论的li
    const commentPaging= query$('.cdPage .comment-paging')
    const commenturl= '//39.97.98.149:3000/comment/music'
    const goodComment= query$('.cdPage .goodComment')
    fenye(commentPaging,fenList,total,commenturl,commentPage, goodComment,id) //生成分页页码
    const downloadLi = query$('.download-li')
    const songName= name + '-' + act 
    console.log(downloadLi)
    downloadLi.onclick= function(){
        console.log(999)
        downloadFile(url,songName,'.mp3')
    }
}
export {
    cdPage
}