// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function () {
  const slides = document.querySelectorAll('.carousel-slide');
  let currentIndex = 1; // 中间图片索引

  function rotateCarousel() {
    // 移除所有类
    slides.forEach(slide => {
      slide.classList.remove('active', 'prev', 'next');
    });

    // 设置类名：当前active，左边prev，右边next
    const prevIndex = (currentIndex - 1 + 3) % 3;
    const nextIndex = (currentIndex + 1 + 3) % 3;

    slides[prevIndex].classList.add('prev');
    slides[currentIndex].classList.add('active');
    slides[nextIndex].classList.add('next');
  }

  // 自动旋转
  setInterval(() => {
    currentIndex = (currentIndex + 1) % 3;
    rotateCarousel();
  }, 3000);

  // 箭头点击事件
  const leftArrow = document.querySelector('.carousel-arrow-left');
  const rightArrow = document.querySelector('.carousel-arrow-right');

  if (leftArrow) {
    leftArrow.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % 3;
      rotateCarousel();
    });
  }

  if (rightArrow) {
    rightArrow.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + 3) % 3;
      rotateCarousel();
    });
  }
});

// 侧边栏导航点击后一直高亮和切换功能
const navItems = document.querySelectorAll('.container-nav');
const topNavItems = document.querySelectorAll('.topNav-nav-item');
const topNav = document.querySelector('.topNav');
const contentDivs = document.querySelectorAll('.content');
const welcome = document.querySelector('.welcome');
const allContentImgs = document.querySelectorAll('.content-img');
const allTopNavItems = document.querySelectorAll('.topNav-item');
const allContentItemDivs = document.querySelectorAll('.content-item');
const allContentItemImgs = document.querySelectorAll('.content-item-img');
// 侧边栏点击
navItems.forEach((item, index) => {
  item.addEventListener('click', function () {
    // 显示topNav容器和content-img
    topNav.classList.add('show');
    allContentImgs.forEach(img => img.classList.add('content-img-active'));
    // 隐藏welcome
    welcome.style.display = 'none';

    // 显示loading
    const loading = document.querySelector('.loading');
    loading.classList.add('show');

    // 移除所有active类
    navItems.forEach(nav => nav.classList.remove('container-nav-active'));
    topNavItems.forEach(nav => nav.classList.remove('active', 'topNav-item-active'));
    contentDivs.forEach(content => content.classList.remove('active'));
    allContentItemDivs.forEach(div => div.classList.remove('show'));
    allContentItemImgs.forEach(img => img.classList.remove('content-item-img-active'));
    // 清除所有topNav-item的选中状态
    allTopNavItems.forEach(nav => nav.classList.remove('topNav-item-active'));

    // 激活当前项
    this.classList.add('container-nav-active');

    // 显示对应的顶部导航
    if (index < topNavItems.length) {
      topNavItems[index].classList.add('active');
    }

    // 显示对应的content
    if (index < contentDivs.length) {
      contentDivs[index].classList.add('active');
    }
  });
});

// topNav-item点击事件
//  const allTopNavItems = document.querySelectorAll('.topNav-item');
const allContentItemImgItems = document.querySelectorAll('.content-item-img-item');
allTopNavItems.forEach((item) => {
  item.addEventListener('click', function (e) {
    e.stopPropagation();
    // 移除所有topNav-item,content-img和content-item-img的active类
    allTopNavItems.forEach(nav => nav.classList.remove('topNav-item-active'));
    allContentImgs.forEach(img => img.classList.remove('content-img-active'));
    allContentItemImgs.forEach(img => img.classList.remove('content-item-img-active'));
    // 隐藏所有content-item-img-item
    allContentItemImgItems.forEach(img => img.classList.remove('content-item-img-item-active'));
    // 清除content-item的选中状态
    const contentItemInnerDivs = document.querySelectorAll('.content-item > div');
    contentItemInnerDivs.forEach(item => item.classList.remove('content-item-active'));
    // 激活当前项
    this.classList.add('topNav-item-active');

    // 找到所在的topNav-nav-item
    const parentNav = this.closest('.topNav-nav-item');
    const navIndex = Array.from(topNavItems).indexOf(parentNav);

    if (navIndex !== -1 && navIndex < contentDivs.length) {
      // 找到点击的item在当前nav中的索引
      const itemIndex = Array.from(parentNav.querySelectorAll('.topNav-item')).indexOf(this);

      // 获取对应的content
      const activeContent = contentDivs[navIndex];

      // 找到content内部的item div
      const contentItems = activeContent.querySelectorAll('.content-item');

      // 隐藏所有item,显示对应的
      contentItems.forEach((div) => {
        div.classList.remove('show');
      });
      // topNav-item索引0对应content-item索引1,索引1对应索引2,以此类推
      contentItems.forEach((div, index) => {
        if (index === itemIndex) {
          div.classList.add('show');
        }

      });

      // 切换对应的content-item-img
      const contentItemImgsInContent = activeContent.querySelectorAll('.content-item-img');
      contentItemImgsInContent.forEach((img, index) => {
        if (index === itemIndex) {
          img.classList.add('content-item-img-active');
        }
      });
    }
  });
});

// 首页按钮点击事件，清除一切选中状态
const homeBtn = document.querySelector('.header-nav div:first-child');
if (homeBtn) {
  homeBtn.addEventListener('click', function () {
    // 清除所有container-nav的选中状态
    const navItems = document.querySelectorAll('.container-nav');
    navItems.forEach(nav => nav.classList.remove('container-nav-active'));

    // 清除所有topNav-item的选中状态
    const allTopNavItems = document.querySelectorAll('.topNav-item');
    allTopNavItems.forEach(nav => nav.classList.remove('topNav-item-active'));

    // 清除所有topNav-nav-item的active状态
    const topNavItems = document.querySelectorAll('.topNav-nav-item');
    topNavItems.forEach(nav => nav.classList.remove('active'));

    // 隐藏topNav和所有content
    const topNav = document.querySelector('.topNav');
    topNav.classList.remove('show');

    const contentDivs = document.querySelectorAll('.content');
    contentDivs.forEach(content => content.classList.remove('active'));

    // 显示welcome
    const welcome = document.querySelector('.welcome');
    welcome.style.display = 'flex';

    // 清除所有content-item的show状态
    const allContentItems = document.querySelectorAll('.content-item');
    allContentItems.forEach(item => item.classList.remove('show'));

    // 清除所有content-item-img的active状态
    const allContentItemImgs = document.querySelectorAll('.content-item-img');
    allContentItemImgs.forEach(img => img.classList.remove('content-item-img-active'));

    // 清除所有content-item-img-item的active状态
    const allContentItemImgItems = document.querySelectorAll('.content-item-img-item');
    allContentItemImgItems.forEach(img => img.classList.remove('content-item-img-item-active'));

    // 清除所有content-item内部div的选中状态
    const contentItemInnerDivs = document.querySelectorAll('.content-item > div');
    contentItemInnerDivs.forEach(item => item.classList.remove('content-item-active'));

    // 隐藏loading
    const loading = document.querySelector('.loading');
    loading.classList.remove('show', 'active');

    // 隐藏content-img
    const allContentImgs = document.querySelectorAll('.content-img');
    allContentImgs.forEach(img => img.classList.remove('content-img-active'));
  });
}







// content-item内部div点击事件，显示loading
document.addEventListener('click', function (e) {
  const clickedDiv = e.target.closest('.content-item.show > div');
  // 确保点击的是当前显示的content-item内的div
  if (clickedDiv) {
    const loading = document.querySelector('.loading.show');
    loading.classList.add('active');
    //content-item内部div点击事件,点击后一直高亮
    const contentItemDivs = document.querySelectorAll('.content-item.show > div');
    contentItemDivs.forEach(item => item.classList.remove('content-item-active'));
    clickedDiv.classList.add('content-item-active');

    // 切换对应的content-item-img-item
    // 找到点击的div所在的content-item
    const parentContentItem = clickedDiv.closest('.content-item');
    // 找到点击的div在content-item中的索引
    const allDivsInItem = parentContentItem.querySelectorAll('div');
    const divIndex = Array.from(allDivsInItem).indexOf(clickedDiv);

    // 找到这个content-item后面紧跟的content-item-img-item元素
    let nextElement = parentContentItem.nextElementSibling;

    // 跳过content-item-img，找到content-item-img-item
    while (nextElement) {
      if (nextElement.classList.contains('content-item-img-item')) {
        // 检查是否有多个连续的content-item-img-item
        const imgItems = [];
        let current = nextElement;
        while (current && current.classList.contains('content-item-img-item')) {
          imgItems.push(current);
          current = current.nextElementSibling;
        }

        // 找到并隐藏紧邻的content-item-img
        let prevElement = imgItems[0].previousElementSibling;
        if (prevElement && prevElement.classList.contains('content-item-img')) {
          prevElement.classList.remove('content-item-img-active');
        }

        // 根据div索引激活对应的content-item-img-item
        imgItems.forEach((img, index) => {
          img.classList.remove('content-item-img-item-active');
          if (index === divIndex && divIndex < imgItems.length) {
            img.classList.add('content-item-img-item-active');
          }
        });
        break;
      }
      nextElement = nextElement.nextElementSibling;
    }
  }
});

const rightBottomBox = document.querySelector('.rightBottomBox');
rightBottomBox.addEventListener('click', function () {
  alert('想什么呢，没有！');
});












