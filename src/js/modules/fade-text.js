/**
 * @description 文字动效
 * @author: minfive
 * @createDate: 2017-09-24
 * @lastModify minfive
 * @lastDate: 2017-09-24
 */

export default class FadeText {
    constructor(elId, html, ignore,time) {
        this._el = document.getElementById(elId);
        this._html = html;
        this._ignore = (ignore || '').split(' ');
        this._time = time;
    }

    /**
     * 处理内容数据
     * 
     * @api private
     */

    _processHtml(html) {
        return html
            .trim()
            .replace(/[\n|\r|\s]/g, '')
            .replace(/(<br>|<br\/>)/g, ' ')
            .split(' ')
            .map(line => line.replace('&nbsp;', ' '))
            .map(line => line.split(''));
    }

    /**
     * 清除内容
     * 
     * @api public
     */

    clear() {
        if (!this._htmlData) {
            this._htmlData = this._processHtml(this._html || this._el.innerHTML);
        }

        window.clearInterval(this._timer);
        this._el.innerHTML = '';
        this._el.style.opacity = 0;
        return this;
    }

    /**
     * 渲染内容
     */
    render() {
        if (!this._htmlData) this.clear();

        let htmlData = JSON.parse(JSON.stringify(this._htmlData));

        this._el.style.opacity = 1;
        let number = 0;
        htmlData.forEach(item => {number += item.length});
        window.clearInterval(this._timer);
        this._timer = window.setInterval(() => {
            let nowHtml;

            if (Array.isArray(htmlData[0])) {
                nowHtml = htmlData[0].shift();

                if (nowHtml == null) {
                    nowHtml = '<br/>';
                    htmlData.shift();
                }
            } else {
                nowHtml = htmlData.shift();
            }

            if (nowHtml == null) {
                window.clearInterval(this._timer);
                return;
            }

            this._el.innerHTML += 
                this._ignore.find(item => nowHtml === item) 
                    ? nowHtml
                    : nowHtml + ' '; 
        }, this._time? parseInt(this._time / number) : 150);
    }
}