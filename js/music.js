var myMusic = id("myMusic");   // audio播放器
var cd = document.getElementsByClassName("cd")[0];  // 光碟旋转
var btn = id("play");  // 播放按钮
var con = document.getElementsByClassName("content")[0];  // 向上滚动歌词
var txt = id("txt");  // 文本输入框 装歌词
var curTime = id("curTime");   // 当前歌曲时间
var pro_bar = id("pro-bar");   // 进度长条
var processBar = id("processBar");  //  宽度不断增加的进度条
var processBtn = id("processBtn");  //  进度按钮
var allTime = id("allTime");  // 歌曲总时间
var search = id("search");  // 搜索歌曲
var oUl =id('ul1');  // 动态搜索的歌单列表
var songs = id("songs");  // 搜索歌曲，回车键把歌曲列表 显示出来
var title = id("title");  //  歌曲标题
var singer = id("singer");  // 歌手
var menu = id("menu");   //左上角歌单 静态歌单
var his = id("history");  //右上角历史 历史歌单
var m_list = id("m_list");  //左上角歌单 静态歌单列表
var h_list = id("h_list");  //右上角历史 历史歌单列表
var next = id("next");  // 下一曲
var prev = id("prev");  //  上一曲
var rand = id("rand");   //播放模式
var loading = id("loading");  //  正在加载 的自行车图片
var value = '海阔天空';   //  api请求的歌名
var mark = true;  //  播放暂停按钮
var first = 0;  // 第一次点播放迎按钮
var num = 0;//歌词上移变量
var inSearch = false;  //  true 代表按了回车键 搜索歌曲了
var id = 0;  //  根据ID 搜索歌曲
var m_mark = true;   // 左上角的歌单
var h_mark = true;  // 右上角的历史歌单
var key1;


// 点击播放按钮，需要加载 api资源 利用jsonP
btn.onclick = function(){
   // palyMusic();
   if (mark) {
        first++;
        if (first === 1) { // 第一次点击  播放音乐
            playMusic();   //  播放音乐
        }else{
            myMusic.play();  // 播放音乐
            cd.className = 'cd rotate';  //  旋转
            this.style.backgroundImage = 'url(images/pause.png)';  // 显示暂停图片
        }
   } else {
        myMusic.pause();   // 暂停
        cd.className = 'cd';    //  停止旋转
        this.style.backgroundImage = 'url(images/play.png)';   // 显示播放图片
   }
   mark = !mark;
}

//点击播放下一曲
var n = 0;   //选择左上角静态的歌单，通过n的变化改变
next.onclick = function(){
    n++;
    var aSpan = document.getElementsByClassName('songname');
    n%=aSpan.length;
    value = aSpan[n].innerHTML;
    playMusic();
    window.localStorage.clear();
}

//点击播放上一曲
prev.onclick = function(){
    n--;
    var aSpan = document.getElementsByClassName('songname');
    if(n<0)n = aSpan.length-1;
    value = aSpan[n].innerHTML;
    playMusic();
}

//播放模式切换
var rands = 3;
rand.onclick = function(){
    rands++;
    rands%=4;
    this.style.backgroundImage = 'url(images/rand'+rands+'.png)';
}

//当前时间
myMusic.addEventListener('timeupdate',function(){
    nowTime();    // 获取 歌曲 当前时间、总时间
})

//获取当前时间
function nowTime(){
    curTime.innerHTML = time(myMusic.currentTime);   //获取播放当前时间并转换
    allTime.innerHTML = time(myMusic.duration);   //获取播放总时间并转换
    var scale = myMusic.currentTime / myMusic.duration;   //计算进度条运动的比例
    processBar.style.width = scale*(pro_bar.offsetWidth - processBtn.offsetWidth) + 'px';  //给运动条设置运动样式
}

//搜索歌曲
document.onkeydown = function(e){
    e = e || event;
    if(e.keyCode===13){   //判断用户是不是点击回车键
        if(search.value!=''){
            value = search.value;
            inSearch = true;
            playMusic();
        }
    }
}

//输入框获取焦点是两边的列表隐藏
search.onfocus = function(){
    m_list.style.display = 'none';
    h_list.style.display = 'none';
    m_mark = true;
    h_mark = true;
}


loop();
function loop(){
    myMusic.addEventListener('ended',function(){
        switch(rands){
            case 0:  //只播放一首
                btn.style.backgroundImage = 'url(images/play.png)';
                cd.className = 'cd';
                mark = true;
                con.style.top = '0';
                num = 0;
                break;
            case 1:   //单曲循环播放
                playMusic();
                break;
            case 2:   // 全部歌曲循环播放
                n++;
                var aSpan = document.getElementsByClassName('songname');
                n%=aSpan.length;
                value = aSpan[n].innerHTML;
                playMusic();
                break;
            case 3:   //随机播放
                var aSpan = document.getElementsByClassName('songname');
                n = Math.floor(Math.random()*aSpan.length);
                value = aSpan[n].innerHTML;
                playMusic();
                break;
        }
    })
}

//播放音乐
function playMusic(){
    first++;   // 每次调用 first ++
    createScript(value);
    con.style.top = 0;
    num = 0;
    loading.style.display = 'block';   //显示加载动画

}

//添加历史记录
function addHistory(value){
    var oP = document.createElement('p');    //每次点击歌曲就创建历史记录
    oP.innerHTML = '<span class="h_songname">'+value+'</span><span class="addsong">添加</span><span class="remove2">删除</span>';
	h_list.appendChild(oP);
}

//左上角的歌单
menu.onclick = function(){
    if(m_mark){
        m_list.style.display = 'block';  // 左上角歌单 静态的歌单列表
        h_list.style.display = 'none'; // 右上角历史  历史歌单列表
        songs.style.display = 'none'; // 搜索的歌曲列表
        search.value = '';  // 点击静态的歌单 搜索框隐藏
        h_mark = true;
        var aP = m_list.getElementsByTagName('p');
        var aSpan1 = document.getElementsByClassName('songname');  // 歌名
        var aSpan2 = document.getElementsByClassName('remove1');  // 删除
        for(var i=0; i<aP.length; i++){
            aSpan1[i].onclick = function(){
                value = this.innerHTML;
                m_list.style.display = 'none';
                playMusic();
                m_mark = true;
            }
            aSpan2[i].index = i;
            aSpan2[i].onclick = function(){
                this.parentNode.parentNode.removeChild(aP[this.index]);
                for(var i=0; i<aP.length; i++){
                    aSpan2[i].index = i;
                }
                if( aSpan2.length ===0 ){
                    m_list.style.display = 'none';
                    m_mark = true;
                }
            }
        }
    }else{
        m_list.style.display = 'none';
    }
    m_mark = !m_mark;
}

//右上角的历史记录
his.onclick = function(){

    var aP = h_list.getElementsByTagName('p');
    if(aP.length){
        if (h_mark) {
        h_list.style.display = 'block'; // 右上角历史  历史歌单列表
        m_list.style.display = 'none';  // 左上角歌单 静态的歌单列表
        songs.style.display = 'none'; // 搜索的歌曲列表
        search.value = '';  // 点击静态的歌单 搜索框隐藏
        m_mark = true;

        var aSpan0 = document.getElementsByClassName('h_songname');  // 歌名
        var aSpan1 = document.getElementsByClassName('addsong');  // 添加
        var aSpan2 = document.getElementsByClassName('remove2');  // 删除

        for(var i=0; i<aP.length; i++){
				aSpan0[i].onclick = function(){
                value = this.innerHTML;
                playMusic();
                h_list.style.display = 'none';
                h_mark = true;
            };
            aSpan1[i].onclick = function () {
                h_list.style.display = 'none';
                var oP = document.createElement('p');
                var text = this.parentNode.firstChild.innerHTML;
                oP.innerHTML = '<span class="songname">'+text+'</span><span class="remove1">删除</span>';
                m_list.appendChild(oP);
            };
            aSpan2[i].index = i;
            aSpan2[i].onclick = function () {
                this.parentNode.parentNode.removeChild( aP[this.index] );
                // for( var i=0,lenght1 =aP.length;i<lenght1;i++  ){
                //     aSpan2[i].index = i;
                // }
                // if( aSpan2.length ===0 ){
                //     m_list.style.display = 'none';
                //     m_mark = true;
                // }
            }
        }

    } else {
        h_list.style.display = 'none';
    }
    h_mark = !h_mark;
}
}

// jsonp动态请求歌曲
function getmusic(data){
    //console.log(data.showapi_res_body.pagebean.contentlist);
    var mp = data.showapi_res_body.pagebean.contentlist;
    var html = '';
    if (inSearch) {   //  true 代表回车键 搜索歌曲 就去动态请求api 及一些渲染歌单信息
        if(mp.length){
                loading.style.display = 'none';   //隐藏加载动画
                songs.style.display = 'block';   // 显示动态请求的歌曲列表
                for (var i=0; i<mp.length; i++) {   // 列表里面每一项
                    html += '<li><span>'+mp[i].songname+'</span><span>'+mp[i].singername+'</span></li>'
                }
                oUl.innerHTML = html;
                var aLi = oUl.getElementsByTagName('li');   // 列表 li
                for(var i=0; i<aLi.length; i++){
                    aLi[i].index = i;
                    aLi[i].onclick = function(){
                        search.value = '';
                        addHistory(mp[this.index].songname,mp[this.index].songid);
                        myMusic.src = mp[this.index].m4a; // 音乐路径 点击li 就播放音乐
                        myMusic.play();
                        cd.style.backgroundImage = 'url('+mp[this.index].albumpic_big+')';
                        title.innerHTML = mp[this.index].songname;
                        singer.innerHTML = mp[this.index].singername;
                        songs.style.display = 'none';   // 隐藏动态请求的歌曲列表
                        inSearch = false;
                        load();
                        id = mp[this.index].songid;   //获取歌曲id
                        createLrc(id);   //通过歌曲的id获取歌词
                    }
                }
            }else{
                oUl.style.display = 'none';
            }
    } else {
        title.innerHTML = mp[0].songname;   //歌名
        singer.innerHTML = mp[0].singername;   // 歌手
        myMusic.src = mp[0].m4a;   // 音乐路径
        cd.style.backgroundImage = 'url('+mp[0].albumpic_big+')';   //旋转图片路径
        myMusic.play();
        addHistory(mp[0].songname,mp[0].songid);
        load();   // 音频已经加载完成 就播放音乐
        id = mp[0].songid;   //获取歌曲id
        createLrc(id);   //通过歌曲的id获取歌词
    }

}

// jsonp动态请求歌词
function getLrc(data){
   var lrc = data.showapi_res_body.lyric;  //获取歌词
   txt.innerHTML = lrc;
   var lrc1 = txt.value;
   var html = '';
   var lrcArr = lrc1.split('[');
   for(var i=0; i<lrcArr.length; i++){
        var arr = lrcArr[i].split(']');
        var time = arr[0].split('.');
        var text = arr[1];
        var timer = time[0].split(':');
        var ms = timer[0]*60 + timer[1]*1;
        if( text&&text.length!=1&&ms ){
            html += '<p id="'+ms+'">'+text+'</p>';
        }
        con.innerHTML = html;
   }

   //歌词同步
   var aP = con.getElementsByTagName('p');
   myMusic.addEventListener('timeupdate',function(){   //监听当前时间
    var curTime = parseInt(this.currentTime)   //当前时间取整
    nowTime();    // 获取 歌曲 当前时间、总时间
    if(document.getElementById(curTime)){
        for(var i=0; i<aP.length; i++){    //改变所有歌词p标签的样式
            aP[i].style.cssText = 'font-size:12px;color:#ccc';
        }
        document.getElementById(curTime).style.cssText = 'color:#F26E6F;font-size:16px';   //当前播放歌词的样式
        if( aP[5+num]&&aP[5+num].id == curTime ){
                con.style.top = -20*num + 'px';
                num++;
            }
    }
});
}


//  播放时，旋转 播放按钮
function load(){// 当浏览器能够开始播放指定的音频/视频时, 该视频已准备好开始播放，发生canplay事件
    myMusic.addEventListener('canplay',function(){
        setTimeout(function(){
            myMusic.play();
            cd.className = 'cd rotate';
            loading.style.display = 'none';
            mark = false;
        },300);
        btn.style.backgroundImage = 'url(images/pause.png)';

    })
}

/*jsonp调用音乐api*/
function createScript(value){
    var oScript = document.createElement('script');
    oScript.src ='http://route.showapi.com/213-1?showapi_timestamp='+formatterDateTime()+'&showapi_appid=47362&showapi_sign=e77287e4a22448fc9a0058eb42f50d7e&keyword='+value+'&maxResult=10&jsonpcallback=getmusic';
    document.body.appendChild(oScript);
}
/*jsonp调用歌词api*/
function createLrc(id){
    var oScript = document.createElement('script');
    oScript.src = 'http://route.showapi.com/213-2?showapi_timestamp='+formatterDateTime()+'&showapi_appid=47362&showapi_sign=e77287e4a22448fc9a0058eb42f50d7e&musicid='+id+'&jsonpcallback=getLrc';
    document.body.appendChild(oScript);
}
function formatterDateTime() {
    var date=new Date()
    var month=date.getMonth() + 1
    var datetime = date.getFullYear()
            + ""// "年"
            + (month >= 10 ? month : "0"+ month)
            + ""// "月"
            + (date.getDate() < 10 ? "0" + date.getDate() : date
                    .getDate())
            + ""
            + (date.getHours() < 10 ? "0" + date.getHours() : date
                    .getHours())
            + ""
            + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date
                    .getMinutes())
            + ""
            + (date.getSeconds() < 10 ? "0" + date.getSeconds() : date
                    .getSeconds());
    return datetime;
    }


// 获取 分 秒
function time(cTime){
    cTime = parseInt(cTime);  // 3700
    var h = zero(Math.floor(cTime%3600));  //获取 小时所剩的秒数
    var m = zero(Math.floor(cTime%3600/60)); // 获取分
    var s = zero(Math.floor(cTime%60));  // 获取秒
    return m+":"+s;
}
function zero(num){
    if (num < 10)
    {
        return "0"+num;
    }else{
        return ''+num;
    }
}

//拖拽排序
(function drag(){
    var aP = m_list.getElementsByTagName('p');
    var index = 0;
    for(var i=0; i<aP.length; i++){
        aP[i].setAttribute('draggable','true');
        aP[i].index = i;
        var Y = 0;
        //拖拽开始
        aP[i].ondragstart = function(e){
            e = e || event;
            index = this.index;
            Y = e.clientY;
        }
        //进入目标元素
        aP[i].ondragenter = function(){
            for(var i=0; i<aP.length; i++){
                aP[i].style.border = 'none';
            }
             this.style.border = '1px dotted #fff';
            /*aP[index].style.border = 'none';
            index = this.index;
            aP[index].style.border = '1px dotted #000';*/
        }
        // 进入目标、离开目标之间 连续触发
        aP[i].ondragover = function(e){
            var e = e || event;
            e.preventDefault();
        }
        //在目标元素上触发
        aP[i].ondrop = function(e){
            e = e || event;
            var y = e.clientY;
            if(Y-y<0){   //从上往下拖
                insertAfter(aP[index],this);
            }else{
                m_list.insertBefore(aP[index],this);
            }
            this.style.border = 'none';
            drag()
        }
    }
})()

function insertAfter(newItem, targetItem){
    var parentItem = targetItem.parentNode; // 获取目标元素的父元素节点
    if(parentItem.lastChild == targetItem){
        parentItem.appendChild(newItem);
    }else{
        parentItem.insertBefore(newItem,targetItem.nextSibling);  //在目标元素的下一个兄弟前面插入新的节点
    }
};

//返回id
function id(obj){
    return document.getElementById(obj);
}


