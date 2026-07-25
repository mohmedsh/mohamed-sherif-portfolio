(() => {
  'use strict';
  const API = window.PortfolioAPI;
  const $ = selector => document.querySelector(selector);
  const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const safeLink = value => value && /^https?:\/\//i.test(value) ? value : '';
  let currentCV = null;

  function normalizeCV(value) {
    const base = API.clone(API.defaults.cv);
    const cv = value || {};
    return {
      ...base, ...cv,
      profile: { ...base.profile, ...(cv.profile || {}) },
      section_visibility: { ...base.section_visibility, ...(cv.section_visibility || {}) },
      experience: Array.isArray(cv.experience) ? cv.experience : base.experience,
      skill_groups: Array.isArray(cv.skill_groups) ? cv.skill_groups : base.skill_groups,
      projects: Array.isArray(cv.projects) ? cv.projects : base.projects,
      education: Array.isArray(cv.education) ? cv.education : base.education,
      certifications: Array.isArray(cv.certifications) ? cv.certifications : base.certifications,
      languages: Array.isArray(cv.languages) ? cv.languages : base.languages,
      custom_sections: Array.isArray(cv.custom_sections) ? cv.custom_sections : base.custom_sections
    };
  }

  function contactItem(text, href = '') {
    if (!text) return '';
    return href ? `<a href="${escapeHtml(href)}" target="_blank" rel="noopener">${escapeHtml(text)}</a>` : `<span>${escapeHtml(text)}</span>`;
  }

  function section(title, content) {
    if (!content) return '';
    return `<section class="cv-section"><h2 class="cv-section-title">${escapeHtml(title)}</h2>${content}</section>`;
  }

  function renderExperience(items) {
    return items.map(item => `<article class="cv-entry"><div class="cv-entry-top"><div><h3>${escapeHtml(item.role)}</h3><div class="cv-entry-sub">${escapeHtml([item.company,item.location].filter(Boolean).join(' • '))}</div></div><span class="cv-entry-period">${escapeHtml(item.period)}</span></div>${(item.bullets || []).length ? `<ul>${item.bullets.map(bullet => `<li>${escapeHtml(bullet)}</li>`).join('')}</ul>` : ''}</article>`).join('');
  }

  function renderSkills(items) {
    return `<div class="skill-grid">${items.map(item => `<div class="skill-group"><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml((item.items || []).join(' • '))}</span></div>`).join('')}</div>`;
  }

  function renderProjects(items) {
    return items.map(item => `<article class="cv-entry"><div class="cv-entry-top"><div><h3>${safeLink(item.url) ? `<a href="${escapeHtml(item.url)}" target="_blank" rel="noopener">${escapeHtml(item.title)}</a>` : escapeHtml(item.title)}</h3><div class="cv-entry-sub">${escapeHtml(item.subtitle)}</div></div></div><p>${escapeHtml(item.description)}</p></article>`).join('');
  }

  function renderEducation(items) {
    return items.map(item => `<article class="cv-entry"><div class="cv-entry-top"><div><h3>${escapeHtml(item.degree)}</h3><div class="cv-entry-sub">${escapeHtml([item.institution,item.location].filter(Boolean).join(' • '))}</div></div><span class="cv-entry-period">${escapeHtml(item.period)}</span></div><p>${escapeHtml(item.details)}</p></article>`).join('');
  }

  function renderCompact(items, type) {
    return `<div class="compact-grid">${items.map(item => {
      if (type === 'certifications') return `<div class="compact-item"><strong>${escapeHtml(item.name)}</strong><p>${escapeHtml([item.issuer,item.year].filter(Boolean).join(' • '))}</p></div>`;
      return `<div class="compact-item"><strong>${escapeHtml(item.name)}</strong><p>${escapeHtml(item.level)}</p></div>`;
    }).join('')}</div>`;
  }

  function renderCustom(items) {
    return items.map(item => section(item.title, `<ul class="custom-list">${(item.items || []).map(value => `<li>${escapeHtml(value)}</li>`).join('')}</ul>`)).join('');
  }

  function render(cv) {
    currentCV = normalizeCV(cv);
    const p = currentCV.profile;
    const contact = [
      contactItem(p.email, p.email ? `mailto:${p.email}` : ''),
      contactItem(p.phone, p.phone ? `tel:${p.phone.replace(/\s+/g,'')}` : ''),
      contactItem(p.location),
      contactItem(p.linkedin ? 'LinkedIn' : '', safeLink(p.linkedin)),
      contactItem(p.github ? 'GitHub' : '', safeLink(p.github)),
      contactItem(p.website ? 'Portfolio' : '', safeLink(p.website))
    ].filter(Boolean).join('');

    const vis = currentCV.section_visibility || {};
    $('#cvDocument').innerHTML = `<header class="cv-header"><h1>${escapeHtml(p.full_name)}</h1><p class="cv-title">${escapeHtml(p.title)}</p><div class="cv-contact">${contact}</div><p class="cv-summary">${escapeHtml(p.summary)}</p></header>
      ${vis.experience !== false ? section('Professional Experience', renderExperience(currentCV.experience)) : ''}
      ${vis.skills !== false ? section('Technical Skills', renderSkills(currentCV.skill_groups)) : ''}
      ${vis.projects !== false ? section('Selected Projects', renderProjects(currentCV.projects)) : ''}
      ${vis.education !== false ? section('Education', renderEducation(currentCV.education)) : ''}
      ${vis.certifications !== false ? section('Certifications & Training', renderCompact(currentCV.certifications, 'certifications')) : ''}
      ${vis.languages !== false ? section('Languages', renderCompact(currentCV.languages, 'languages')) : ''}
      ${vis.custom !== false ? renderCustom(currentCV.custom_sections) : ''}
      <footer class="cv-footer">Latest cloud version generated from Mohamed Sherif Portfolio Hub.</footer>`;
    const updated = currentCV.updated_at ? new Date(currentCV.updated_at) : new Date();
    $('#latestVersionLabel').textContent = `Last updated ${updated.toLocaleString('en-GB', { dateStyle:'medium', timeStyle:'short' })}`;
  }

  async function downloadPdf() {
    if (!currentCV) return;
    const name = String(currentCV.profile.full_name || 'Mohamed_Sherif').replace(/[^a-zA-Z0-9]+/g,'_');
    const date = new Date().toISOString().slice(0,10);
    const options = {
      margin: [5, 0, 5, 0],
      filename: `${name}_CV_${date}.pdf`,
      image: { type:'jpeg', quality:.98 },
      html2canvas: { scale:2, useCORS:true, backgroundColor:'#ffffff' },
      jsPDF: { unit:'mm', format:'a4', orientation:'portrait' },
      pagebreak: { mode:['avoid-all','css','legacy'] }
    };
    $('#latestVersionLabel').textContent = 'Generating latest PDF…';
    try { await window.html2pdf().set(options).from($('#cvDocument')).save(); }
    finally {
      const updated = currentCV.updated_at ? new Date(currentCV.updated_at) : new Date();
      $('#latestVersionLabel').textContent = `Last updated ${updated.toLocaleString('en-GB', { dateStyle:'medium', timeStyle:'short' })}`;
    }
  }

  $('#printCvBtn').addEventListener('click', () => window.print());
  $('#downloadPdfBtn').addEventListener('click', downloadPdf);

  (async () => {
    try {
      render(await API.getCV());
      const params = new URLSearchParams(location.search);
      if (params.get('download') === '1') setTimeout(downloadPdf, 450);
    } catch (error) {
      $('#cvDocument').innerHTML = `<div class="error-box">Could not load the latest CV: ${escapeHtml(API.errorMessage(error))}</div>`;
      $('#latestVersionLabel').textContent = 'Load failed';
    }
  })();
})();
