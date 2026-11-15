(function () {
  const experienceList = document.getElementById('experience-list');
  const i18nNodes = document.querySelectorAll('[data-i18n]');
  const languageButtons = document.querySelectorAll('[data-language]');
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const themeLabel = document.querySelector('[data-theme-label]');
  const experienceToggle = document.querySelector('[data-experience-toggle]');
  const backToTop = document.querySelector('[data-back-to-top]');
  const sectionLinks = document.querySelectorAll('[data-section-link]');
  const descriptionMeta = document.querySelector('meta[name="description"]');
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  const cvLinks = document.querySelectorAll('[data-cv-link]');
  const fallbackLanguage = 'pt-br';
  const supportedLanguages = ['pt-br', 'en-gb'];
  let currentDictionary;

  function getLanguage() {
    const saved = window.localStorage.getItem('preferred-language');
    if (supportedLanguages.includes(saved)) return saved;
    return navigator.language.toLowerCase().startsWith('en') ? 'en-gb' : fallbackLanguage;
  }

  function getTheme() {
    const saved = window.localStorage.getItem('preferred-theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setTheme(theme) {
    const isDark = theme === 'dark';
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
    themeToggle.setAttribute('aria-pressed', String(isDark));
    const themeAction = isDark ? 'light' : 'dark';
    themeToggle.setAttribute('aria-label', currentDictionary ? getValue(currentDictionary, `theme.${themeAction}Label`) : (isDark ? 'Ativar tema claro' : 'Ativar tema escuro'));
    themeLabel.textContent = currentDictionary ? getValue(currentDictionary, `theme.${themeAction}`) : (isDark ? 'Claro' : 'Escuro');
    themeToggle.querySelector('.theme-icon').textContent = isDark ? '☀' : '☾';
    themeColorMeta.setAttribute('content', isDark ? '#101815' : '#f5f6f1');
    window.localStorage.setItem('preferred-theme', theme);
  }

  function getValue(dictionary, path) {
    return path.split('.').reduce((value, key) => value && value[key], dictionary);
  }

  function updateCVLinks(language) {
    const file = language === 'en-gb' ? 'cv-en-gb.html' : 'cv-pt-br.html';
    cvLinks.forEach((link) => {
      link.href = file;
      link.download = file.split('/').pop();
    });
  }

  function renderExperience(items) {
    const visibleItems = items.slice(0, 6);
    const olderItems = items.slice(6);
    const renderItem = (item, index) => `
      <article class="timeline-item${index === 0 ? ' current-role' : ''}">
        <div class="timeline-marker"></div>
        <div class="timeline-meta"><span>${item.period}</span><span>${item.location}</span></div>
        ${index === 0 ? `<span class="current-badge">${getValue(currentDictionary, 'experienceMeta.current')}</span>` : ''}
        <h3>${item.position}</h3>
        <p class="timeline-company">${item.company}</p>
        <ul>${item.description.map((point) => `<li>${point}</li>`).join('')}</ul>
      </article>
    `;
    experienceList.innerHTML = visibleItems.map(renderItem).join('') + `<div class="older-experience" data-older-experience hidden>${olderItems.map((item, index) => renderItem(item, index + 6)).join('')}</div>`;
    experienceToggle.hidden = olderItems.length === 0;
    experienceToggle.setAttribute('aria-expanded', 'false');
    experienceToggle.innerHTML = `${getValue(currentDictionary, 'experienceMeta.showOlder')} <span>↓</span>`;
  }

  function toggleOlderExperience() {
    const olderExperience = document.querySelector('[data-older-experience]');
    const expanded = experienceToggle.getAttribute('aria-expanded') === 'true';
    olderExperience.hidden = expanded;
    experienceToggle.setAttribute('aria-expanded', String(!expanded));
    experienceToggle.innerHTML = `${getValue(currentDictionary, expanded ? 'experienceMeta.showOlder' : 'experienceMeta.hideOlder')} <span>${expanded ? '↓' : '↑'}</span>`;
  }

  function updateActiveSection(entries) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach((link) => link.removeAttribute('aria-current'));
      const active = document.querySelector(`[data-section-link="${entry.target.id}"]`);
      if (active) active.setAttribute('aria-current', 'page');
    });
  }

  async function setLanguage(language) {
    if (!supportedLanguages.includes(language)) return;
    const response = await fetch(`json/${language}.json`, { cache: 'no-store' });
    const dictionary = await response.json();
    currentDictionary = dictionary;
    document.documentElement.lang = dictionary.languageTag;
    document.title = dictionary.pageTitle;
    descriptionMeta.setAttribute('content', dictionary.metaDescription);
    i18nNodes.forEach((node) => {
      const value = getValue(dictionary, node.dataset.i18n);
      if (value !== undefined) node.innerHTML = value;
    });
    setTheme(document.documentElement.dataset.theme);
    renderExperience(dictionary.experience);
    updateCVLinks(language);
    languageButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.language === language)));
    window.localStorage.setItem('preferred-language', language);
  }

  languageButtons.forEach((button) => button.addEventListener('click', () => setLanguage(button.dataset.language)));
  themeToggle.addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
  experienceToggle.addEventListener('click', toggleOlderExperience);
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  window.addEventListener('scroll', () => backToTop.classList.toggle('is-visible', window.scrollY > 500), { passive: true });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(updateActiveSection, { rootMargin: '-25% 0px -60% 0px', threshold: 0 });
    document.querySelectorAll('main section[id]').forEach((section) => observer.observe(section));
  }
  setTheme(getTheme());
  setLanguage(getLanguage()).catch(() => setLanguage(fallbackLanguage));
})();
