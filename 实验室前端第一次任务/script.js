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

// 侧边栏点击
navItems.forEach((item, index) => {
  item.addEventListener('click', function () {
    // 显示topNav容器
    topNav.classList.add('show');

    // 隐藏welcome
    welcome.style.display = 'none';

    // 显示loading
    const loading = document.querySelector('.loading');
    loading.classList.add('show');

    // 移除所有active类
    navItems.forEach(nav => nav.classList.remove('container-nav-active'));
    topNavItems.forEach(nav => nav.classList.remove('active'));
    contentDivs.forEach(content => content.classList.remove('active'));

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
const allTopNavItems = document.querySelectorAll('.topNav-item');
allTopNavItems.forEach((item) => {
  item.addEventListener('click', function (e) {
    e.stopPropagation();
    // 移除所有topNav-item的active类
    allTopNavItems.forEach(nav => nav.classList.remove('topNav-item-active'));
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
    }
  });
});

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
  }
});












