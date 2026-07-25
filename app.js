const Data = window.PortfolioData;
let allProjects = [];
let allNotes = [];
let activeFilter = 'all';

const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
const formatDate = value => value ? new Intl.DateTimeFormat('en-GB',{month:'short',year:'numeric'}).format(new Date(value)) : '';
const categoryIcon = cat => ({network:'NET',security:'SEC',software:'APP',systems:'SYS',wireless:'WLAN'}[cat] || 'LAB');

function projectCard(item) {
  const tags = (item.tags || []).slice(0,4).map(tag => `<span>${escapeHtml(tag)}</span>`).join('');
  const cover = item.cover_url ? `<img src="${escapeHtml(item.cover_url)}" alt="" loading="lazy" />` : `<div class="project-icon">${categoryIcon(item.category)}</div>`;
  return `<article class="project-card reveal visible" data-category="${escapeHtml(item.category)}">
    <div class="project-cover">${cover}</div>
    <div class="project-body">
      <div class="card-meta"><span>${escapeHtml(item.category)}</span>${item.featured ? '<span class="visibility-pill">Featured</span>' : ''}</div>
      <h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.summary)}</p>
      <div class="chip-row">${tags}</div>
      <button class="card-link details-trigger" data-kind="project" data-id="${escapeHtml(item.id)}" type="button">View case study →</button>
    </div>
  </article>`;
}

function noteCard(item) {
  return `<article class="note-card reveal visible">
    <div class="note-icon">${categoryIcon(item.category)}</div>
    <h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.summary)}</p>
    <div class="note-footer"><span>${escapeHtml(item.category)}</span><button class="card-link details-trigger" data-kind="note" data-id="${escapeHtml(item.id)}" type="button">Open →</button></div>
  </article>`;
}

function renderProjects() {
  const filtered = activeFilter === 'all' ? allProjects : allProjects.filter(x => x.category === activeFilter);
  document.querySelector('#projectsGrid').innerHTML = filtered.map(projectCard).join('');
  document.querySelector('#projectsEmpty').classList.toggle('hidden', filtered.length > 0);
}

function renderNotes(query='') {
  const q = query.trim().toLowerCase();
  const filtered = allNotes.filter(item => !q || [item.title,item.summary,item.category,...(item.tags||[])].join(' ').toLowerCase().includes(q));
  document.querySelector('#notesGrid').innerHTML = filtered.map(noteCard).join('');
  document.querySelector('#notesEmpty').classList.toggle('hidden', filtered.length > 0);
}

function openDetails(kind,id) {
  const item = (kind === 'project' ? allProjects : allNotes).find(x => x.id === id);
  if (!item) return;
  const action = item.document_url && item.document_url !== '#' ? `<div class="details-actions"><a class="btn primary" href="${escapeHtml(item.document_url)}" target="_blank" rel="noopener">Open document / live project</a></div>` : '';
  document.querySelector('#dialogContent').innerHTML = `<div class="details-hero"><p class="eyebrow">${escapeHtml(item.category)} / ${kind}</p><h2>${escapeHtml(item.title)}</h2></div><div class="details-body"><div class="chip-row">${(item.tags||[]).map(t=>`<span>${escapeHtml(t)}</span>`).join('')}</div><p>${escapeHtml(item.content || item.summary)}</p>${action}<small>Last updated ${formatDate(item.updated_at)}</small></div>`;
  document.querySelector('#detailsDialog').showModal();
}

async function init() {
  document.querySelector('#year').textContent = new Date().getFullYear();
  const savedTheme = localStorage.getItem('ms_theme');
  if (savedTheme === 'light') document.body.classList.add('light');

  try {
    [allProjects, allNotes] = await Promise.all([Data.getPublic('projects'), Data.getPublic('notes')]);
    renderProjects(); renderNotes();
    const settings = await Data.getSettings();
    const cv = document.querySelector('#downloadCv');
    cv.href = 'cv.html';
    const email = settings.email || 'mohamed.sherif@example.com';
    document.querySelector('#emailLink').href = `mailto:${email}`;
    document.querySelector('#linkedinLink').href = settings.linkedin_url || '#';
  } catch (error) {
    console.error(error);
    document.querySelector('#projectsGrid').innerHTML = `<div class="empty-state">Could not load content. Check config.js and database policies.</div>`;
  }
}

document.querySelector('#themeToggle').addEventListener('click', () => { document.body.classList.toggle('light'); localStorage.setItem('ms_theme',document.body.classList.contains('light')?'light':'dark'); });
document.querySelector('#projectFilters').addEventListener('click', e => { const btn=e.target.closest('button'); if(!btn)return; activeFilter=btn.dataset.filter; document.querySelectorAll('#projectFilters button').forEach(x=>x.classList.toggle('active',x===btn)); renderProjects(); });
document.querySelector('#noteSearch').addEventListener('input', e => renderNotes(e.target.value));
document.addEventListener('click', e => { const btn=e.target.closest('.details-trigger'); if(btn) openDetails(btn.dataset.kind,btn.dataset.id); });
document.querySelector('.dialog-close').addEventListener('click',()=>document.querySelector('#detailsDialog').close());

const observer = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);} }),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
init();
