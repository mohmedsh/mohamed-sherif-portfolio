(() => {
  'use strict';
  const API = window.PortfolioAPI;
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

  let projects = [];
  let notes = [];
  let activeFilter = 'all';

  function coverMarkup(item, type) {
    if (item.cover_url && !String(item.cover_url).startsWith('private:')) {
      return `<img src="${escapeHtml(item.cover_url)}" alt="${escapeHtml(item.title)} cover" loading="lazy" onerror="this.parentElement.innerHTML='<span class=&quot;cover-fallback&quot;>${type.toUpperCase()}</span>'">`;
    }
    return `<span class="cover-fallback">${type.toUpperCase()} / ${escapeHtml(item.category)}</span>`;
  }

  function projectCard(item) {
    const tags = (item.tags || []).slice(0, 4).map(tag => `<span>${escapeHtml(tag)}</span>`).join('');
    return `<article class="project-card reveal visible" data-category="${escapeHtml(item.category)}">
      <div class="project-cover">${coverMarkup(item, 'project')}</div>
      <div class="project-body">
        <div class="project-top"><h3>${escapeHtml(item.title)}</h3><span class="category-pill">${escapeHtml(item.category)}</span></div>
        <p>${escapeHtml(item.summary)}</p>
        <div class="project-footer"><div class="chip-row">${tags}</div><button class="text-btn" type="button" data-details="projects" data-id="${escapeHtml(item.id || item.title)}">Case study →</button></div>
      </div>
    </article>`;
  }

  function noteCard(item) {
    const tags = (item.tags || []).slice(0, 4).map(tag => `<span>${escapeHtml(tag)}</span>`).join('');
    return `<article class="note-card reveal visible">
      <span class="category-pill">${escapeHtml(item.category)}</span>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.summary)}</p>
      <div class="chip-row">${tags}</div>
      <button class="text-btn" type="button" data-details="notes" data-id="${escapeHtml(item.id || item.title)}">Read note →</button>
    </article>`;
  }

  function renderProjects() {
    const filtered = activeFilter === 'all' ? projects : projects.filter(item => item.category === activeFilter);
    $('#projectsGrid').innerHTML = filtered.map(projectCard).join('');
    $('#projectsEmpty').classList.toggle('hidden', filtered.length > 0);
  }

  function renderNotes() {
    const query = $('#noteSearch').value.trim().toLowerCase();
    const filtered = notes.filter(item => {
      const haystack = [item.title, item.summary, item.category, ...(item.tags || [])].join(' ').toLowerCase();
      return !query || haystack.includes(query);
    });
    $('#notesGrid').innerHTML = filtered.map(noteCard).join('');
    $('#notesEmpty').classList.toggle('hidden', filtered.length > 0);
  }

  function findItem(type, id) {
    const list = type === 'projects' ? projects : notes;
    return list.find(item => String(item.id || item.title) === String(id));
  }

  function openDetails(type, id) {
    const item = findItem(type, id);
    if (!item) return;
    const external = item.document_url && !String(item.document_url).startsWith('private:')
      ? `<a class="btn primary" href="${escapeHtml(item.document_url)}" target="_blank" rel="noopener">Open document / demo ↗</a>` : '';
    $('#dialogContent').innerHTML = `<article class="dialog-detail">
      <p class="eyebrow">${escapeHtml(item.category)} / ${type === 'projects' ? 'Project' : 'Technical note'}</p>
      <h2>${escapeHtml(item.title)}</h2>
      <div class="chip-row">${(item.tags || []).map(tag => `<span>${escapeHtml(tag)}</span>`).join('')}</div>
      <p>${escapeHtml(item.content || item.summary)}</p>${external}
    </article>`;
    $('#detailsDialog').showModal();
  }

  async function load() {
    try {
      const [settings, projectRows, noteRows] = await Promise.all([
        API.getSettings(), API.listPublic('projects'), API.listPublic('notes')
      ]);
      projects = projectRows || [];
      notes = noteRows || [];
      $('#heroHeadline').textContent = settings.headline || API.defaults.settings.headline;
      $('#emailLink').href = `mailto:${settings.email || API.defaults.settings.email}`;
      $('#linkedinLink').href = settings.linkedin_url || 'https://www.linkedin.com/';
      $('#downloadCv').href = settings.cv_url || 'cv.html';
      $('#contactLocation').textContent = `Available for network infrastructure, security engineering and automation opportunities in ${settings.location || 'Egypt'}.`;
      renderProjects();
      renderNotes();
    } catch (error) {
      console.error(error);
      projects = API.clone(API.defaults.projects);
      notes = API.clone(API.defaults.notes);
      renderProjects();
      renderNotes();
    }
  }

  function initTheme() {
    const saved = localStorage.getItem('portfolio-theme');
    if (saved === 'light') document.body.classList.add('light');
    $('#themeToggle').addEventListener('click', () => {
      document.body.classList.toggle('light');
      localStorage.setItem('portfolio-theme', document.body.classList.contains('light') ? 'light' : 'dark');
    });
  }

  function initReveal() {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) entry.target.classList.add('visible');
    }, { threshold: .12 });
    $$('.reveal').forEach(element => observer.observe(element));
  }

  $('#projectFilters').addEventListener('click', event => {
    const button = event.target.closest('button[data-filter]');
    if (!button) return;
    activeFilter = button.dataset.filter;
    $$('#projectFilters button').forEach(item => item.classList.toggle('active', item === button));
    renderProjects();
  });
  $('#noteSearch').addEventListener('input', renderNotes);
  document.addEventListener('click', event => {
    const details = event.target.closest('[data-details]');
    if (details) openDetails(details.dataset.details, details.dataset.id);
  });
  $('.details-dialog .dialog-close').addEventListener('click', () => $('#detailsDialog').close());
  $('#detailsDialog').addEventListener('click', event => { if (event.target === $('#detailsDialog')) $('#detailsDialog').close(); });
  $('#year').textContent = String(new Date().getFullYear());

  initTheme();
  initReveal();
  load();
})();
