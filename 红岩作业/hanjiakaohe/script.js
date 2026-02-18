//播放次数（例如：12345678 -> 1234.5万）
function formatPlayCount(count) {
  if (!count) return '0';
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万';
  }
  return count.toString();
}

// 获取请求头配置
function getAuthHeaders() {
  const token = localStorage.getItem('neteaseToken');
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

//歌曲时长
function formatDuration(ms) {
  if (!ms) return '0:00';
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
}

// 从图片URL提取主色调
function extractColorFromImage(imageUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = function() {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = 1;
      canvas.height = 1;
      ctx.drawImage(img, 0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      const darkFactor = 0.5;
      const rDark = Math.floor(r * darkFactor);
      const gDark = Math.floor(g * darkFactor);
      const bDark = Math.floor(b * darkFactor);
      resolve({
        light: `rgb(${r}, ${g}, ${b})`,
        dark: `rgb(${rDark}, ${gDark}, ${bDark})`
      });
    };

    img.onerror = function() {
      resolve({
        light: 'rgb(74, 31, 31)',
        dark: 'rgb(44, 18, 18)'
      });
    };

    img.src = imageUrl;
  });
}

// 应用颜色到卡片
async function applyColorToCard(card, imageUrl) {
  const colors = await extractColorFromImage(imageUrl);
  const infoDiv = card.querySelector('.info');
  if (infoDiv) {
    // 正常状态使用light，hover状态使用渐变色
    infoDiv.style.background = colors.light;
  }
  card.style.background = colors.light;
}
// 顶部搜索框
const headerInput = document.querySelector('header input');
const backButton = document.getElementById('backButton');

// 返回按钮点击事件（直接刷新页面）
backButton.addEventListener('click', () => {
  window.location.reload();
});
const searchSuggestion = document.querySelector('.search-suggestion');
const hotList = document.querySelector('.hot-list');

headerInput.addEventListener('focus', () => {
  headerInput.style.background = 'rgb(247, 249, 252)';
  setTimeout(() => {
    searchSuggestion.classList.add('active');
  }, 400);
});

// 搜索功能
headerInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const keywords = headerInput.value.trim();
    if (keywords) {
      performSearch(keywords);
      // 防止 Enter 键触发其他事件
      e.preventDefault();
    }
  }
});

// 执行搜索
function performSearch(keywords) {
  console.log('搜索关键词:', keywords);

  fetch(`http://localhost:3000/search?keywords=${encodeURIComponent(keywords)}`)
    .then(res => res.json())
    .then(res => {
      if (res.result?.songs?.length > 0) {
        console.log('第一首歌的数据:', res.result.songs[0]);
      }
      displaySearchResults(res);
    })
    .catch(err => {
      console.error('搜索失败:', err);
    });
}

// 显示搜索结果
function displaySearchResults(searchData) {
  // 清空热搜列表
  if (hotList) {
    hotList.innerHTML = '';
  }

  const hotListTitle = document.querySelector('.hot-list-title');
  if (hotListTitle) {
    hotListTitle.textContent = '搜索结果';
  }

  // 显示歌曲
  if (searchData.result && searchData.result.songs && searchData.result.songs.length > 0) {
    searchData.result.songs.forEach((song, index) => {
      const resultItem = document.createElement('div');
      resultItem.classList.add('hot-list-item');

      const rankSpan = document.createElement('span');
      rankSpan.classList.add('hot-list-rank');
      rankSpan.textContent = index + 1;

      const keywordSpan = document.createElement('span');
      keywordSpan.classList.add('hot-list-keyword');

      // 处理艺术家名称
      const artistNames = song.artists ? song.artists.map(a => a.name).join('/') :
                          song.ar ? song.ar.map(a => a.name).join('/') : '未知艺术家';

      keywordSpan.textContent = `${song.name || '未知歌曲'} - ${artistNames}`;

      resultItem.appendChild(rankSpan);
      resultItem.appendChild(keywordSpan);

      resultItem.addEventListener('click', () => {
        console.log('播放搜索结果歌曲:', song);
        console.log('歌曲对象完整数据:', JSON.stringify(song));

        // 处理专辑封面图片
        let albumImage = 'https://p3.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg';
        playSong(song, albumImage);

        // 播放后关闭搜索框
        headerInput.blur();
        searchSuggestion.classList.remove('active');
      });

      hotList.appendChild(resultItem);
    });
  }

  // 显示专辑
  if (searchData.result && searchData.result.albums && searchData.result.albums.length > 0) {
    // 可以扩展显示专辑逻辑
  }
}

headerInput.addEventListener('blur', () => {
  // 延迟隐藏，确保点击事件可以触发
  setTimeout(() => {
    headerInput.style.background = 'linear-gradient(to right, rgb(235, 240, 251), rgb(247, 238, 246))';
    searchSuggestion.classList.remove('active');
  }, 200);
});

// 默认关键词
headerInput.placeholder = '   搜索音乐、歌词、歌手';

// 获取默认搜索关键词
fetch(`http://localhost:3000/search/default`)
  .then(res => res.json())
  .then(res => {
    console.log('默认搜索关键词:', res);
    const showKeywords = res.data.showKeyword;
    headerInput.placeholder = showKeywords;
  });

// 热搜列表(简略)
fetch(`http://localhost:3000/search/hot`)
  .then(res => {
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.json();
  })
  .then(res => {
    console.log('热搜列表:', res);
    if (res && res.result && res.result.hots && res.result.hots.length > 0) {
      const hotKeywords = res.result.hots;

      // 清空现有内容
      if (hotList) {
        hotList.innerHTML = '';

        // 创建热搜列表项
        hotKeywords.forEach((item, index) => {
          const keywordItem = document.createElement('div');
          keywordItem.classList.add('hot-list-item');

          // 添加序号
          const rankSpan = document.createElement('span');
          rankSpan.classList.add('hot-list-rank');
          rankSpan.textContent = index + 1;

          // 添加关键词
          const keywordSpan = document.createElement('span');
          keywordSpan.classList.add('hot-list-keyword');
          keywordSpan.textContent = item.first;

          // 添加搜索量
          const scoreSpan = document.createElement('span');
          scoreSpan.classList.add('hot-list-score');
          scoreSpan.textContent = item.score || '';

          keywordItem.appendChild(rankSpan);
          keywordItem.appendChild(keywordSpan);
          keywordItem.appendChild(scoreSpan);

          // 点击热搜词执行搜索并播放第一首
          keywordItem.addEventListener('click', () => {
            const keyword = item.first;
            console.log('点击热搜词:', keyword);

            // 执行搜索
            fetch(`http://localhost:3000/search?keywords=${encodeURIComponent(keyword)}`)
              .then(res => res.json())
              .then(res => {
                console.log('热搜搜索结果:', res);
                if (res.result && res.result.songs && res.result.songs.length > 0) {
                  const firstSong = res.result.songs[0];

                  // 处理专辑封面图片
                  let albumImage = 'https://p3.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg';
                  playSong(firstSong, albumImage);
                  // 关闭搜索框
                  headerInput.value = keyword;
                  headerInput.blur();
                  searchSuggestion.classList.remove('active');
                } else {
                  console.error('没有找到相关歌曲');
                }
              })
              .catch(err => {
                console.error('热搜搜索失败:', err);
              });
          });

          hotList.appendChild(keywordItem);
        });
      }
    }
  })
  .catch(err => {
    console.error('获取热搜列表失败:', err);
    if (hotList) {
      hotList.innerHTML = '<div class="hot-list-item">暂无热搜数据</div>';
    }
  });



const asideNavItems = document.querySelectorAll('.aside__nav-item');
const page = document.querySelectorAll('.page');
const playlistPage = document.querySelector('.playlist-page');
// 侧边导航栏点击事件
asideNavItems.forEach((item, index) => {
  item.addEventListener('click', function () {
    // 移除所有 aside__nav-item和 page 的 active 类
    asideNavItems.forEach(i => i.classList.remove('active'));
    page.forEach(p => p.classList.remove('active'));
    playlistPage.classList.remove('active');
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
const nowPlayingBar = document.querySelector('.now-playing-bar');
document.addEventListener('DOMContentLoaded', function () {
  // 第一个release-list
  new ReleaseListCarousel('releaseList', 'scrollWrapper', 'arrowLeft', 'arrowRight');

  // 第二个release-list
  new ReleaseListCarousel('releaseList2', 'scrollWrapper2', 'arrowLeft2', 'arrowRight2');
});

// 推荐歌单（动态）
document.addEventListener('DOMContentLoaded', function () {
  const releaseScroll = document.querySelectorAll('.release-scroll');
  fetch(`http://localhost:3000/top/playlist`)
    .then(res => res.json())
    .then(res => {
      console.log('推荐歌单:', res);
      if (res && res.playlists && res.playlists.length > 0) {
        // 获取 #releaseList2 中的两个 .release-scroll
        const releaseList2Scrolls = document.querySelectorAll('#releaseList2 .release-scroll');

        // 第一个滚动区域（#releaseList2 中的第一个）：使用 res.playlists[0-9]
        const scroll1 = releaseList2Scrolls[0];
        if (scroll1) {
          const playlistCards1 = scroll1.querySelectorAll('.playlist-card');
          playlistCards1.forEach((card, index) => {
            if (res.playlists[index]) {
              const playlist = res.playlists[index];
              const imgElement = card.querySelector('img');
              const titleElement = card.querySelector('.title');
              const subtitleElement = card.querySelector('.subtitle');
              const countElement = card.querySelector('.play-count');
              if (imgElement) {
                imgElement.src = playlist.coverImgUrl;
                // 应用封面颜色到info背景
                applyColorToCard(card, playlist.coverImgUrl);
              }
              if (subtitleElement) {
                subtitleElement.textContent = playlist.name || '推荐歌单';
              }
              if (countElement) {
                countElement.textContent = formatPlayCount(playlist.playCount || 0);
              }

              // 添加点击事件 - 加载歌单详情
              card.addEventListener('click', () => {
                const playlistId = playlist.id;

                page.forEach(p => p.classList.remove('active'));
                if (playlistPage) {
                  playlistPage.classList.add('active');

                  // 获取专辑页面的元素
                  const albumImage = playlistPage.querySelector('.album-image');
                  const albumTitle = playlistPage.querySelector('.album-aside__title');
                  const albumProfile = playlistPage.querySelector('.album-aside__profile');
                  const albumInfo = playlistPage.querySelector('.album-aside__info');
                  const albumTracks = playlistPage.querySelector('.album-tracks');

                  // 更新专辑信息
                  if (albumImage) {
                    albumImage.src = playlist.coverImgUrl;
                  }
                  if (albumTitle) {
                    albumTitle.textContent = playlist.name;
                  }
                  if (albumProfile) {
                    albumProfile.textContent = playlist.description || playlist.copywriter || '';
                  }
                  if (albumInfo) {
                    albumInfo.innerHTML = `<div class="album-avatar"><img src="${playlist.creator.avatarUrl}" alt=""></div>` +
                      `<div class="album-aside__info-username">${playlist.creator.nickname || '未知用户'}</div>` +
                      `<div class="album-aside__info-time">${playlist.createTime ? new Date(playlist.createTime).toLocaleDateString() : '未知时间'}创建</div>`;
                  }

                  // 清空现有曲目列表
                  if (albumTracks) {
                    albumTracks.innerHTML = '';
                  }

                  // 获取歌单详情
                  fetch(`http://localhost:3000/playlist/detail?id=${playlistId}`)
                    .then(res => res.json())
                    .then(res => {
                      console.log('歌单内部详情:', res);
                      const playlistDetail = res.playlist;

                      // 处理歌单详情数据
                      if (playlistDetail) {
                        // 更新页面标题
                        document.title = playlistDetail.name || '歌单详情';

                        // 处理曲目列表数据
                        if (albumTracks && playlistDetail.tracks && playlistDetail.tracks.length > 0) {
                          playlistDetail.tracks.forEach((track, index) => {
                            const trackDiv = document.createElement('div');
                            trackDiv.className = 'track';
                            // 格式化歌曲时长
                            const duration = formatDuration(track.dt || track.duration);
                            // 获取艺术家名称
                            const artistNames = track.ar ? track.ar.map(a => a.name).join('/') : '未知艺术家';
                            track.like = track.like || '♡';
                           trackDiv.innerHTML = `
                        <div class="track__item track__index">${String(index + 1).padStart(2, '0')}</div>
                        <div class="track__item track__title"><div class="track__item-img"><img src="${track.al ? track.al.picUrl : ''}" alt=""></div><div><span>${track.name || '未知歌曲'}</span><br><span class="track__item-artist">${artistNames}</span></div></div>
                        <div class="track__item track__album">${track.al ? track.al.name : '未知专辑'}</div>
                        <div class="track__item track__like" style="padding-left: 10px; cursor: pointer;">${track.like}</div>
                        <div class="track__item">${duration}</div>
                      `;
                            const trackLike = trackDiv.querySelector('.track__like');
                            const trackIndex = trackDiv.querySelector('.track__index');
                            // 添加鼠标悬停效果
                            trackDiv.addEventListener('mouseenter', () => {
                              trackDiv.style.backgroundColor = 'white';
                              trackIndex.textContent = '▶';
                              trackIndex.addEventListener('click', (e) => {
                                e.stopPropagation();
                                playSong(track, playlistDetail.coverImgUrl, playlistDetail.tracks, index);
                              });
                            });
                            trackDiv.addEventListener('mouseleave', () => {
                              trackDiv.style.backgroundColor = 'rgb(247, 246, 247)';
                              trackIndex.textContent = String(index + 1).padStart(2, '0');
                            });
                            // 添加双击事件
                            trackDiv.addEventListener('dblclick', () => {
                              playSong(track, playlistDetail.coverImgUrl, playlistDetail.tracks, index);
                            });
                            if (trackLike) {
                              trackLike.addEventListener('click', (e) => {
                                e.stopPropagation(); // 防止触发track的点击事件
                                track.like = track.like === '♡' ? '❤' : '♡';
                                trackLike.textContent = track.like;
                                trackLike.classList.toggle('track__item-like');
                              });
                            }
                            albumTracks.appendChild(trackDiv);
                          });
                        }
                      }
                    }).catch(err => {
                      console.error('获取歌单详情失败:', err);
                    });
                }
              });
            }
          });
        }

        // 第二个滚动区域（#releaseList2 中的第二个）：使用 res.playlists[10-20]
        const scroll2 = releaseList2Scrolls[1];
        if (scroll2) {
          const playlistCards2 = scroll2.querySelectorAll('.playlist-card');
          playlistCards2.forEach((card, index) => {
            const dataIndex = 10 + index; // 从第10个开始
            if (res.playlists[dataIndex]) {
              const playlist = res.playlists[dataIndex];
              const imgElement = card.querySelector('img');
              const titleElement = card.querySelector('.title');
              const subtitleElement = card.querySelector('.subtitle');
              const countElement = card.querySelector('.play-count');
              if (imgElement) {
                imgElement.src = playlist.coverImgUrl;
                // 应用封面颜色到info背景
                applyColorToCard(card, playlist.coverImgUrl);
              }
              if (titleElement) {
                titleElement.textContent = playlist.name;
              }
              if (subtitleElement) {
                subtitleElement.textContent = playlist.description || '推荐歌单';
              }
              if (countElement) {
                countElement.textContent = formatPlayCount(playlist.playCount || 0);
              }

              // 添加点击事件 - 加载歌单详情
              card.addEventListener('click', () => {
                const playlistId = playlist.id;

                page.forEach(p => p.classList.remove('active'));
                if (playlistPage) {
                  playlistPage.classList.add('active');

                  // 获取专辑页面的元素
                  const albumImage = playlistPage.querySelector('.album-image');
                  const albumTitle = playlistPage.querySelector('.album-aside__title');
                  const albumProfile = playlistPage.querySelector('.album-aside__profile');
                  const albumInfo = playlistPage.querySelector('.album-aside__info');
                  const albumTracks = playlistPage.querySelector('.album-tracks');

                  // 更新专辑信息
                  if (albumImage) {
                    albumImage.src = playlist.coverImgUrl;
                  }
                  if (albumTitle) {
                    albumTitle.textContent = playlist.name;
                  }
                  if (albumProfile) {
                    albumProfile.textContent = playlist.description || playlist.copywriter || '';
                  }
                  if (albumInfo) {
                    albumInfo.innerHTML = `<div class="album-avatar"><img src="${playlist.creator.avatarUrl}" alt=""></div>` +
                      `<div class="album-aside__info-username">${playlist.creator.nickname || '未知用户'}</div>` +
                      `<div class="album-aside__info-time">${playlist.createTime ? new Date(playlist.createTime).toLocaleDateString() : '未知时间'}创建</div>`;
                  }

                  // 清空现有曲目列表
                  if (albumTracks) {
                    albumTracks.innerHTML = '';
                  }

                  // 获取歌单详情
                  fetch(`http://localhost:3000/playlist/detail?id=${playlistId}`)
                    .then(res => res.json())
                    .then(res => {
                      console.log('歌单内部详情:', res);
                      const playlistDetail = res.playlist;

                      // 处理歌单详情数据
                      if (playlistDetail) {
                        // 更新页面标题
                        document.title = playlistDetail.name || '歌单详情';

                        // 处理曲目列表数据
                        if (albumTracks && playlistDetail.tracks && playlistDetail.tracks.length > 0) {
                          playlistDetail.tracks.forEach((track, index) => {
                            const trackDiv = document.createElement('div');
                            trackDiv.className = 'track';
                            // 格式化歌曲时长
                            const duration = formatDuration(track.dt || track.duration);
                            // 获取艺术家名称
                            const artistNames = track.ar ? track.ar.map(a => a.name).join('/') : '未知艺术家';
                            track.like = track.like || '♡';
                            trackDiv.innerHTML = `
                        <div class="track__item track__index">${String(index + 1).padStart(2, '0')}</div>
                        <div class="track__item track__title"><div class="track__item-img"><img src="${track.al ? track.al.picUrl : ''}" alt=""></div><div><span>${track.name || '未知歌曲'}</span><br><span class="track__item-artist">${artistNames}</span></div></div>
                        <div class="track__item track__album">${track.al ? track.al.name : '未知专辑'}</div>
                        <div class="track__item track__like" style="padding-left: 10px; cursor: pointer;">${track.like}</div>
                        <div class="track__item">${duration}</div>
                      `;
                            const trackLike = trackDiv.querySelector('.track__like');
                            const trackIndex = trackDiv.querySelector('.track__index');
                            // 添加鼠标悬停效果
                            trackDiv.addEventListener('mouseenter', () => {
                              trackDiv.style.backgroundColor = 'white';
                              trackIndex.textContent = '▶';
                              trackIndex.addEventListener('click', (e) => {
                                e.stopPropagation();
                                playSong(track, playlistDetail.coverImgUrl, playlistDetail.tracks, index);
                              });
                            });
                            trackDiv.addEventListener('mouseleave', () => {
                              trackDiv.style.backgroundColor = 'rgb(247, 246, 247)';
                              trackIndex.textContent = String(index + 1).padStart(2, '0');
                            });
                            // 添加双击事件
                            trackDiv.addEventListener('dblclick', () => {
                              playSong(track, playlistDetail.coverImgUrl, playlistDetail.tracks, index);
                            });
                            if (trackLike) {
                              trackLike.addEventListener('click', (e) => {
                                e.stopPropagation(); // 防止触发track的点击事件
                                track.like = track.like === '♡' ? '❤' : '♡';
                                trackLike.textContent = track.like;
                                trackLike.classList.toggle('track__item-like');
                              });
                            }
                            albumTracks.appendChild(trackDiv);
                          });
                        }
                      }
                    }).catch(err => {
                      console.error('获取歌单详情失败:', err);
                    });
                }
              });
            }
          });
        }
      }
    })
    .catch(err => {
      console.error('获取歌单内容失败:', err);
    });
});

// ==================== 轮播图功能 ====================
document.addEventListener('DOMContentLoaded', function () {
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


// 歌单广场（静态） 点击playlist-card=>显示playlist-page
const playlistCards = document.querySelectorAll('.playlist-card');
playlistCards.forEach((card) => {
  card.addEventListener('mouseenter', () => {
    const infoDiv = card.querySelector('.playlist-card .info');
    const titleDiv = card.querySelector('.playlist-card .title');
    const subtitleDiv = card.querySelector('.playlist-card .subtitle');
    if (titleDiv) titleDiv.classList.add('hover');
    if (infoDiv) infoDiv.classList.add('hover');
    if (subtitleDiv) subtitleDiv.classList.add('hover');
  });
  card.addEventListener('mouseleave', () => {
    const infoDiv = card.querySelector('.playlist-card .info');
    const titleDiv = card.querySelector('.playlist-card .title');
    const subtitleDiv = card.querySelector('.playlist-card .subtitle');
    if (titleDiv) titleDiv.classList.remove('hover');
    if (infoDiv) infoDiv.classList.remove('hover');
    if (subtitleDiv) subtitleDiv.classList.remove('hover');
  });
  card.addEventListener('click', () => {
    page.forEach(p => p.classList.remove('active'));
    if (playlistPage) {
      playlistPage.classList.add('active');
    }
  });
});


// 歌单广场(动态 获取内容)
const playlistGrid = document.querySelector('.playlist-grid');
fetch(`http://localhost:3000/top/playlist/highquality`)
  .then(res => res.json())
  .then(res => {
    console.log('歌单广场:', res);

    // 清空现有的 playlist-card
    playlistGrid.innerHTML = '';

    // 遍历所有数据，动态创建 playlist-card
    if (res && res.playlists && res.playlists.length > 0) {
      res.playlists.forEach(playlist => {
        const card = document.createElement('div');
        card.classList.add('playlist-card');
        card.innerHTML = `
          <img src="${playlist.coverImgUrl}" alt="${playlist.name}">
          <div class="play-count">${formatPlayCount(playlist.playCount)}</div>
          <div class="play-button">▶</div>
          <div class="info">
            <div class="title">${playlist.name}</div>
            <div class="subtitle">${playlist.copywriter || ''}</div>
          </div>
        `;

        // 应用封面颜色到info背景
        applyColorToCard(card, playlist.coverImgUrl);
        // 添加鼠标悬停效果
        card.addEventListener('mouseenter', () => {
          const infoDiv = card.querySelector('.info');
          const titleDiv = card.querySelector('.title');
          const subtitleDiv = card.querySelector('.subtitle');
          titleDiv.classList.add('hover');
          infoDiv.classList.add('hover');
          subtitleDiv.classList.add('hover');
          extractColorFromImage(playlist.coverImgUrl).then(colors => {
            infoDiv.style.background = `linear-gradient(to top, ${colors.dark}, ${colors.light}, transparent)`;
          });
        });

        card.addEventListener('mouseleave', () => {
          const infoDiv = card.querySelector('.info');
          const titleDiv = card.querySelector('.title');
          const subtitleDiv = card.querySelector('.subtitle');
          titleDiv.classList.remove('hover');
          infoDiv.classList.remove('hover');
          subtitleDiv.classList.remove('hover');
          extractColorFromImage(playlist.coverImgUrl).then(colors => {
            infoDiv.style.background = colors.light;
          });
        });

        // 添加点击事件 - 加载专辑详情
        card.addEventListener('click', () => {
          const playlistId = playlist.id; // 使用当前歌单的ID

          page.forEach(p => p.classList.remove('active'));
          if (playlistPage) {
            playlistPage.classList.add('active');

            // 获取专辑页面的元素
            const albumImage = playlistPage.querySelector('.album-image');
            const albumTitle = playlistPage.querySelector('.album-aside__title');
            const albumProfile = playlistPage.querySelector('.album-aside__profile');
            const albumInfo = playlistPage.querySelector('.album-aside__info');
            const albumTracks = playlistPage.querySelector('.album-tracks');

            // 更新专辑信息
            if (albumImage) {
              albumImage.src = playlist.coverImgUrl;
            }
            if (albumTitle) {
              albumTitle.textContent = playlist.name;
            }
            if (albumProfile) {
              albumProfile.textContent = playlist.description || playlist.copywriter || '';
            }
            if (albumInfo) {
              albumInfo.innerHTML = `<div class="album-avatar"><img src="${playlist.creator.avatarUrl}" alt=""></div>` +

                `<div class="album-aside__info-username">${playlist.creator.nickname || '未知用户'}</div>` +

                `<div class="album-aside__info-time">${playlist.createTime ? new Date(playlist.createTime).toLocaleDateString() : '未知时间'}创建</div>`;
            }

            // 清空现有曲目列表
            if (albumTracks) {
              albumTracks.innerHTML = '';
            }

            // 获取歌单详情
            fetch(`http://localhost:3000/playlist/detail?id=${playlistId}`)
              .then(res => res.json())
              .then(res => {
                console.log('歌单内部详情:', res);
                const playlist = res.playlist;

                // 处理歌单详情数据
                if (playlist) {
                  // 更新页面标题
                  document.title = playlist.name || '歌单详情';

                  // 处理曲目列表数据
                  if (albumTracks && playlist.tracks && playlist.tracks.length > 0) {
                    playlist.tracks.forEach((track, index) => {
                      const trackDiv = document.createElement('div');
                      trackDiv.className = 'track';
                      // 格式化歌曲时长
                      const duration = formatDuration(track.dt || track.duration);
                      // 获取艺术家名称
                      const artistNames = track.ar ? track.ar.map(a => a.name).join('/') : '未知艺术家';
                      track.like = track.like || '♡';
                      trackDiv.innerHTML = `
                        <div class="track__item track__index">${String(index + 1).padStart(2, '0')}</div>
                        <div class="track__item track__title"><div class="track__item-img"><img src="${track.al ? track.al.picUrl : ''}" alt=""></div><div><span>${track.name || '未知歌曲'}</span><br><span class="track__item-artist">${artistNames}</span></div></div>
                        <div class="track__item track__album">${track.al ? track.al.name : '未知专辑'}</div>
                        <div class="track__item track__like" style="padding-left: 10px; cursor: pointer;">${track.like}</div>
                        <div class="track__item">${duration}</div>
                      `;
                      const trackLike = trackDiv.querySelector('.track__like');
                      const trackIndex = trackDiv.querySelector('.track__index');
                      // 添加鼠标悬停效果
                      trackDiv.addEventListener('mouseenter', () => {
                        trackDiv.style.backgroundColor = 'white';
                        trackIndex.textContent = '▶';
                        trackIndex.addEventListener('click', (e) => {
                          e.stopPropagation();
                          playSong(track, playlist.coverImgUrl, playlist.tracks, index);
                        });
                      });
                      trackDiv.addEventListener('mouseleave', () => {
                        trackDiv.style.backgroundColor = 'rgb(247, 246, 247)';
                        trackIndex.textContent = String(index + 1).padStart(2, '0');
                      });
                      // 添加双击事件
                      trackDiv.addEventListener('dblclick', () => {
                        playSong(track, playlist.coverImgUrl, playlist.tracks, index);
                      });
                      if (trackLike) {
                        trackLike.addEventListener('click', (e) => {
                          e.stopPropagation(); // 防止触发track的点击事件
                          track.like = track.like === '♡' ? '❤' : '♡';
                          trackLike.textContent = track.like;
                          trackLike.classList.toggle('track__item-like');
                        });
                      }
                      albumTracks.appendChild(trackDiv);
                    });
                  }
                }
              }).catch(err => {
                console.error('获取歌单详情失败:', err);
              });
          }
        });

        // 将卡片添加到网格中
        playlistGrid.appendChild(card);
      });
    }

  })
  .catch(err => {
    console.error('获取歌单内容失败:', err);
  });

// 格式化播放次数（例如：12345678 -> 1234.5万）
function formatPlayCount(count) {
  if (!count) return '0';
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万';
  }
  return count.toString();
}

// 格式化歌曲时长（毫秒转 mm:ss）
function formatDuration(ms) {
  if (!ms) return '0:00';
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
}

// 歌单内容页面（playlist-page）

const albumNavItems = document.querySelectorAll('.album-nav__item');


albumNavItems.forEach(item => {
  item.addEventListener('click', () => {
    albumNavItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
  });
});

// 底部播放器(now-playing-bar)
const audio = document.getElementById('audio-player');
const nowPlayingBarCover = nowPlayingBar.querySelector('.now-playing-bar__cover img');
const nowPlayingBarTitle = nowPlayingBar.querySelector('.now-playing-bar__title');
const nowPlayingBarArtist = nowPlayingBar.querySelector('.now-playing-bar__artist');
const nowPlayingBarControls = nowPlayingBar.querySelector('.now-playing-bar__controls');
const nowPlayingBarPlayButton = nowPlayingBar.querySelector('.button-isPlaying');
const nowPlayingBarPauseButton = nowPlayingBarControls.querySelector('.button-isPlaying:nth-child(6)');
const nowPlayingBarLikeButton = nowPlayingBar.querySelector('.now-playing-bar__controls .button-like');
const nowPlayingBarPrevButton = nowPlayingBar.querySelector('.button-prev');
const nowPlayingBarNextButton = nowPlayingBar.querySelector('.button-next');
const nowPlayingBarProgress = nowPlayingBar.querySelector('.now-playing-bar__progress');
const musicPlayerPage = document.querySelector('.music-player-page');
// 点击底部播放器歌曲封面，显示歌曲歌词
const nowPlayingBarCoverElement = nowPlayingBar.querySelector('.now-playing-bar__cover');
nowPlayingBarCoverElement.addEventListener('click', () => {
  musicPlayerPage.classList.add('active');
  musicPlayerPage.classList.remove('closing');
  nowPlayingBar.classList.remove('active');
});

// 点击音乐播放器页眉收缩按钮，反向移动
const musicPlayerPageShrinkButton = document.querySelector('.music-player-page__header-shrink');
musicPlayerPageShrinkButton.addEventListener('click', () => {
  musicPlayerPage.classList.remove('active');
  musicPlayerPage.classList.add('closing');
  setTimeout(() => {
    musicPlayerPage.classList.remove('closing');
    nowPlayingBar.classList.add('active');
  }, 300);
});
// 创建进度条时间提示
const progressTooltip = document.createElement('div');
progressTooltip.className = 'progress-tooltip';
nowPlayingBarProgress.appendChild(progressTooltip);

let currentTrack = null;
let currentTrackList = [];
let currentTrackIndex = 0;
let currentAlbumCover = null;



// 鼠标经过进度条，上方出现黑影
nowPlayingBarProgress.addEventListener('mousemove', (e) => {
  nowPlayingBar.classList.add('hover');
});


nowPlayingBarProgress.addEventListener('mouseleave', () => {
  nowPlayingBar.classList.remove('hover');
});

// 喜欢按钮事件
nowPlayingBarLikeButton.like = '♡';
nowPlayingBarLikeButton.addEventListener('click', (e) => {
  e.stopPropagation();
  nowPlayingBarLikeButton.like = nowPlayingBarLikeButton.like === '♡' ? '❤' : '♡';
  nowPlayingBarLikeButton.textContent = nowPlayingBarLikeButton.like;
  nowPlayingBarLikeButton.classList.toggle('button-like--active');
});

// 播放歌曲函数
function playSong(track, albumImage, trackList = null, index = null, hideNowPlayingBar = false) {
  currentTrack = track;
  currentAlbumCover = albumImage;

  // 如果传入了播放列表和索引
  if (trackList && index !== null) {
    currentTrackList = trackList;
    currentTrackIndex = index;
  }

  // 更新播放器信息
  console.log('更新底部播放器信息');
  console.log('nowPlayingBarTitle:', nowPlayingBarTitle);
  console.log('nowPlayingBarArtist:', nowPlayingBarArtist);
  console.log('nowPlayingBarCover:', nowPlayingBarCover);

  if (nowPlayingBarTitle) {
    nowPlayingBarTitle.textContent = track.name || '未知歌曲';
    console.log('设置歌曲标题:', track.name);
  } else {
    console.error('找不到 nowPlayingBarTitle 元素');
  }

  if (nowPlayingBarArtist) {
    // 兼容不同的艺术家数据格式: ar 或 artists
    const artistNames = track.artists ? track.artists.map(a => a.name).join('/') :
                        track.ar ? track.ar.map(a => a.name).join('/') : '未知艺术家';
    nowPlayingBarArtist.textContent = artistNames;
    console.log('设置艺术家:', artistNames);
  } else {
    console.error('找不到 nowPlayingBarArtist 元素');
  }

  let coverImage = null;
  if (track.picUrl) {
    coverImage = track.picUrl;
  }
  else if (track.al?.picUrl) {
    coverImage = track.al.picUrl;
  }
  else if (track.album?.picUrl) {
    coverImage = track.album.picUrl;
  }
  else if (track.art?.picUrl) {
    coverImage = track.art.picUrl;
  }
  else if (albumImage) {
    coverImage = albumImage;
  }
  
  if (nowPlayingBarCover && coverImage) {
    nowPlayingBarCover.src = coverImage;
    console.log('设置封面:', coverImage);
  } else {
    console.error('找不到 nowPlayingBarCover 元素或 coverImage 为空');
  }

  // 更新 music-player-page 的信息
  const musicPlayerPageTitle = document.querySelector('.music-player-page__title');
  const musicPlayerPageCover = document.querySelector('.music-player-page__cover img');
  const musicPlayerPageCoverDiv = document.querySelector('.music-player-page__cover');
  const musicPlayerPageArtist = document.querySelector('.music-player-page__info-artist');
  const musicPlayerPageAlbum = document.querySelector('.music-player-page__info-album');

  if (musicPlayerPageTitle) {
    musicPlayerPageTitle.textContent = track.name || '未知歌曲';
  }

  if (musicPlayerPageCover && coverImage) {
    musicPlayerPageCover.src = coverImage;
  }

  // 停止封面旋转,等待播放按钮点击
  if (musicPlayerPageCover) {
    musicPlayerPageCover.classList.remove('active');
  }

  if (musicPlayerPageCoverDiv) {
    musicPlayerPageCoverDiv.classList.remove('active');
  }



  if (musicPlayerPageArtist) {

    const artistNames = '歌手：' + (track.artists ? track.artists.map(a => a.name).join('/') :

                        track.ar ? track.ar.map(a => a.name).join('/') : '未知歌手');
    musicPlayerPageArtist.textContent = artistNames;
  }



  if (musicPlayerPageAlbum) {

    const albumName = '专辑：' + track.al?.name || track.album?.name || track.art?.name || '未知专辑';
    musicPlayerPageAlbum.textContent = albumName;
  }

  // 更新音乐播放器页面的控制栏信息
  updateMusicNowPlayingBar(track, coverImage);

  // 获取歌曲播放地址
  fetch(`http://localhost:3000/song/url/v1?id=${track.id}&level=exhigh`)
    .then(res => res.json())
    .then(res => {
      console.log('歌曲播放地址:', res);
      if (res && res.data && res.data[0] && res.data[0].url) {
        const songUrl = res.data[0].url;
        audio.src = songUrl;
        audio.play().then(() => {
          // 如果不是在歌词页面，则显示底部播放器
          if (!hideNowPlayingBar) {
            nowPlayingBar.classList.add('active');
          }
          nowPlayingBarPlayButton.classList.remove('active');
          nowPlayingBarPauseButton.classList.add('active');
          if (nowPlayingBarCover) nowPlayingBarCover.classList.add('active');

          // 开始 music-player-page 的封面旋转
          const musicPlayerPageCover = document.querySelector('.music-player-page__cover img');
          const musicPlayerPageCoverDiv = document.querySelector('.music-player-page__cover');
          if (musicPlayerPageCover) {
            musicPlayerPageCover.classList.add('active');
          }
          if (musicPlayerPageCoverDiv) {
            musicPlayerPageCoverDiv.classList.add('active');
          }
        }).catch(err => {
          console.error('播放失败:', err);
        });
      } else {
        console.error('无法获取歌曲播放地址');
      }
    }).catch(err => {
      console.error('获取歌曲播放地址失败:', err);
    });
}

// 播放上一首
function playPrevSong() {
  if (currentTrackList.length > 0) {
    currentTrackIndex = (currentTrackIndex - 1 + currentTrackList.length) % currentTrackList.length;
    const prevTrack = currentTrackList[currentTrackIndex];
    const musicPlayerPage = document.querySelector('.music-player-page');
    const isMusicPlayerPageActive = musicPlayerPage && musicPlayerPage.classList.contains('active');

    playSong(prevTrack, currentAlbumCover, currentTrackList, currentTrackIndex, isMusicPlayerPageActive);
  }
}

// 播放下一首
function playNextSong() {
  if (currentTrackList.length > 0) {
    currentTrackIndex = (currentTrackIndex + 1) % currentTrackList.length;
    const nextTrack = currentTrackList[currentTrackIndex];
    const musicPlayerPage = document.querySelector('.music-player-page');
    const isMusicPlayerPageActive = musicPlayerPage && musicPlayerPage.classList.contains('active');

    playSong(nextTrack, currentAlbumCover, currentTrackList, currentTrackIndex, isMusicPlayerPageActive);
  }
}

// 播放按钮点击事件
nowPlayingBarPlayButton.addEventListener('click', () => {
  audio.play();
  nowPlayingBarPlayButton.classList.remove('active');
  nowPlayingBarPauseButton.classList.add('active');
  if (nowPlayingBarCover) nowPlayingBarCover.classList.add('active');

  // 开始 music-player-page 的封面旋转
  const musicPlayerPageCover = document.querySelector('.music-player-page__cover img');
  const musicPlayerPageCoverDiv = document.querySelector('.music-player-page__cover');
  if (musicPlayerPageCover) {
    musicPlayerPageCover.classList.add('active');
  }
  if (musicPlayerPageCoverDiv) {
    musicPlayerPageCoverDiv.classList.add('active');
  }

  // 同步更新 music-now-playing-bar 的状态
  if (musicNowPlayingBarPlayButton) musicNowPlayingBarPlayButton.classList.add('active');
  if (musicNowPlayingBarPauseButton) musicNowPlayingBarPauseButton.classList.remove('active');
});

// 暂停按钮点击事件
nowPlayingBarPauseButton.addEventListener('click', () => {
  audio.pause();
  nowPlayingBarPauseButton.classList.remove('active');
  nowPlayingBarPlayButton.classList.add('active');
  if (nowPlayingBarCover) nowPlayingBarCover.classList.remove('active');

  // 停止 music-player-page 的封面旋转
  const musicPlayerPageCover = document.querySelector('.music-player-page__cover img');
  const musicPlayerPageCoverDiv = document.querySelector('.music-player-page__cover');
  if (musicPlayerPageCover) {
    musicPlayerPageCover.classList.remove('active');
  }
  if (musicPlayerPageCoverDiv) {
    musicPlayerPageCoverDiv.classList.remove('active');
  }

  // 同步更新 music-now-playing-bar 的状态
  if (musicNowPlayingBarPlayButton) musicNowPlayingBarPlayButton.classList.remove('active');
  if (musicNowPlayingBarPauseButton) musicNowPlayingBarPauseButton.classList.add('active');
});

// 音频播放结束事件
audio.addEventListener('ended', () => {
  nowPlayingBarPauseButton.classList.remove('active');
  nowPlayingBarPlayButton.classList.add('active');
  if (nowPlayingBarCover) nowPlayingBarCover.classList.remove('active');

  // 停止 music-player-page 的封面旋转
  const musicPlayerPageCover = document.querySelector('.music-player-page__cover img');
  const musicPlayerPageCoverDiv = document.querySelector('.music-player-page__cover');
  if (musicPlayerPageCover) {
    musicPlayerPageCover.classList.remove('active');
  }
  if (musicPlayerPageCoverDiv) {
    musicPlayerPageCoverDiv.classList.remove('active');
  }

  // 自动播放下一首
  playNextSong();
});

// 更新进度条
audio.addEventListener('timeupdate', () => {
  if (audio.duration > 0) {
    const progress = (audio.currentTime / audio.duration) * 100;

    // 更新 now-playing-bar 的进度条
    if (nowPlayingBarProgress) {
      nowPlayingBarProgress.style.setProperty('--progress', `${progress}%`);

      // 更新时间提示
      const currentTimeStr = formatDuration(audio.currentTime * 1000);
      const durationStr = formatDuration(audio.duration * 1000);
      progressTooltip.textContent = `${currentTimeStr} / ${durationStr}`;
      progressTooltip.style.left = `${progress}%`;
    }

    // 更新 music-now-playing-bar 的进度条
    if (musicNowPlayingBarProgress) {
      musicNowPlayingBarProgress.style.setProperty('--progress', `${progress}%`);

      // 更新时间提示
      const musicProgressTooltip = musicNowPlayingBarProgress.querySelector('.progress-tooltip');
      if (musicProgressTooltip) {
        const currentTimeStr = formatDuration(audio.currentTime * 1000);
        const durationStr = formatDuration(audio.duration * 1000);
        musicProgressTooltip.textContent = `${currentTimeStr} / ${durationStr}`;
        musicProgressTooltip.style.left = `${progress}%`;
      }
    }
  }
});

// 音频加载时重置进度条
audio.addEventListener('loadedmetadata', () => {
  if (nowPlayingBarProgress) {
    nowPlayingBarProgress.style.setProperty('--progress', '0%');
  }
  if (musicNowPlayingBarProgress) {
    musicNowPlayingBarProgress.style.setProperty('--progress', '0%');
  }
});

// 点击进度条跳转
if (nowPlayingBarProgress) {
  nowPlayingBarProgress.addEventListener('click', (e) => {
    if (audio.duration > 0) {
      const rect = nowPlayingBarProgress.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      audio.currentTime = percentage * audio.duration;
    }
  });
}

// 上一首按钮点击事件
if (nowPlayingBarPrevButton) {
  nowPlayingBarPrevButton.addEventListener('click', () => {
    playPrevSong();
  });
}

// 下一首按钮点击事件
if (nowPlayingBarNextButton) {
  nowPlayingBarNextButton.addEventListener('click', () => {
    playNextSong();
  });
}

// 歌词页面（music-player-page）
const musicPlayerPageHeaderShrink = document.querySelector('.music-player-page__header-shrink');
const musicPlayerPageCover = document.querySelector('.music-player-page__cover');
const musicPlayerPageArticle = document.querySelector('.music-player-page__article');

// 保持封面圆形
function updateCoverSize() {
  if (musicPlayerPageCover && musicPlayerPageArticle) {
    // 确保宽度和高度保持一致，保持圆形
    const coverWidth = getComputedStyle(musicPlayerPageCover).width;
    musicPlayerPageCover.style.height = coverWidth;
  }
}

// 窗口大小变化时更新封面尺寸
window.addEventListener('resize', updateCoverSize);

// 音乐播放器页面打开动画结束后更新封面尺寸
musicPlayerPage.addEventListener('animationend', (e) => {
  if (e.animationName === 'slideUp') {
    updateCoverSize();
  }
});

// 音乐播放器页面的控制栏 (music-now-playing-bar)
const musicNowPlayingBar = document.querySelector('.music-now-playing-bar');
const musicNowPlayingBarCover = musicNowPlayingBar?.querySelector('.now-playing-bar__cover img');
const musicNowPlayingBarTitle = musicNowPlayingBar?.querySelector('.music-now-playing-bar__title');
const musicNowPlayingBarArtist = musicNowPlayingBar?.querySelector('.music-now-playing-bar__artist');
const musicNowPlayingBarPlayButton = musicNowPlayingBar?.querySelector('.music-now-playing-bar__play');
const musicNowPlayingBarPauseButton = musicNowPlayingBar?.querySelector('.music-now-playing-bar__pause');
const musicNowPlayingBarPrevButton = musicNowPlayingBar?.querySelector('.music-now-playing-bar__prev');
const musicNowPlayingBarNextButton = musicNowPlayingBar?.querySelector('.music-now-playing-bar__next');
const musicNowPlayingBarLikeButton = musicNowPlayingBar?.querySelector('.button-like');

// 播放按钮
if (musicNowPlayingBarPlayButton) {
  musicNowPlayingBarPlayButton.addEventListener('click', () => {
    audio.play();
    musicNowPlayingBarPlayButton.classList.remove('active');
    musicNowPlayingBarPauseButton.classList.add('active');
    if (nowPlayingBarPlayButton) nowPlayingBarPlayButton.classList.remove('active');
    if (nowPlayingBarPauseButton) nowPlayingBarPauseButton.classList.add('active');
    if (nowPlayingBarCover) nowPlayingBarCover.classList.add('active');
    // 开始 music-player-page 的封面旋转
    const musicPlayerPageCover = document.querySelector('.music-player-page__cover img');
    const musicPlayerPageCoverDiv = document.querySelector('.music-player-page__cover');
    if (musicPlayerPageCover) {
      musicPlayerPageCover.classList.add('active');
    }
    if (musicPlayerPageCoverDiv) {
      musicPlayerPageCoverDiv.classList.add('active');
    }
  });
}

// 暂停按钮
if (musicNowPlayingBarPauseButton) {
  musicNowPlayingBarPauseButton.addEventListener('click', () => {
    audio.pause();
    musicNowPlayingBarPauseButton.classList.remove('active');
    musicNowPlayingBarPlayButton.classList.add('active');
    if (nowPlayingBarPlayButton) nowPlayingBarPlayButton.classList.add('active');
    if (nowPlayingBarPauseButton) nowPlayingBarPauseButton.classList.remove('active');
    if (nowPlayingBarCover) nowPlayingBarCover.classList.remove('active');
    // 停止 music-player-page 的封面旋转
    const musicPlayerPageCover = document.querySelector('.music-player-page__cover img');
    const musicPlayerPageCoverDiv = document.querySelector('.music-player-page__cover');
    if (musicPlayerPageCover) {
      musicPlayerPageCover.classList.remove('active');
    }
    if (musicPlayerPageCoverDiv) {
      musicPlayerPageCoverDiv.classList.remove('active');
    }
  });
}

// 上一首按钮
if (musicNowPlayingBarPrevButton) {
  musicNowPlayingBarPrevButton.addEventListener('click', () => {
    playPrevSong();
  });
}

// 下一首按钮
if (musicNowPlayingBarNextButton) {
  musicNowPlayingBarNextButton.addEventListener('click', () => {
    playNextSong();
  });
}

// 喜欢按钮
  if (musicNowPlayingBarLikeButton) {
    musicNowPlayingBarLikeButton.like = '♡';
    musicNowPlayingBarLikeButton.addEventListener('click', () => {
      musicNowPlayingBarLikeButton.like = musicNowPlayingBarLikeButton.like === '♡' ? '❤' : '♡';
      musicNowPlayingBarLikeButton.textContent = musicNowPlayingBarLikeButton.like;
      musicNowPlayingBarLikeButton.classList.toggle('button-like--active');
    });
  }

  // 用户信息显示
  const userAvatar = document.getElementById('userAvatar');
  const userName = document.getElementById('userName');
  const userVip = document.getElementById('userVip');

  // 更新用户信息显示
  function updateUserInfo(user) {
    if (user && user.profile) {
      userName.textContent = user.profile.nickname || '用户';
      if (userAvatar) {
        userAvatar.querySelector('img').src = user.profile.avatarUrl || '图片/用户头像.png';
      }
      if (userVip) {
        userVip.style.display = user.vipType ? 'block' : 'none';
      }
    } else {
      userName.textContent = '未登录';
      if (userAvatar) {
        userAvatar.querySelector('img').src = '图片/用户头像.png';
      }
      if (userVip) {
        userVip.style.display = 'none';
      }
    }
  }

  // 登录弹窗
  const loginModal = document.getElementById('loginModal');
  const loginModalClose = document.getElementById('loginModalClose');
  const userAvatarElement = document.getElementById('userAvatar');
  const userNameElement = document.getElementById('userName');

  // 显示登录弹窗
  function showLoginModal() {
    loginModal.classList.add('active');
  }

  // 隐藏登录弹窗
  function hideLoginModal() {
    loginModal.classList.remove('active');
  }

  // 点击用户头像或用户名显示登录弹窗
  if (userAvatarElement) {
    userAvatarElement.addEventListener('click', showLoginModal);
  }
  if (userNameElement) {
    userNameElement.addEventListener('click', showLoginModal);
  }

  // 关闭登录弹窗
  if (loginModalClose) {
    loginModalClose.addEventListener('click', hideLoginModal);
  }

  // 点击弹窗外部关闭
  loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) {
      hideLoginModal();
    }
  });

  // 登录功能
  const phoneInput = document.getElementById('phone');
  const countryCode = document.getElementById('countryCode');
  const loginSubmit = document.getElementById('loginSubmit');

  // 发送验证码
  async function sendCaptcha(phone, countryCode) {
    try {
      const response = await fetch(`http://localhost:3000/captcha/sent?phone=${phone}&countrycode=${countryCode}`);
      const data = await response.json();
      console.log('发送验证码:', data);
      if (data.code === 200) {
        alert('验证码已发送');
        return true;
      } else {
        alert(data.msg || '发送验证码失败');
        return false;
      }
    } catch (error) {
      console.error('发送验证码失败:', error);
      alert('发送验证码失败');
      return false;
    }
  }

  // 登录
  async function loginWithCaptcha(phone, countryCode, captcha) {
    try {
      const response = await fetch(`http://localhost:3000/login/cellphone?phone=${phone}&countrycode=${countryCode}&captcha=${captcha}`);
      const data = await response.json();
      console.log('登录结果:', data);

      if (data.code === 200) {
        // 保存登录token和用户信息
        if (data.token) {
          localStorage.setItem('neteaseToken', data.token);
          console.log('已保存登录token');
        }
        
        // 登录成功，更新用户信息
        updateUserInfo(data);
        hideLoginModal();
        alert('登录成功');
        return true;
      } else {
        alert(data.msg || '登录失败');
        return false;
      }
    } catch (error) {
      console.error('登录失败:', error);
      alert('登录失败: ' + error.message);
      return false;
    }
  }

  // 登录提交
  if (loginSubmit) {
    loginSubmit.addEventListener('click', async () => {
      const phone = phoneInput.value.trim();
      const countrycode = countryCode.value;

      if (!phone) {
        alert('请输入手机号');
        return;
      }

      // 发送验证码
      const captchaSent = await sendCaptcha(phone, countrycode);
      if (!captchaSent) {
        return;
      }

      // 等待用户输入验证码
      setTimeout(() => {
        const captcha = prompt('请输入验证码:');
        if (captcha) {
          loginWithCaptcha(phone, countrycode, captcha);
        }
      }, 1000);
    });
  }

// 更新 music-now-playing-bar 的信息
function updateMusicNowPlayingBar(track, coverImage) {
  if (!musicNowPlayingBar) return;

  if (musicNowPlayingBarTitle && track) {
    musicNowPlayingBarTitle.textContent = track.name || '未知歌曲';
  }

  if (musicNowPlayingBarArtist && track) {
    const artistNames = track.artists ? track.artists.map(a => a.name).join('/') :
                        track.ar ? track.ar.map(a => a.name).join('/') : '未知艺术家';
    musicNowPlayingBarArtist.textContent = artistNames;
  }

  if (musicNowPlayingBarCover && coverImage) {
    musicNowPlayingBarCover.src = coverImage;
  }
}

// music-now-playing-bar 的进度条
const musicNowPlayingBarProgress = musicNowPlayingBar?.querySelector('.now-playing-bar__progress');

// 创建进度条时间提示
if (musicNowPlayingBarProgress) {
  const musicProgressTooltip = document.createElement('div');
  musicProgressTooltip.className = 'progress-tooltip';
  musicNowPlayingBarProgress.appendChild(musicProgressTooltip);

  // 鼠标经过进度条，显示时间提示
  musicNowPlayingBarProgress.addEventListener('mousemove', (e) => {
    if (audio.duration > 0) {
      const rect = musicNowPlayingBarProgress.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      const time = percentage * audio.duration;
      const timeStr = formatDuration(time * 1000);

      musicProgressTooltip.textContent = timeStr;
      musicProgressTooltip.style.left = `${percentage * 100}%`;
    }
  });

  musicNowPlayingBarProgress.addEventListener('mouseleave', () => {
    musicProgressTooltip.textContent = '';
  });

  // 点击进度条跳转
  musicNowPlayingBarProgress.addEventListener('click', (e) => {
    if (audio.duration > 0) {
      const rect = musicNowPlayingBarProgress.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      audio.currentTime = percentage * audio.duration;
    }
  });
}

// 获取歌词函数
async function fetchLyrics(trackId) {
  try {
    const response = await fetch(`http://localhost:3000/lyric?id=${trackId}`);
    const data = await response.json();

    if (data.lrc && data.lrc.lyric) {
      return parseLyrics(data.lrc.lyric);
    } else {
      return null;
    }
  } catch (error) {
    console.error('获取歌词失败:', error);
    return null;
  }
}

// 解析歌词
function parseLyrics(lrcText) {
  const lines = lrcText.split('\n');
  const lyrics = [];

  lines.forEach(line => {
    const match = line.match(/\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/);
    if (match) {
      const minutes = parseInt(match[1]);
      const seconds = parseInt(match[2]);
      const milliseconds = parseInt(match[3]);
      const time = minutes * 60 + seconds + milliseconds / 1000;
      const text = match[4].trim();

      if (text) {
        lyrics.push({ time, text });
      }
    }
  });

  return lyrics;
}

// 显示歌词
function displayLyrics(lyrics) {
  const lyricsContainer = document.querySelector('.music-player-page__lyrics');
  if (!lyricsContainer) return;

  lyricsContainer.innerHTML = '';

  if (!lyrics || lyrics.length === 0) {
    lyricsContainer.innerHTML = '<div class="music-player-page__lyric-line">暂无歌词</div>';
    return;
  }

  lyrics.forEach((lyric, index) => {
    const lyricLine = document.createElement('div');
    lyricLine.className = 'music-player-page__lyric-line';
    lyricLine.dataset.time = lyric.time;
    lyricLine.dataset.index = index;
    lyricLine.textContent = lyric.text;

    lyricsContainer.appendChild(lyricLine);
  });
}

// 在 playSong 函数中添加歌词获取
const originalPlaySong = playSong;
playSong = async function(track, albumImage, trackList = null, index = null, hideNowPlayingBar = false) {
  // 调用原始的 playSong 函数
  originalPlaySong(track, albumImage, trackList, index, hideNowPlayingBar);

  // 获取并显示歌词
  if (track && track.id) {
    const lyrics = await fetchLyrics(track.id);
    displayLyrics(lyrics);
  }
};

// 歌词高亮和滚动
let lyrics = [];

// 监听音频播放进度更新歌词
if (audio) {
  audio.addEventListener('timeupdate', () => {
    const currentTime = audio.currentTime;
    updateCurrentLyric(currentTime);
  });
}

// 更新当前歌词
function updateCurrentLyric(currentTime) {
  const lyricsContainer = document.querySelector('.music-player-page__lyrics');
  if (!lyricsContainer) return;

  const lyricLines = lyricsContainer.querySelectorAll('.music-player-page__lyric-line');
  if (lyricLines.length === 0) return;

  let currentIndex = -1;

  for (let i = 0; i < lyricLines.length; i++) {
    const lyricTime = parseFloat(lyricLines[i].dataset.time);

    if (currentTime >= lyricTime) {
      currentIndex = i;
    } else {
      break;
    }
  }

  // 移除所有高亮
  lyricLines.forEach(line => {
    line.classList.remove('music-player-page__lyric-line--active');
  });

  // 添加当前歌词高亮
  if (currentIndex >= 0) {
    const currentLine = lyricLines[currentIndex];
    currentLine.classList.add('music-player-page__lyric-line--active');

    // 滚动到当前歌词
    currentLine.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }
}

// 修改 displayLyrics 函数以保存歌词数据
const originalDisplayLyrics = displayLyrics;
displayLyrics = function(lyricsData) {
  lyrics = lyricsData || [];
  originalDisplayLyrics(lyrics);
};