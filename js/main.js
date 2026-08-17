// 自动更新页脚年份
document.getElementById('year').textContent = new Date().getFullYear();

// 平滑滚动（配合 CSS scroll-behavior，这里作为备用）
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
