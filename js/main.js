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

// 文章分类筛选与分页
const filterButtons = [...document.querySelectorAll('.content-index button[data-category]')];
const postCards = [...document.querySelectorAll('.post-list .post-card')];
const articleList = document.getElementById('article-list');
const articlesHeading = document.getElementById('articles-heading');
const articlesTitle = document.getElementById('articles-title');
const clearFilterButton = document.querySelector('.clear-filter');
const emptyState = document.querySelector('.post-empty-state');
const emptyResetButton = document.querySelector('.empty-reset');
const pagination = document.querySelector('.pagination');
const pageSize = 6;

if (
  filterButtons.length &&
  postCards.length &&
  articleList &&
  articlesHeading &&
  articlesTitle &&
  clearFilterButton &&
  emptyState &&
  emptyResetButton &&
  pagination
) {
  let activeCategory = null;
  let currentPage = 1;

  const refreshList = () => {
    articleList.classList.remove('is-refreshed');
    void articleList.offsetWidth;
    articleList.classList.add('is-refreshed');
  };

  const getFilteredCards = () => {
    if (!activeCategory) {
      return postCards;
    }

    return postCards.filter((card) => {
      const categories = (card.dataset.category || '').split(/\s+/);
      return categories.includes(activeCategory);
    });
  };

  const createPageButton = (label, page, { className = '', current = false, disabled = false } = {}) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.className = className;
    button.disabled = disabled;

    if (current) {
      button.classList.add('current');
      button.setAttribute('aria-current', 'page');
    } else {
      button.setAttribute('aria-label', `前往第 ${page} 页`);
    }

    button.addEventListener('click', () => {
      currentPage = page;
      renderArticles({ scroll: true });
    });

    return button;
  };

  const renderPagination = (totalPages) => {
    pagination.replaceChildren();

    if (totalPages <= 1) {
      pagination.hidden = true;
      return;
    }

    pagination.hidden = false;
    pagination.append(
      createPageButton('← 上一页', Math.max(1, currentPage - 1), {
        className: 'previous',
        disabled: currentPage === 1,
      }),
    );

    for (let page = 1; page <= totalPages; page += 1) {
      pagination.append(createPageButton(String(page), page, { current: page === currentPage }));
    }

    pagination.append(
      createPageButton('下一页 →', Math.min(totalPages, currentPage + 1), {
        className: 'next',
        disabled: currentPage === totalPages,
      }),
    );
  };

  function renderArticles({ scroll = false } = {}) {
    const filteredCards = getFilteredCards();
    const totalPages = Math.max(1, Math.ceil(filteredCards.length / pageSize));
    currentPage = Math.min(currentPage, totalPages);
    const pageStart = (currentPage - 1) * pageSize;
    const visibleCards = filteredCards.slice(pageStart, pageStart + pageSize);

    postCards.forEach((card) => {
      card.hidden = !visibleCards.includes(card);
    });

    emptyState.hidden = filteredCards.length > 0;
    renderPagination(filteredCards.length ? totalPages : 0);
    refreshList();

    if (scroll) {
      articlesHeading.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  const showAllArticles = ({ scroll = true } = {}) => {
    activeCategory = null;
    currentPage = 1;

    filterButtons.forEach((button) => {
      button.classList.remove('is-active');
      button.setAttribute('aria-pressed', 'false');
    });

    emptyState.hidden = true;
    clearFilterButton.hidden = true;
    articlesTitle.textContent = '最新文章';
    renderArticles({ scroll });
  };

  const filterArticles = (selectedButton) => {
    const { category, label } = selectedButton.dataset;
    activeCategory = category;
    currentPage = 1;

    filterButtons.forEach((button) => {
      const isActive = button === selectedButton;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    clearFilterButton.hidden = false;
    articlesTitle.textContent = label;
    renderArticles({ scroll: true });
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
  renderArticles();
}
