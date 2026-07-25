const Data = window.PortfolioData;
let cvData = null;
const $ = sel => document.querySelector(sel);
const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
const safeUrl = value => /^https?:\/\//i.test(String(value||'')) ? value : '';
const fmtDate = value => value ? new Intl.DateTimeFormat('en-GB',{day:'2-digit',month:'short',year:'numeric'}).format(new Date(value)) : 'Not dated';

function contactLine(label,value,href='') {
  if (!value) return '';
  return href ? `<a href="${escapeHtml(href)}" target="_blank" rel="noopener">${escapeHtml(value)}</a>` : `<span>${escapeHtml(value)}</span>`;
}
function sectionTitle(title){return `<h2 class="cv-section-title">${escapeHtml(title)}</h2>`;}
function renderExperience(items=[]) {
  if (!items.length) return '';
  return `<section class="cv-section">${sectionTitle('Professional Experience')}${items.map(x=>`<article class="cv-entry"><div class="cv-entry-head"><div><h3 class="cv-entry-title">${escapeHtml(x.role)}</h3><p class="cv-entry-subtitle">${escapeHtml(x.company)}</p></div><div class="cv-entry-meta">${escapeHtml(x.period)}${x.location?`<br>${escapeHtml(x.location)}`:''}</div></div>${(x.bullets||[]).length?`<ul class="cv-bullets">${x.bullets.map(b=>`<li>${escapeHtml(b)}</li>`).join('')}</ul>`:''}</article>`).join('')}</section>`;
}
function renderSkills(items=[]) {
  if (!items.length) return '';
  return `<section class="cv-section">${sectionTitle('Technical Skills')}<div class="cv-skill-grid">${items.map(x=>`<div class="cv-skill-row"><strong>${escapeHtml(x.name)}</strong><span>${escapeHtml((x.items||[]).join(' • '))}</span></div>`).join('')}</div></section>`;
}
function renderProjects(items=[]) {
  if (!items.length) return '';
  return `<section class="cv-section">${sectionTitle('Selected Projects')}${items.map(x=>`<article class="cv-project"><h3>${escapeHtml(x.title)}${x.subtitle?` <span>— ${escapeHtml(x.subtitle)}</span>`:''}</h3><p>${escapeHtml(x.description)}</p>${safeUrl(x.url)?`<a href="${escapeHtml(x.url)}" target="_blank" rel="noopener">${escapeHtml(x.url)}</a>`:''}</article>`).join('')}</section>`;
}
function renderEducation(items=[]) {
  if (!items.length) return '';
  return `<section class="cv-section">${sectionTitle('Education')}${items.map(x=>`<article class="cv-entry"><div class="cv-entry-head"><div><h3 class="cv-entry-title">${escapeHtml(x.degree)}</h3><p class="cv-entry-subtitle">${escapeHtml(x.institution)}</p></div><div class="cv-entry-meta">${escapeHtml(x.period)}${x.location?`<br>${escapeHtml(x.location)}`:''}</div></div>${x.details?`<p class="cv-summary">${escapeHtml(x.details)}</p>`:''}</article>`).join('')}</section>`;
}
function renderCertifications(items=[]) {
  if (!items.length) return '';
  return `<section class="cv-section">${sectionTitle('Certifications & Professional Training')}<div class="cv-simple-grid">${items.map(x=>`<div class="cv-simple-item"><strong>${escapeHtml(x.name)}</strong><span>${escapeHtml([x.issuer,x.year].filter(Boolean).join(' • '))}</span></div>`).join('')}</div></section>`;
}
function renderLanguages(items=[]) {
  if (!items.length) return '';
  return `<section class="cv-section">${sectionTitle('Languages')}<div class="cv-simple-grid">${items.map(x=>`<div class="cv-simple-item"><strong>${escapeHtml(x.name)}</strong><span>${escapeHtml(x.level)}</span></div>`).join('')}</div></section>`;
}
function renderCustom(items=[]) {
  return items.map(x=>`<section class="cv-section cv-custom">${sectionTitle(x.title||'Additional Information')}<p>${escapeHtml((x.items||[]).join('\n'))}</p></section>`).join('');
}
function renderCV(cv) {
  const p=cv.profile||{};
  const visible=cv.section_visibility||{};
  const contacts=[
    contactLine('Email',p.email,p.email?`mailto:${p.email}`:''),
    contactLine('Phone',p.phone,p.phone?`tel:${p.phone.replace(/\s+/g,'')}`:''),
    contactLine('Location',p.location),
    contactLine('LinkedIn',p.linkedin,safeUrl(p.linkedin)),
    contactLine('GitHub',p.github,safeUrl(p.github)),
    contactLine('Website',p.website,safeUrl(p.website))
  ].filter(Boolean).join('');
  $('#cvDocument').innerHTML = `
    <header class="cv-header"><div><h1 class="cv-name">${escapeHtml(p.full_name||'Your Name')}</h1><p class="cv-title">${escapeHtml(p.title||'Professional Title')}</p>${p.summary?`<p class="cv-summary">${escapeHtml(p.summary)}</p>`:''}</div><div class="cv-contact">${contacts}</div></header>
    ${visible.experience!==false?renderExperience(cv.experience):''}
    ${visible.skills!==false?renderSkills(cv.skill_groups):''}
    ${visible.projects!==false?renderProjects(cv.projects):''}
    ${visible.education!==false?renderEducation(cv.education):''}
    ${visible.certifications!==false?renderCertifications(cv.certifications):''}
    ${visible.languages!==false?renderLanguages(cv.languages):''}
    ${visible.custom!==false?renderCustom(cv.custom_sections||[]):''}
    <footer class="cv-footer"><span>Dynamic CV • Generated from the latest saved portfolio data</span><span>Updated ${escapeHtml(fmtDate(cv.updated_at))}</span></footer>`;
  document.title=`${p.full_name||'Latest'} CV`;
  $('#latestVersionLabel').textContent=`Latest saved version: ${fmtDate(cv.updated_at)}`;
}
function fileName() {
  const name=(cvData?.profile?.full_name||'Mohamed_Sherif').trim().replace(/[^a-zA-Z0-9]+/g,'_').replace(/^_|_$/g,'');
  const date=new Date().toISOString().slice(0,10);
  return `${name}_CV_${date}.pdf`;
}
async function downloadPDF() {
  const button=$('#downloadPdfBtn');
  const old=button.textContent;button.disabled=true;button.textContent='Generating PDF…';
  try {
    if (!window.html2pdf) { window.print(); return; }
    await window.html2pdf().set({
      margin:0,
      filename:fileName(),
      image:{type:'jpeg',quality:.98},
      html2canvas:{scale:2,useCORS:true,backgroundColor:'#ffffff'},
      jsPDF:{unit:'mm',format:'a4',orientation:'portrait'},
      pagebreak:{mode:['css','legacy'],avoid:['.cv-entry','.cv-project','.cv-simple-item','.cv-skill-row']}
    }).from($('#cvDocument')).save();
  } finally { button.disabled=false;button.textContent=old; }
}
async function init() {
  try {
    cvData=await Data.getCV();
    renderCV(cvData);
    if (new URLSearchParams(location.search).get('download')==='1') setTimeout(downloadPDF,450);
  } catch(error) {
    $('#cvDocument').innerHTML=`<div class="cv-loading">Could not load the latest CV. ${escapeHtml(error.message)}</div>`;
    $('#latestVersionLabel').textContent='CV could not be loaded';
  }
}
$('#downloadPdfBtn').addEventListener('click',downloadPDF);
$('#printCvBtn').addEventListener('click',()=>window.print());
init();
