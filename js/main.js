// 自动更新页脚年份
document.getElementById('year').textContent = new Date().getFullYear();

// 平滑滚动（配合 CSS scroll-behavior，这里作为备用）
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href === '#') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// 根据右侧内容索引筛选文章
const filterButtons = [...document.querySelectorAll('.content-index button[data-category]')];
const postCards = [...document.querySelectorAll('.post-list .post-card')];
const articleList = document.getElementById('article-list');
const articlesHeading = document.getElementById('articles-heading');
const articlesTitle = document.getElementById('articles-title');
const clearFilterButton = document.querySelector('.clear-filter');
const emptyState = document.querySelector('.post-empty-state');
const emptyResetButton = document.querySelector('.empty-reset');
const pagination = document.querySelector('.pagination');

if (
  filterButtons.length &&
  postCards.length &&
  articleList &&
  articlesHeading &&
  articlesTitle &&
  clearFilterButton &&
  emptyState &&
  emptyResetButton
) {
  const refreshList = () => {
    articleList.classList.remove('is-refreshed');
    void articleList.offsetWidth;
    articleList.classList.add('is-refreshed');
  };

  const showAllArticles = ({ scroll = true } = {}) => {
    postCards.forEach((card) => {
      card.hidden = false;
    });

    filterButtons.forEach((button) => {
      button.classList.remove('is-active');
      button.setAttribute('aria-pressed', 'false');
    });

    emptyState.hidden = true;
    clearFilterButton.hidden = true;
    if (pagination) {
      pagination.hidden = false;
    }
    articlesTitle.textContent = '最新文章';
    refreshList();

    if (scroll) {
      articlesHeading.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const filterArticles = (selectedButton) => {
    const { category, label } = selectedButton.dataset;
    let visibleCount = 0;

    postCards.forEach((card) => {
      const categories = (card.dataset.category || '').split(/\s+/);
      const matches = categories.includes(category);
      card.hidden = !matches;
      visibleCount += Number(matches);
    });

    filterButtons.forEach((button) => {
      const isActive = button === selectedButton;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    emptyState.hidden = visibleCount > 0;
    clearFilterButton.hidden = false;
    if (pagination) {
      pagination.hidden = true;
    }
    articlesTitle.textContent = label;
    refreshList();
    articlesHeading.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (button.classList.contains('is-active')) {
        showAllArticles();
        return;
      }

      filterArticles(button);
    });
  });

  clearFilterButton.addEventListener('click', () => showAllArticles());
  emptyResetButton.addEventListener('click', () => showAllArticles());
}
