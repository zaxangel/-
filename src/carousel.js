/**
 * 
 * @authors heinan
 * @email hei-nan@hotmail.com
 * @date    2018-01-27 09:17:56
 * @discribe  carousel project used promise es6 
 */
const config = {
    flag: 0
}
class Carousel {
    constructor({ wrap }) {
        this.wrap = wrap;
        this.flag = config.flag;
        this.images = null;
        this.prevButton = null;
        this.nextButton = null;
        this.init();
    }
    init() {
        //加载数据源
        this.loadJson();

    }
    // async loadJson() {
    //     // let images = await this.getJson("http://localhost:8090/mock");
    //     // this.images = JSON.parse(images);
    //     //渲染图片
    //     // this.loadImages();
    //     // this.bindEvent();
    // }
    loadJson() {
        this.getJson("http://localhost:8080/mock").then((images) => {
            this.images = JSON.parse(images);
            // 渲染图片
            this.loadImages();
            this.bindEvent();
        });

    }
    loadImages() {
        let arr = [];
        //因为图片是异步请求，可能存在图片较大，页面展示会存在图片没有加载，过一会儿出来的情况
        this.images.map((item, index) => {
            //将创建图片返回的promise对象保存在临时数组 arr;
            let promiseImg = this.createImage(item.url);
            arr.push(promiseImg);
        });

        //通过Promise.all()  等待所有图片全部加载完成，然后在添加到dom当中去
        Promise.all(arr).then((images) => {
            let ul = document.createElement("ul");
            images.map((oImg) => {
                let li = document.createElement("li");
                li.append(oImg);;
                ul.append(li);
                this.wrap.append(ul);
            });
        });
    }
    run(button, dir) {
        button.addEventListener("click", (event) => {
            let lis = document.querySelectorAll("ul li");
            if (dir == "left") {
                this.flag--;
                if (this.flag < 1) {
                    this.flag = 0;
                };
            } else {
                this.flag++;
                if (this.flag > lis.length - 1) {
                    this.flag = 4;
                };
            }

            [...lis].map((item, index) => {

                if (index == this.flag) {
                    item.style.display = "block"
                } else {
                    item.style.display = "none"
                }
            });
        });
    }
    bindEvent() {
        this.prevButton = this.createBtn("left");
        this.nextButton = this.createBtn("right");
        this.run(this.prevButton, "left");
        this.run(this.nextButton, "right");
        this.wrap.append(this.nextButton);
        this.wrap.append(this.prevButton)
    }
    getJson(url) {
        return new Promise((resolve, reject) => {
            let xml = new XMLHttpRequest();
            xml.open("GET", url);
            xml.onreadystatechange = function() {
                if (xml.readyState != 4) return;
                if (xml.status == 200) {
                    resolve(xml.responseText)
                } else {
                    reject("error")
                }
            }
            xml.send(null);
        });
    }
    createImage(url) {
        return new Promise((resolve, reject) => {
            let oImg = new Image();
            oImg.onload = function() {
                resolve(oImg)
            }
            oImg.onerror = function() {
                reject("image url can't find")
            }
            oImg.src = url;
        });
    }
    createBtn(dir) {
        let span = document.createElement("span");
        let i = document.createElement("i");
        if (dir == "left") {
            i.className = "fa fa-angle-left fa-4x"
        } else {
            i.className = "fa fa-angle-right  fa-4x"
        }
        span.append(i)
        span.className = dir;
        return span;
    }
}

export default Carousel;