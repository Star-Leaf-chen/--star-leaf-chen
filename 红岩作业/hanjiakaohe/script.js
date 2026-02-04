const asideNavItems = document.querySelectorAll('.aside__nav-item');
const page = document.querySelectorAll('.page');
// 侧边导航栏点击事件
asideNavItems.forEach((item, index) => {
  item.addEventListener('click', function () {
    // 移除所有 aside__nav-item和 page 的 active 类
    asideNavItems.forEach(i => i.classList.remove('active'));
    page.forEach(p => p.classList.remove('active'));
    // 为当前page和点击的 item 添加 active 类
    this.classList.add('active');
    if (index < page.length) {
      page[index].classList.add('active');
    }
  });
});
const featuredNavItems = document.querySelectorAll('.featured__nav-item');
const featuredSections = document.querySelectorAll('.featured-section');
// featured部分导航栏点击事件
featuredNavItems.forEach((item, index) => {
  item.addEventListener('click', function () {
    // 移除所有 featured__nav-item 和 featured-section 的 active 类
    featuredNavItems.forEach(i => i.classList.remove('active'));
    featuredSections.forEach(s => s.classList.remove('active'));
    // 为当前featured-section和点击的 item 添加 active 类
    this.classList.add('active');
    if (index < featuredSections.length) {
      featuredSections[index].classList.add('active');
    }
  });
});
const featuredSectionNavItems = document.querySelectorAll('.featured-section__nav');
const modules = document.querySelectorAll('.module');
// featured-section部分导航栏点击事件
featuredSectionNavItems.forEach((item, index) => {
  item.addEventListener('click', function () {
    // 移除所有 featured-section__nav 的 active 类
    featuredSectionNavItems.forEach(i => i.classList.remove('active'));
    modules.forEach(m => m.classList.remove('active'));
    // 为点击的 item 添加 active 类
    this.classList.add('active');
    if (index < modules.length) {
      modules[index].classList.add('active');
    }
  });
});





// ==================== release-list 轮播功能====================
class ReleaseListCarousel {
  constructor(releaseListId, scrollWrapperId, leftArrowId, rightArrowId) {
    this.releaseList = document.getElementById(releaseListId);
    this.scrollWrapper = document.getElementById(scrollWrapperId);
    this.arrowLeft = document.getElementById(leftArrowId);
    this.arrowRight = document.getElementById(rightArrowId);
    this.releaseScrolls = document.querySelectorAll(`#${releaseListId} .release-scroll`);

    this.currentSlide = 0;
    this.totalSlides = this.releaseScrolls.length;

    this.init();
  }

  updateArrows() {
    this.arrowLeft.disabled = this.currentSlide === 0;
    this.arrowRight.disabled = this.currentSlide === this.totalSlides - 1;

    if (this.arrowLeft.disabled) {
      this.arrowLeft.classList.add('disabled');
      this.arrowLeft.style.cursor = 'not-allowed';
    } else {
      this.arrowLeft.classList.remove('disabled');
      this.arrowLeft.style.cursor = 'pointer';
    }

    if (this.arrowRight.disabled) {
      this.arrowRight.classList.add('disabled');
      this.arrowRight.style.cursor = 'not-allowed';
    } else {
      this.arrowRight.classList.remove('disabled');
      this.arrowRight.style.cursor = 'pointer';
    }
  }

  goToSlide(index) {
    if (index < 0 || index >= this.totalSlides) return;

    this.currentSlide = index;
    const translateX = -(this.currentSlide * 100);
    this.scrollWrapper.style.transform = `translateX(${translateX}%)`;

    this.updateArrows();
  }

  nextSlide() {
    if (this.currentSlide < this.totalSlides - 1) {
      this.goToSlide(this.currentSlide + 1);
    }
  }

  prevSlide() {
    if (this.currentSlide > 0) {
      this.goToSlide(this.currentSlide - 1);
    }
  }

  init() {
    // 初始化箭头状态
    this.updateArrows();

    // 左箭头点击事件
    this.arrowLeft.addEventListener('click', () => {
      this.prevSlide();
    });

    // 右箭头点击事件
    this.arrowRight.addEventListener('click', () => {
      this.nextSlide();
    });

    // 左箭头视觉反馈
    this.arrowLeft.addEventListener('mouseover', () => {
      if (!this.arrowLeft.disabled) {
        this.arrowLeft.style.background = 'rgba(235, 235, 235, 0.95)';
      }
    });

    this.arrowLeft.addEventListener('mouseout', () => {
      this.arrowLeft.style.background = 'rgba(255, 255, 255, 0.9)';
    });

    // 右箭头视觉反馈
    this.arrowRight.addEventListener('mouseover', () => {
      if (!this.arrowRight.disabled) {
        this.arrowRight.style.background = 'rgba(235, 235, 235, 0.95)';
      }
    });

    this.arrowRight.addEventListener('mouseout', () => {
      this.arrowRight.style.background = 'rgba(255, 255, 255, 0.9)';
    });
  }
}

// 初始化所有release-list
document.addEventListener('DOMContentLoaded', function () {
  // 第一个release-list
  new ReleaseListCarousel('releaseList', 'scrollWrapper', 'arrowLeft', 'arrowRight');

  // 第二个release-list
  new ReleaseListCarousel('releaseList2', 'scrollWrapper2', 'arrowLeft2', 'arrowRight2');

  // ==================== 轮播图功能 ====================
  const carouselWrapper = document.getElementById('carouselWrapper');
  const carouselArrowLeft = document.getElementById('carouselArrowLeft');
  const carouselArrowRight = document.getElementById('carouselArrowRight');
  const carouselSlides = document.querySelectorAll('.carousel__slide');
  const indicators = document.querySelectorAll('.indicator');

  let currentCarouselSlide = 0;
  const totalCarouselSlides = carouselSlides.length;
  let autoPlayInterval;

  // 切换轮播图
  function goToCarouselSlide(index) {
    if (index < 0) {
      currentCarouselSlide = totalCarouselSlides - 1;
    } else if (index >= totalCarouselSlides) {
      currentCarouselSlide = 0;
    } else {
      currentCarouselSlide = index;
    }

    const translateX = -(currentCarouselSlide * 100);
    carouselWrapper.style.transform = `translateX(${translateX}%)`;

    // 更新指示器
    indicators.forEach((indicator, i) => {
      if (i === currentCarouselSlide) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });
  }

  // 下一张轮播图
  function nextCarouselSlide() {
    goToCarouselSlide(currentCarouselSlide + 1);
  }

  // 上一张轮播图
  function prevCarouselSlide() {
    goToCarouselSlide(currentCarouselSlide - 1);
  }

  // 轮播图左箭头点击事件
  carouselArrowLeft.addEventListener('click', function () {
    prevCarouselSlide();
    resetAutoPlay();
  });

  // 轮播图右箭头点击事件
  carouselArrowRight.addEventListener('click', function () {
    nextCarouselSlide();
    resetAutoPlay();
  });

  // 指示器点击事件
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', function () {
      goToCarouselSlide(index);
      resetAutoPlay();
    });
  });

  // 自动播放
  function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
      nextCarouselSlide();
    }, 5000);
  }

  // 重置自动播放
  function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
  }

  // 鼠标移入轮播图暂停自动播放
  const carousel = document.getElementById('carousel');
  carousel.addEventListener('mouseenter', function () {
    clearInterval(autoPlayInterval);
  });

  // 鼠标移出轮播图恢复自动播放
  carousel.addEventListener('mouseleave', function () {
    startAutoPlay();
  });

  // 初始化轮播图
  goToCarouselSlide(0);
  startAutoPlay();
});
