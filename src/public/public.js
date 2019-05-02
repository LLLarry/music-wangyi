
import { musicPlay } from '../js/musicPlay'
function id$(id){
	return document.getElementById(id)
}
 function class$(tt){
 	return document.getElementsByClassName(tt)
 }
 function query$(selector,sum) {
 	if(sum == undefined){
 		return document.querySelector(selector)
 	}
 		return document.querySelectorAll(selector)
 }
 function tagName$(dom,par){
	 if(arguments.length == 2){
		return par.getElementsByTagName(dom)
	 }else{
		return document.getElementsByTagName(dom)
	 }	 
 }

 function ajax(obj){
		obj= obj || {}
		var method= obj.method || 'get'
		var url= obj.url || ''
		var params= obj.params || ''
		var asyn= obj.asyn || true
		var success= obj.success || function(){}
	 var tt= ''
	 var xhr= null
	 if(window.XMLHttpRequest){
		 xhr= new XMLHttpRequest()	 
	 }else {
		 xhr= new ActiveXObject('Microsoft.XMLHttp')
	 }
	 if(params){
		for(var key in params){
			tt += '&' + key + '=' +params[key]
		}
		tt= tt.substr(1)
	}
	 if(method == 'post'){  //post请求
		xhr.setRequ
		xhr.open('post',url,asyn)
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8')
		xhr.send(tt)
	 }else{  //get请求
		xhr.open('get',url+'?'+tt,asyn)
		xhr.send(null)
	 }
	 xhr.onreadystatechange = function () {
		if (xhr.readyState == 4 && xhr.status == 200) {
			　　　　　　success(JSON.parse(xhr.responseText));
		}
	 }
 }

 
 function ProAjax(obj){
	return new Promise(function(resolve,reject){
			obj= obj || {}
			var method= obj.method || 'get'
			var url= obj.url || ''
			var params= obj.params || ''
			var asyn= obj.asyn || true
			// var success= obj.success || function(){}
		 var tt= ''
		 var xhr= null
		 if(window.XMLHttpRequest){
			 xhr= new XMLHttpRequest()	 
		 }else {
			 xhr= new ActiveXObject('Microsoft.XMLHttp')
		 }
		 if(params){
			for(var key in params){
				tt += '&' + key + '=' +params[key]
			}
			tt= tt.substr(1)
		}
		 if(method == 'post'){  //post请求
			xhr.setRequ
			xhr.open('post',url,asyn)
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8')
			xhr.send(tt)
		 }else{  //get请求
			xhr.open('get',url+'?'+tt,asyn)
			xhr.send(null)
		 }
		 xhr.onreadystatechange = function () {
			if (xhr.readyState == 4 && xhr.status == 200) {
				resolve(JSON.parse(xhr.responseText));
			}
			// else{
			// 	console.log('fffff')
			// 	reject('获取失败')
			// }
		 }
		
	})
 }

 function filters(num){ //过滤器
	num= parseInt(num)
	if(num > 100000){
		return parseInt(num / 10000)+'万'
	}else {
		return num
	}
}
function creatTime(time,argum){ //时间过滤器
	var dt= new Date(time)
	var Y= 	dt.getFullYear()
	var M=	(dt.getMonth()+1)
	var D=	dt.getDate()
	M= M>=10? M : ('0'+M)
	D= D>=10? D : ('0'+D)
if(arguments.length == 1){
	return `${Y}-${M}-${D}`
}else {
	var h= dt.getHours() 
	var mi= dt.getMinutes()
	var s= dt.getSeconds()
	h= h>=10? h : ('0'+h)
	mi= mi>10? mi : ('0'+mi)
	s= s>=10? s : ('0'+s)
	return `${Y}-${M}-${D} ${h}:${mi}:${s}`
}




}

function timeFilter(time,argu){
	if(arguments.length === 2){
		Math.round(parseInt(time))
	}else{
	time= Math.round(parseInt(time/1000))
	}
	var t= parseInt(time/60)
	var h= Math.round(time % 60)
	
	if(t < 10){
		t= '0'+t
	}
	if(h < 10){
		h= '0'+ h
	}
	return `${t}:${h}`
}

function parseLyric(lrc) { //解析歌词
    var lyrics = lrc.split("\n");
    var lrcObj = {};
    for(var i=0;i<lyrics.length;i++){
        var lyric = decodeURIComponent(lyrics[i]);
        var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
        var timeRegExpArr = lyric.match(timeReg);
        if(!timeRegExpArr)continue;
        var clause = lyric.replace(timeReg,'');
        for(var k = 0,h = timeRegExpArr.length;k < h;k++) {
            var t = timeRegExpArr[k];
            var min = Number(String(t.match(/\[\d*/i)).slice(1)),
                sec = Number(String(t.match(/\:\d*/i)).slice(1));
            var time = min * 60 + sec;
            lrcObj[time] = clause;
        }
    }
    return lrcObj;
	}

	function Handlecomments(res,comments){ //歌曲评论数据的处理
		comments.hotComments= []
		comments.comments=[]
		comments.total= res.total
		// comments.comments= res.comments
		if(res.comments.length > 0){
			for(var i=0;i<res.comments.length;i++){
				var obj2= { 
					commentId: res.comments[i].commentId,//评论id
					content: res.comments[i].content,//评论内容
					time: creatTime(res.comments[i].time), //创建时间
					avatarUrl: res.comments[i].user.avatarUrl,  //头像地址
					nickname: res.comments[i].user.nickname, //名称
					userId: res.comments[i].user.userId, //评论者id
					beReplied: res.comments[i].beReplied, //回复。。
					userId: res.comments[i].user.userId, //回复。。
					likedCount: res.comments[i].likedCount
				}
				comments.comments.push(obj2)
			}
		}
		if(res.hotComments){ //这里判断是否有热评，有的话就提取出来
			var length= res.hotComments.length > 10? 10: res.hotComments.length
			for(var i=0;i<length;i++){
				var obj= { 
					content: res.hotComments[i].content,//评论
					likedCount: res.hotComments[i].likedCount,//喜欢数量
					time: creatTime(res.hotComments[i].time), //创建时间
					avatarUrl: res.hotComments[i].user.avatarUrl,  //头像地址
					nickname: res.hotComments[i].user.nickname, //名称
					userId: res.hotComments[i].user.userId, //评论者id
					beReplied: res.hotComments[i].beReplied //回复。。
				}
				comments.hotComments.push(obj)
			}
		}
	}
	function HandleIncludeThisSong(res,includeThisSong){ //处理是否包含此歌的歌单
		if(res.playlists.length > 0){
			for(var i=0; i< res.playlists.length;i++){
				var obj= {}
				obj.id= res.playlists[i].id
				obj.name= res.playlists[i].name
				obj.coverImgUrl= res.playlists[i].coverImgUrl
				obj.playCount= filters(res.playlists[i].playCount)
				includeThisSong.push(obj)
			}
		}
	}
	function HandleSimilarSong(res,similarSong){ //处理相似歌曲 
		
		if(res.songs.length > 0){
			for(var i=0; i< res.songs.length;i++){
				var obj= {}
				obj.artists= []
				obj.name= res.songs[i].name
				obj.mvid= res.songs[i].mvid
				obj.id= res.songs[i].id
				for(var j=0;j<res.songs[i].artists.length; j++){
					obj.artists.push(res.songs[i].artists[j].name)
				}
				obj.artists= obj.artists.join('/')
				similarSong.push(obj)	
			}
		}
	}
	function HandleSearch(res,searchResult){
		searchResult.songCount= res.songCount //搜索歌曲数量
		for(var i=0;i<res.songs.length;i++){
			var obj= {}
			obj.artists= []
			obj.album= {}
			obj.name= res.songs[i].name
			obj.id= res.songs[i].id
			obj.mvid= res.songs[i].mvid
			obj.time= timeFilter(res.songs[i].duration)
			obj.alias= res.songs[i].alias.join(',')
			obj.album.id= res.songs[i].album.id //专辑id
			obj.album.name= res.songs[i].album.name
			if(res.songs[i].artists.length > 0){
				var obj2= {}
				for(var j=0; j < res.songs[i].artists.length; j++){
					obj2.id= res.songs[i].artists[j].id
					obj2.name= res.songs[i].artists[j].name
					obj.artists.push(obj2)

				}

			}
			searchResult.push(obj)	
		}
	}
	function getIdList(data,idList){
		for(var i=0; i< data.length; i++){
			idList.push({id:data[i].id})
		}
	}
	function handleCd(res,cdContent){  //处理cd
		if(res.albums && res.albums.length >0){
			for(var i=0; i< res.albums.length; i++){
				var obj= {}
				obj.artist= {}
				obj.picUrl= res.albums[i].picUrl
				obj.id= res.albums[i].id
				obj.name= res.albums[i].name
				obj.artist.name= res.albums[i].artist.name
				obj.artist.id= res.albums[i].artist.id
				obj.artist.alia= ''
				if(res.albums[i].artist.alia && res.albums[i].artist.alia.length > 0){
					obj.artist.alia= res.albums[i].artist.alia[0]
				}
				obj.alias= ''
				if(res.albums[i].alias && res.albums[i].alias.length > 0){
					obj.alias= res.albums[i].alias[0]
				}
				cdContent.push(obj)
			}
		}
	}
	function HandleSearchSingerById(res,SearchSinger){ //处理通过id搜索歌手
		SearchSinger.artist= {}
		SearchSinger.hotSongs=[]
		SearchSinger.artist.alias= res.artist.alias[0]
		SearchSinger.artist.id= res.artist.id
		SearchSinger.artist.img1v1Url= res.artist.img1v1Url
		SearchSinger.artist.musicSize= res.artist.musicSize
		SearchSinger.artist.mvSize= res.artist.mvSize
		SearchSinger.artist.name= res.artist.name
		SearchSinger.artist.albumSize= res.artist.albumSize
		SearchSinger.artist.briefDesc= res.artist.briefDesc
		SearchSinger.hotSongsNum= ''
		SearchSinger.hotSongs= []
		if(res.hotSongs && res.hotSongs.length>0){
			SearchSinger.hotSongsNum= res.hotSongs.length
			for(var i=0; i< res.hotSongs.length; i++){
				var obj= {}
				obj.al= {}
				obj.al.name= res.hotSongs[i].al.name
				obj.al.id= res.hotSongs[i].al.id
				obj.name= res.hotSongs[i].name
				obj.alia= res.hotSongs[i].alia[0]
				obj.mv= res.hotSongs[i].mv
				obj.time= timeFilter(res.hotSongs[i].dt)
				obj.ar= {}
				obj.ar.id= res.hotSongs[i].ar[0].id
				obj.ar.name= res.hotSongs[i].ar[0].name
				obj.id= res.hotSongs[i].id
				SearchSinger.hotSongs.push(obj)
			}
		}

	}
	function HandleSearchCdBySingerId(res,cdContentBySingerId){ //处理通过歌手id搜索的专辑
		cdContentBySingerId.hotAlbums=[]
		if(res.hotAlbums && res.hotAlbums.length > 0){
			for(var i=0;i< res.hotAlbums.length; i++){
				var obj= {}
				obj.name= res.hotAlbums[i].name
				obj.id= res.hotAlbums[i].id
				obj.publishTime= creatTime(res.hotAlbums[i].publishTime)
				obj.picUrl= res.hotAlbums[i].picUrl
				cdContentBySingerId.hotAlbums.push(obj)
			}
		}
	}
	function HandleSingerDesc(res,singerDesc){
		singerDesc.briefDesc= res.briefDesc
		singerDesc.introduction= []
		if(res.introduction && res.introduction.length> 0){
			for(var i=0;i < res.introduction.length; i++){
				var obj= {}
				obj.ti= res.introduction[i].ti
				obj.txt= parseText(res.introduction[i].txt)
				singerDesc.introduction.push(obj)
			}
		}

	}
	function parseText(str){
		return str.split('\n')
	}
	function HandleCdById(res,SearchCdList){ //处理通过id获取专辑的数据
		SearchCdList.name= res.album.name
		SearchCdList.description= res.album.description
		SearchCdList.publishTime= creatTime(res.album.publishTime)
		SearchCdList.picUrl= res.album.picUrl
		SearchCdList.commentCount= filters(res.album.info.commentCount)
		SearchCdList.shareCount= filters(res.album.info.shareCount)
		SearchCdList.commentCount= filters(res.album.info.commentCount)
		SearchCdList.artist= {}
		SearchCdList.artist.name= res.album.artist.name
		SearchCdList.artist.id= res.album.artist.id
		SearchCdList.id= res.album.id
		SearchCdList.songs= []
		SearchCdList.long= res.songs.length
		for(var i=0; i< res.songs.length; i++){
			var obj= {}
			obj.name= res.songs[i].name
			obj.dt= timeFilter(res.songs[i].dt)
			obj.id= res.songs[i].privilege.id
			obj.mv= res.songs[i].mv
			obj.pop= res.songs[i].pop

			obj.alia= res.songs[i].alia.length > 0 ? res.songs[i].alia[0] : ''
			obj.al= []
			for(var j=0; j< res.songs[i].ar.length; j++){
				var obj2= {}
				obj2.id= res.songs[i].ar[j].id
				obj2.name= res.songs[i].ar[j].name
				obj.al.push(obj2)
			}
			SearchCdList.songs.push(obj)
		}

	}
	function scroll(dom,callback){ //卷曲底部处理函数
		var isFirst= true
		dom.onscroll= function(e){
			e= e || window.event
			var target= e.target
			var maxScrollHeight= target.scrollHeight - target.offsetHeight //卷曲做大高度
			// console.log(target.scrollTop,maxScrollHeight)
			if(10*target.scrollTop / maxScrollHeight >= 9){ //target.scrollTop向上卷曲的实时距离 / 卷曲做大高度 >= 0.9
				if(isFirst){
					isFirst= false
					callback && callback()
				}    
			}
		} 
	}
	function parseUrlHash(url){ //解析url的hash值
		var str= ''
		str= url.substring((url.indexOf('#')+1))
		return str
	}
	function parseUrlParmas(url){ //解析url参数部分
		url= parseUrlHash(url)
		url= url.substring(url.indexOf('?')+1)
		var arr= url.split('&')
		var obj= {}
		for(var i=0; i < arr.length; i++ ){
			var arr2= arr[i].split('=')
			obj[arr2[0]]= decodeURI(arr2[1])
		}
		// console.log(obj)
		return obj
	}
	function getAttr(obj,attr){ //获取元素的css内部的属性值
		if(obj.currentStyle){
			return obj.currentStyle[attr]
		}else{
			return getComputedStyle(obj,false)[attr]
		}
	}
	function renderList(item,id){
		var liObj= document.createElement('li')
		liObj.setAttribute('data-id', item.id)
		if(item.id == id){
			liObj.classList.add('active')
		}
        var span1= document.createElement('span')
        span1.innerHTML= item.name
        span1.className= 'songName'
        var span2= document.createElement('span')
        span2.innerHTML= item.act
        span2.className= 'songAct'
        var span3= document.createElement('span')
        span3.innerHTML= item.time
        span3.className= 'songTime'
        liObj.appendChild(span1)
        liObj.appendChild(span2)
		liObj.appendChild(span3)
		return liObj
	}
	function checkArr(obj){
		Object.defineProperty(obj,'list',{
			get:function(target,key,receiver){
					console.log(2)
			},
			set:function(target,key,value,receiver){
				// target[key] = value;
				console.log(`修改了key:${key},新值：${value}`)
				console.log(1)
				// if(list.length === 0 ) return
				// var Frag= document.createDocumentFragment()
				// // var liObj= document.createElement('li')
				// list.forEach((item,i) => {
				// 	Frag.appendChild(renderList(item))
				// })
				// listEle.appendChild(Frag)
			}
		})
	}
	function imgLoading(){
		var load= document.querySelector('.load')
		load.style.width= '0px'
		load.style.display= "block"
 		var img= document.getElementsByTagName('img')
 		img= Array.prototype.slice.call(img)
		//  console.log(img)
		 var k= 0
 		for(var i= 0; i< img.length; i++){
 			(function(i){
 				var imgO= new Image()
 				imgO.onload= function(){
 					imgO.onload= null
					 k++  
					//  console.log( k / img.length)
 					load.style.width= (k / img.length) * 100 + '%'
 					if( k === img.length ){
						 load.style.display= "none"
						 load.style.width= '0px'
 					}
 				}
			imgO.src= img[i].src  //这样做的目的： 1,写在onload的后面是为了，先绑定事件在添加src属性，加载图片，避免图片先 加载好了，onload还没执行
								 //2,为什么要重新定义一个imgO,折也是为了避免在html中图片已经加载完了，后面的onload还没有绑定，从而导致进度条不执行或者直接跳过去
 			})(i)	
 		}
	}
	function handleNewMv(res,getMvNew){ //处理最新mv
	
		res.forEach((item,i) =>{
			var obj= {}
			obj.artistId= item.artistId
			obj.artistName= item.artistName
			var arr= []
			item.artists.forEach((it,j)=>{
				arr.push(it.name)
			})

			obj.artists= arr.join('/')
			obj.briefDesc= item.briefDesc
			obj.cover= item.cover
			obj.id= item.id
			obj.name= item.name
			obj.playCount= filters(item.playCount)
			obj.subed= item.subed
			getMvNew.push(obj)
		})
	}
	function handlePreMv(res,mvPerContent){ //处理推荐mv
		res.forEach((item,i) =>{
			if(i > 2) return
			var obj= {}
			obj.id= item.id
			obj.name= item.name
			obj.playCount= filters(item.playCount)
			obj.picUrl= item.picUrl
			var arr= []
			item.artists.forEach((it,j)=>{
				arr.push(it.name)
			})
			obj.artists= arr.join('/')
			obj.copywriter= item.copywriter
			obj.artistId= item.artistId
			obj.artistName= item.artistName
			obj.subed= item.subed
			mvPerContent.push(obj)
		})
	}
	function isCheck(callback){ //点击输入框是否确定
		var divEle= query$('.mask.clear-history .mask-content>div')
		var mask= query$('.mask.clear-history')
		divEle.onclick= function(e){
			e= e || window.event
			var target= e.target
			if(target.nodeName.toLowerCase() === 'span'){
				mask.style.display= "none"
				if(target.innerHTML === '确定') {
					callback(true)
				}else{
					callback(false)
				}	
			}
		}
	}
	function handleRecomMusicList(res,tracks,locationArr){
		res.forEach((item,i)=>{
			var obj= {}
			obj.dt= item.dt || item.time
			obj.name= item.name
			obj.mv= item.mv
			obj.id= item.id
			obj.cdName= item.al.name
			obj.cdId= item.al.id
			obj.ar= item.ar || []
			obj.arName= '' || item.act
			var arr= []
			if(item.ar){
				item.ar.forEach((it,j)=>{
					arr.push(it.name)
				})
				obj.arName= arr.join('/')
			}
	
			obj.pop= item.pop || 100
			var flag= locationArr.some((it)=>{
				return  it.id == item.id
			})
			obj.collection= flag
			tracks.push(obj)
		})
	}
	function playAllMusic(idList,from){ //点击播放全部音乐
		var id= idList[0].id
		musicPlay(id,idList,from)
	}
	function downloadFile(url,filename,flag){// 下载视频，音频文件
		if(!url) return tip()
		flag= flag || false
		fetch(url)
			.then(res => { 
				return  res.blob() //返回 res.bolb() 将文件转化为二进制格式的，返货个promise对象，所以后面.then接收
			})
			.then(blob =>{
				 const a = document.createElement('a');
			   document.body.appendChild(a)
			   a.style.display = 'none'
			   // 使用获取到的blob对象创建的url
			   const url = window.URL.createObjectURL(blob);
			   console.log(url)
			   a.href = url;
			   a.download = filename + flag;
			   a.click();
			   document.body.removeChild(a)
			   // 移除blob对象的url
			   window.URL.revokeObjectURL(url);
			})
	}

	// tip
	function tip(obj){ //{topText,conText}
		var time= 2500
		if(obj && obj.time){
			time= obj.time
		}
		if(obj && obj.topText){
			console.log(1)
			const top= query$('.tipDiv .top')
			top.innerHTML= obj.topText
		}
		if(obj && obj.conText){
			console.log(2)
			const content= query$('.tipDiv .content')
			content.innerHTML= obj.conText
		}
		var timer= null
		const tipDiv= query$('.tipDiv')
		clearTimeout(timer)
		tipDiv.style.display= "flex"
		timer= setTimeout(function(){
		  tipDiv.style.display= "none"
		},time)
		return
	}
	function isDetailLocationStore(songDetail,id,flag){ //是否删除收藏存储
		let arr= JSON.parse(localStorage.getItem('collection')) || [] //获取收藏缓存
        arr= arr.filter((item,i)=>{

			if( item.id === id && !flag){
				item.collection= false
			}
            return item.id != id
		})
		if(flag){
			songDetail.collection= true
			arr.unshift(songDetail)
		}else {

		}
        localStorage.setItem('collection',JSON.stringify(arr))
	}
	function handleCollectionData(res,recomList,createTime,tracks){
		recomList.playCount= 1
		recomList.name= '我喜欢的音乐'
		recomList.avatarUrl= ''
		recomList.nickname= '未登录'
		recomList.createTime= createTime
		recomList.subscribedCount= null
		recomList.commentCount= null
		recomList.shareCount= null
		recomList.tags= []
		recomList.description= ''
		recomList.coverImgUrl= res.al.picUrl
		recomList.tracks= tracks
	}

	function hangdleMusciTopList(res,recomList,long){
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
	}
	function random(min,max){
		return Math.floor(Math.random()*(max-min)+min)
	}
export {
	id$,
	class$,
	query$,
	tagName$,
	ajax,
	ProAjax,
	filters,
	creatTime,
	timeFilter,
	parseLyric,
	Handlecomments,
	HandleIncludeThisSong,
	HandleSimilarSong,
	HandleSearch,
	getIdList,
	handleCd,
	HandleSearchSingerById,
	HandleSearchCdBySingerId,
	HandleSingerDesc,
	HandleCdById,
	scroll,
	parseUrlHash,
	parseUrlParmas,
	getAttr,
	renderList,
	checkArr,
	imgLoading,
	handleNewMv,
	handlePreMv,
	isCheck,
	handleRecomMusicList,
	playAllMusic,
	downloadFile,
	tip,
	isDetailLocationStore,
	handleCollectionData,
	hangdleMusciTopList,
	random
}