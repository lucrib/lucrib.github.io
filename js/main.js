(function () {
  const experienceList = document.getElementById('experience-list');
  const i18nNodes = document.querySelectorAll('[data-i18n]');
  const languageButtons = document.querySelectorAll('[data-language]');
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const themeLabel = document.querySelector('[data-theme-label]');
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
    window.localStorage.setItem('preferred-theme', theme);
  }

  function getValue(dictionary, path) {
    return path.split('.').reduce((value, key) => value && value[key], dictionary);
  }

  function renderExperience(items) {
    experienceList.innerHTML = items.map((item) => `
      <article class="timeline-item">
        <div class="timeline-marker"></div>
        <div class="timeline-meta"><span>${item.period}</span><span>${item.location}</span></div>
        <h3>${item.position}</h3>
        <p class="timeline-company">${item.company}</p>
        <ul>${item.description.map((point) => `<li>${point}</li>`).join('')}</ul>
      </article>
    `).join('');
  }

  async function setLanguage(language) {
    if (!supportedLanguages.includes(language)) return;
    const response = await fetch(`json/${language}.json`);
    const dictionary = await response.json();
    currentDictionary = dictionary;
    document.documentElement.lang = dictionary.languageTag;
    document.title = dictionary.pageTitle;
    i18nNodes.forEach((node) => {
      const value = getValue(dictionary, node.dataset.i18n);
      if (value !== undefined) node.innerHTML = value;
    });
    setTheme(document.documentElement.dataset.theme);
    renderExperience(dictionary.experience);
    languageButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.language === language)));
    window.localStorage.setItem('preferred-language', language);
  }

  languageButtons.forEach((button) => button.addEventListener('click', () => setLanguage(button.dataset.language)));
  themeToggle.addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
  setTheme(getTheme());
  setLanguage(getLanguage()).catch(() => setLanguage(fallbackLanguage));
})();
