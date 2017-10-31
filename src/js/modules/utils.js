/**
 * @description utils
 * @author: minfive
 * @createDate: 2017-09-24
 * @lastModify minfive
 * @lastDate: 2017-09-24
 */

export function transition(elId, className, callback) {
    let el = typeof(elId) === 'string' ? document.getElementById(elId) : elId;

    function fun() {
        callback && callback();
        el.removeEventListener('transitionend', fun);
    }

    el.addEventListener('transitionend', fun);

    typeof(className) === 'function' ? className() : el.classList.add(className);
}

export function animation(elId, className, callback) {
    let el = typeof(elId) === 'string' ? document.getElementById(elId) : elId;

    function fun() {
        callback && callback();
        el.removeEventListener('animationend', fun);
    }

    el.addEventListener('animationend', fun);

    typeof(className) === 'function' ? className() : el.classList.add(className);
}

export function removeClass(el, className, callback) {
    el.style.transition = '';
    el.classList.remove(className);

    setTimeout(() => {
        el.style.cssText = '';
        callback && callback();
    });
}