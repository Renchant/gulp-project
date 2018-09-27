/*
 * @desc 入口页面
 * @author Jazzy
 * @date 2017-09-22
 */
import { transition, removeClass, animation } from './modules/utils.js';
import { musicPlay } from './modules/musicPlay.js'
import Swiper from 'swiper';
import FadeText from './modules/fade-text.js';
import polyfill from './modules/polyfill';


// 音频部分
const pageMusicUrl = {
    0: 'http://h5img.yyyad.com/h5/moon2017/page0.mp3',
    1: 'http://h5img.yyyad.com/h5/moon2017/page1.mp3',
    2: 'http://h5img.yyyad.com/h5/moon2017/page2.mp3',
    3: 'http://h5img.yyyad.com/h5/moon2017/page3.mp3',
    4: 'http://h5img.yyyad.com/h5/moon2017/page4.mp3',
    5: 'http://h5img.yyyad.com/h5/moon2017/page5.mp3',
    6: 'http://h5img.yyyad.com/h5/moon2017/page6.mp3',
    7: 'http://h5img.yyyad.com/h5/moon2017/page7.mp3',
    8: 'http://h5img.yyyad.com/h5/moon2017/page8.mp3'
};
const bgMusicUrl = 'http://h5img.yyyad.com/h5/moon2017/bg.mp3';

let currentpage = 0;
let canPlay;
const musicDiv = document.getElementById('music');
const bgMusicDom = document.getElementById("bgMusic");
const pageMusicDom = document.getElementById("pageMusic");
const pageMusic = new musicPlay(pageMusicDom);
const bgMusic = new musicPlay(bgMusicDom);

// 音频部分

let complete = false;
let progress_number = 0;

function intStart(className) {
    let starts = document.querySelectorAll(`.${className}`);

    Array.from(starts).forEach(start => {
        let flash = start.getAttribute('data-flash');
        let delay = start.getAttribute('data-delay');

        if (flash) {
            setTimeout(() => {
                start.classList.add(flash);
            }, delay || 0);
        }
    });
}

const create_arrow = () => {
    const contain = document.querySelectorAll('.contain');

    for(let i = 0; i < contain.length - 1; i++){
        if(i !== contain.length - 1){
            const ele = document.createElement('div');
            ele.classList.add('page9_top_arrow-img');
            ele.classList.add('animation_down_translate');
            Object.assign(ele.style,{
                bottom: '.2rem',
                left: '50%',
                marginLeft: '-.28rem',
                width: '.55rem',
                height: '.47rem',
                position: 'absolute'
            })
            contain[i].appendChild(ele)
        }
    }
    // contain.forEach((item, idx, arr) => {
    // })
}

function createElement(tag, style, className) {
    let el = document.createElement(tag || 'div');

    className && el.classList.add(className);

    Object.assign(el.style, style);

    return el;
}

function initPage4Bubbles(callback) {
    let win = document.querySelector('#page4-window .window__content');
    
    win.innerHTML = '';

    let bubbles = [
        createElement('i', {
            top: '1.86rem',
            left: '3.94rem',
            width: '.24rem',
            height: '.24rem'
        }, 'bubble'),
        createElement('i', {
            top: '.66rem',
            left: '2.9rem',
            width: '.28rem',
            height: '.28rem'
        }, 'bubble'),
        createElement('i', {
            top: '.88rem',
            left: '1.38rem',
            width: '.5rem',
            height: '.5rem'
        }, 'bubble'),
        createElement('i', {
            top: '.86rem',
            left: '3.74rem',
            width: '.5rem',
            height: '.5rem'
        }, 'bubble')
    ];

    let bubbleTransition = () => {
        var bubble = bubbles.shift();
        
        if (bubble) {
            transition(bubble, () => {
                bubble.style.opacity = 1;
                bubble.style.transform = 'scale(1)';
            }, bubbleTransition);
        } else {
            callback();
        }
    }

    bubbles.forEach((bubble, idx) => {
        bubbles[idx] = win.appendChild(bubble);
    });

    setTimeout(bubbleTransition);
}

const init = function(){
    const $progressBar = document.querySelector('.progress-bar');
    const $progressBarTran = document.querySelector('.progress-bar-tran');
    
    const handleProgress = (val) => {
        $progressBarTran.style.width = Math.ceil(val) + '%'
    }

    const end = () => {
        if( complete ){
            setTimeout(() => {
                document.querySelector('.preload').style.display = 'none';
                document.querySelector('.app').style.opacity = 1;
            },0)
        }
    }

    const addPress = () => {
        setTimeout(() => {
            if(progress_number < 100) {
                progress_number = progress_number + 1;
                handleProgress(progress_number)
                addPress();
            }else{
                progress_number = 100;
            }
            
        },100)
    }

    this.addPress = addPress;
    this.end = end;
    
    // $progressBarTran.addEventListener('webkitTransitionEnd', end)
    // $progressBarTran.addEventListener('transitionend', end)
}

const start = () => {
    
    let page1Text = new FadeText('page1-text', null, '.');
    let page2Text = new FadeText('page2-text');
    let page3Text = new FadeText('page3-text');
    let page4Text = new FadeText('page4-text');
    let page5Text = new FadeText('page5-text');
    let page6Text = new FadeText('page6-text');
    let page7Text = new FadeText('page7-text');
    let page8Text = new FadeText('page8-text', null, '.', 4500);
    let page9Text = new FadeText('page9-text',null,'.', 4500);

    let pageTextArr = [
        page1Text,
        page2Text,
        page3Text,
        page4Text,
        page5Text,
        page6Text,
        page7Text,
        page8Text,
        page9Text
    ];

    let pageWindow = document.querySelectorAll('.page__window');

    const configSwiper = {
        initialSlide: 0,
        wrapperClass: 'scroll',
        slideClass: 'contain',
        loop: false,
        direction: 'vertical',
        onInit: () => {
            intStart('page_start');
            // 音频部分
            pageMusic.open(pageMusicUrl[currentpage], () => {
                complete = true;
                progress_number = 100;
                musicDiv.classList.add('music-animation');
                processInit.end();
                page1Text.render(); 
            });
        },
        onSlideChangeStart: swiper => {

            pageMusic.stop();

            document.querySelector('#page4-window .window__content').innerHTML = '';

            pageTextArr
                .forEach(pageText => pageText.clear());

            for(let i = 0; i < pageWindow.length - 1; i++){
                let win = pageWindow[i];
                if (~win.id.indexOf(swiper.activeIndex + 1)) return;
                removeClass(win, 'actived');
            }
        },
        onSlideChangeEnd: swiper => {
            const delay = 1000;
            currentpage = swiper.activeIndex;

            switch(swiper.activeIndex) {
                case 0:
                    pageMusic.play(pageMusicUrl[currentpage], page1Text.render());
                    break;
                case 1:
                    transition('page2-window', 'actived', () => page2Text.render());
                    break;
                case 2:
                    transition('page3-window', 'actived', () => page3Text.render());
                    break;
                case 3:
                    transition('page4-window', 'actived', initPage4Bubbles(() => page4Text.render()));
                    break;
                case 4:
                    transition('page5-window', 'actived', () => page5Text.render());
                    break;
                case 5:
                    transition('page6-window', 'actived', () => page6Text.render());
                    break;
                case 6:
                    transition('page7-window', 'actived', () => page7Text.render());
                    break;
                case 7:
                
                    // transition('page8_img-bottom_moon', 'active', () => );
                    pageMusic.play(pageMusicUrl[currentpage], page8Text.render());
                    break;
                case 8:
                    // transition('settime_delay', 'active', () => );
                    page9Text.render()
                    break;
            }
        }
    }

    const app = new Swiper('.app',configSwiper);

    setTimeout(() => {
        complete = true;
        progress_number = 100;

    },300)

}
init();
window.onload = e => {
    create_arrow();
    start();
}

console.log(4)
