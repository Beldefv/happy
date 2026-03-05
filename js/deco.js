const carousel = document.getElementById('carousel');
const zoomOverlay = document.getElementById('zoomOverlay');
const zoomImage = document.getElementById('zoomImage');

if (carousel) {

  // 画像を円形に配置
  const images = carousel.querySelectorAll("img");
  const total = images.length;
  const radius = 380; // 画像300pxに最適

  images.forEach((img, i) => {
    const angle = (360 / total) * i;
    img.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;

    // ★ 画像クリックでズームイン
    img.addEventListener('click', (e) => {
      e.stopPropagation(); // カルーセルのクリックイベントを無効化
      carousel.classList.add('paused'); // 回転停止
      zoomImage.src = img.src;
      zoomOverlay.style.display = "flex";
    });
  });

  // ★ カルーセルクリックで回転停止/再開
  carousel.addEventListener('click', () => {
    carousel.classList.toggle('paused');
  });

  // ★ ズーム解除（背景クリック）
  zoomOverlay.addEventListener('click', () => {
    zoomOverlay.style.display = "none";
    carousel.classList.remove('paused'); // 回転再開
  });
}

/*フラッシュ*/