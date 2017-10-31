import { bgMusicUrl } from './pageMusicUrl.js';
export function musicPlay(){

    const musicDiv = document.getElementById('music');
    const bgAudio = document.getElementById("bgMusic");
    const pageAudio = document.getElementById("pageMusic");

    const stop = function(){
        pageAudio.pause();
        pageAudio.src = '';
    }

    const canplay = function(url, audio, callback){
        audio.src = url;
        audio.addEventListener('canplay', callback());
    }

    const play = function(url,callback){
        if(url){
            canplay(url, pageAudio, ()=>{
                pageAudio.play();
                document.addEventListener("WeixinJSBridgeReady", function () {
                    pageAudio.play();
                }, false);
                callback && callback();
            });
        }else{
            bgAudio.play();
            pageAudio.play();
            document.addEventListener("WeixinJSBridgeReady", function () {
                console.log("微信执行");
                bgAudio.play();
                pageAudio.play();
            }, false);
        }
    }

    var bindClick = function(){
        musicDiv.addEventListener('touchend', function(e){
            e.preventDefault();
            if( pageAudio.paused && bgAudio.paused ){
                musicDiv.classList.add('music-animation');
                pageAudio.play();
                bgAudio.play(); 
            }else{
                bgAudio.pause();
                pageAudio.pause();
                musicDiv.classList.remove('music-animation'); 
            }
        })
    }

    const open = function(url, callback){
        canplay(bgMusicUrl, bgAudio, () => {
            canplay(url, pageAudio, () =>{
                play();
                bindClick();
                callback && callback();
            })
        });
    }

    this.stop = stop;
    this.open = open;
    this.play = play;
}