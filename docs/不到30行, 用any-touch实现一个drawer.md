# 不到30行, 用any-touch实现一个drawer
![https://github.com/383514580/any-touch](https://ww1.sinaimg.cn/large/005IQkzXly1g1as0lsa1hj30m805ugmp.jpg)

[<svg height="16" class="octicon octicon-mark-github" viewBox="0 0 16 16" version="1.1" width="32" aria-hidden="true"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg>any-touch](https://github.com/383514580/any-touch) 一个手势库

## demo
[预览](https://codepen.io/russell2015/pen/jJRbgp?editors=1000)


## drawer的基本逻辑

1. 添加2个div, 一个是当drawer隐藏的时候打开隐藏的触发开关, 一个是drawer本身.
2. 对把手和drawer进行进行fixed定位到界面的右侧边缘.
3. 调整drawer和把手的样式, 这里把手主要是要设置背景色为透明, 具体样式看下面代码.
4. 用**any-touch**分别给把手和drawer添加pan(拖拽)手势.
5. 当drawer隐藏时, 拖拽把手向右, 通过pan返回的deltaX(每次触发拖拽的x偏移)进行drawer的拖拽, 让其向右侧移动以显示.
6. 向左拖拽drawer, 让其隐藏, 当隐藏部分占drawer宽度超过一半的时候, 松开手, 那么抽屉自动隐藏到左侧, 反之, drawer完全显示.

**注**: 本文仅用来讲解drawer的基本原理, 还有很多边界处理的细节大家可以后续自行补充作为练习.

## 代码
```html
<!-- 触发把手 -->
<div class="com-drawer-handler" id="j-com-drawer-handler"></div>

<!-- 抽屉 -->
<div class="com-drawer" id="j-com-drawer">
   <img class="avator" src="https://s.cdpn.io/profiles/user/406915/80.jpg?1511329408" width="100%">
  
  <p align="center">
    铁皮饭盒
  </p>
  <a class="github" href="https://github.com/383514580/any-touch">github : any-touch</a>
<div>
  <script src="https://unpkg.com/any-touch/dist/AnyTouch.umd.js"></script>
```

```css
.com-drawer-handler {
  height: 100vh;
  background: rgba(252, 252,252, 0);
  width: 45px;
  position: fixed;
  z-index: 2;
  top: 0;
  left: 0;
}

.com-drawer {
  padding: 30px;
  height: 100vh;
  min-width: 10vw;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 3;
  box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.1);
  .avator {
    touch-action: none;
    display: block;
    width: 60%;
    border-radius: 100%;
    margin: 15px auto;
  }
  .github {
    padding: 5px 15px;
    background: #000;
    color: #fff;
    text-decoration: none;
    display: block;
    text-align: center;
    border-radius: 6px;
    margin-top: 60px;
  }
}

.animated {
  transition: all 200ms;
}

```

``` javascript
// 抽屉部分
let offsetX = 0;
const elDrawer = document.getElementById("j-com-drawer");
const minX = 0 - elDrawer.offsetWidth;
const at = new AnyTouch(elDrawer);
at.on("panstart", ev => {
});
at.on("panmove", ({ deltaX }) => {
  offsetX += deltaX;
  console.log(offsetX, deltaX);
  if (0 <= offsetX) {
    offsetX = 0;
  }
  elDrawer.style.transform = `translateX(${offsetX}px)`;
});
at.on("panend", () => {
  offsetX = minX / 2 < offsetX ? 0 : minX;
  elDrawer.style.transform = `translateX(${offsetX}px)`;
  elDrawer.classList.toggle(animated, true);
});
// 把手
const elHandler = document.getElementById("j-com-drawer-handler");
const atHandler = new AnyTouch(elHandler, { isPreventDefault: false });
atHandler.on("panmove", ({deltaX}) => {
  offsetX+= deltaX;
  offsetX = 0 < offsetX ? 0 : offsetX;
  elDrawer.style.transform = `translateX(${offsetX}px)`;
  console.log(ev.target,ev.currentTarget)
});
```



## 关于vue和react版本
这里是用纯js实现的版本, 如果用vue或者react代码量会更少, 有兴趣的同学可以自行实现或者需要的人多, 我会再写个vue版本的例子(react我也不会, 我得找同事帮写个demo, 嘿). 太晚了,写的仓促, 如果错误请指出, 我会立即修改.