const list = document.querySelector('.list');
const bt = document.querySelector('#bt');
const tx = document.querySelector('#tx');
bt.addEventListener('click', function () {
  if (tx.value.trim() === '') {
    alert('评论不能为空');
    return;
  }
  const item = document.querySelector('.item');
  const newItem = item.cloneNode(true);
  newItem.style.display = 'block';
  const text = newItem.querySelector('.text');
  text.innerHTML = tx.value;
  list.appendChild(newItem);
  tx.value = ' ';
});
let deleteButton = null;
list.addEventListener('contextmenu', function (e) {
  e.preventDefault();
  const item = e.target.closest('.item');
  if (item && item.style.display !== 'none') {
    if (deleteButton) {
      deleteButton.remove();
    }

    deleteButton = document.createElement('button');
    deleteButton.className = 'deleteButton';
    deleteButton.textContent = '删除';
    deleteButton.style.position = 'fixed';
    deleteButton.style.left = e.clientX + 'px';
    deleteButton.style.top = e.clientY + 'px';


    deleteButton.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      item.remove();
      deleteButton.remove();
      deleteButton = null;
    });

    document.body.appendChild(deleteButton);
  }
});
document.addEventListener('click', function (e) {
  if (deleteButton && e.target !== deleteButton && !deleteButton.contains(e.target)) {
    deleteButton.remove();
    deleteButton = null;
  }
});

// 轮播图功能
const carousel = document.querySelector('.carousel');
if (carousel) {
  const items = carousel.querySelectorAll('.carousel-item');
  const prevBtn = carousel.querySelector('.carousel-prev');
  const nextBtn = carousel.querySelector('.carousel-next');
  const dots = carousel.querySelectorAll('.dot');
  let currentIndex = 0;
  let autoPlayInterval;

  function showSlide(index) {
    items.forEach((item, i) => {
      item.classList.toggle('active', i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    currentIndex = index;
  }

  function nextSlide() {
    const nextIndex = (currentIndex + 1) % items.length;
    showSlide(nextIndex);
  }

  function prevSlide() {
    const prevIndex = (currentIndex - 1 + items.length) % items.length;
    showSlide(prevIndex);
  }

  function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, 3000);
  }

  function stopAutoPlay() {
    clearInterval(autoPlayInterval);
  }

  prevBtn.addEventListener('click', () => {
    prevSlide();
    stopAutoPlay();
    startAutoPlay();
  });

  nextBtn.addEventListener('click', () => {
    nextSlide();
    stopAutoPlay();
    startAutoPlay();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      stopAutoPlay();
      startAutoPlay();
    });
  });

  carousel.addEventListener('mouseenter', stopAutoPlay);
  carousel.addEventListener('mouseleave', startAutoPlay);

  startAutoPlay();
}