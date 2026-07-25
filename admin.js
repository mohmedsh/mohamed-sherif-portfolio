const Data = window.PortfolioData;
let projects = [];
let notes = [];
let currentCV = null;
let cvDirty = false;
let currentType = null;
let currentItem = null;

const $ = sel => document.querySelector(sel);
const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
const escapeAttr = escapeHtml;
const fmt = value => value ? new Intl.DateTimeFormat('en-GB',{day:'2-digit',month:'short',year:'numeric'}).format(new Date(value)) : '—';
const clone = value => JSON.parse(JSON.stringify(value));

function setMessage(el,text,type='') { el.textContent=text; el.className=`form-message ${type}`; }

function row(item,type) {
  const visClass = item.visibility === 'public' ? 'public' : item.visibility === 'private' ? 'private' : '';
  return `<article class="content-row">
    <div class="content-info"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.summary)} • Updated ${fmt(item.updated_at)}</p></div>
    <div class="row-meta"><span class="${visClass}">${escapeHtml(item.visibility)}</span><span>${escapeHtml(item.status)}</span><span>${escapeHtml(item.category)}</span><button class="edit-btn" data-type="${type}" data-id="${escapeAttr(item.id)}" type="button">Edit</button></div>
  </article>`;
}

function renderStats() {
  $('#statProjects').textContent = projects.length;
  $('#statPublished').textContent = projects.filter(x=>x.status==='published'&&x.visibility==='public').length;
  $('#statNotes').textContent = notes.length;
  $('#statCvUpdated').textContent = currentCV?.updated_at ? fmt(currentCV.updated_at) : '—';
}

function renderAll() {
  $('#adminProjectsList').innerHTML = projects.length ? projects.map(x=>row(x,'projects')).join('') : '<div class="empty-state">No projects yet.</div>';
  $('#adminNotesList').innerHTML = notes.length ? notes.map(x=>row(x,'notes')).join('') : '<div class="empty-state">No notes yet.</div>';
  const combined = [...projects.map(x=>({...x,_type:'projects'})),...notes.map(x=>({...x,_type:'notes'}))].sort((a,b)=>new Date(b.updated_at)-new Date(a.updated_at)).slice(0,6);
  $('#recentList').innerHTML = combined.length ? combined.map(x=>row(x,x._type)).join('') : '<div class="empty-state">No content yet.</div>';
  renderStats();
}

async function loadData() {
  [projects,notes] = await Promise.all([Data.listAll('projects'),Data.listAll('notes')]);
  renderAll();
}

function showDashboard(session) {
  $('#loginView').classList.add('hidden');
  $('#dashboardView').classList.remove('hidden');
  $('#adminEmail').textContent = session?.user?.user_metadata?.username || session?.user?.username || window.PORTFOLIO_CONFIG?.AUTH_USERNAME || session?.user?.email || 'Owner';
  $('#modeBadge').textContent = 'Supabase • secure mode';
}

function openEditor(type,item=null) {
  currentType=type; currentItem=item;
  const form=$('#editorForm'); form.reset();
  form.elements.content_type.value=type;
  form.elements.id.value=item?.id || '';
  $('#editorEyebrow').textContent = type === 'projects' ? 'Project editor' : 'Technical note editor';
  $('#editorTitle').textContent = item ? `Edit ${type==='projects'?'project':'note'}` : `Add ${type==='projects'?'project':'note'}`;
  $('#deleteItemBtn').classList.toggle('hidden',!item);
  setMessage($('#editorMessage'),'');
  if(item) {
    ['title','category','visibility','status','summary','content','cover_url','document_url'].forEach(name=>form.elements[name].value=item[name]||'');
    form.elements.featured.value=String(Boolean(item.featured));
    form.elements.tags.value=(item.tags||[]).join(', ');
  } else {
    form.elements.visibility.value='public'; form.elements.status.value='published'; form.elements.featured.value='false';
    form.elements.category.value=type==='projects'?'software':'network';
  }
  $('#editorDialog').showModal();
}

async function saveEditor(e) {
  e.preventDefault();
  const form=e.currentTarget;
  const payload=Object.fromEntries(new FormData(form).entries());
  delete payload.content_type;
  payload.featured=payload.featured==='true';
  payload.tags=payload.tags.split(',').map(x=>x.trim()).filter(Boolean);
  if(!payload.id) delete payload.id;
  try {
    setMessage($('#editorMessage'),'Saving...');
    await Data.save(currentType,payload);
    await loadData();
    setMessage($('#editorMessage'),'Saved successfully.','success');
    setTimeout(()=>$('#editorDialog').close(),350);
  } catch(error) { setMessage($('#editorMessage'),error.message,'error'); }
}

async function deleteCurrent() {
  if(!currentItem || !confirm(`Delete “${currentItem.title}”?`)) return;
  try { await Data.remove(currentType,currentItem.id); await loadData(); $('#editorDialog').close(); }
  catch(error){ setMessage($('#editorMessage'),error.message,'error'); }
}

function switchView(name) {
  document.querySelectorAll('.admin-section').forEach(x=>x.classList.add('hidden'));
  $(`#${name}View`).classList.remove('hidden');
  document.querySelectorAll('.admin-nav button').forEach(x=>x.classList.toggle('active',x.dataset.view===name));
  $('#viewTitle').textContent=({overview:'Overview',cv:'CV Builder',projects:'Projects',notes:'Technical Notes',settings:'Website Settings'})[name];
}

async function loadSettings() {
  const settings=await Data.getSettings();
  const form=$('#settingsForm');
  ['headline','email','linkedin_url','location'].forEach(name=>form.elements[name].value=settings[name]||'');
}

function normalizeCV(cv) {
  const base = clone(Data.defaults.cv);
  const value = cv || {};
  return {
    ...base,
    ...value,
    profile: {...base.profile,...(value.profile||{})},
    section_visibility: {...base.section_visibility,...(value.section_visibility||{})},
    experience: Array.isArray(value.experience) ? value.experience : base.experience,
    skill_groups: Array.isArray(value.skill_groups) ? value.skill_groups : base.skill_groups,
    projects: Array.isArray(value.projects) ? value.projects : base.projects,
    education: Array.isArray(value.education) ? value.education : base.education,
    certifications: Array.isArray(value.certifications) ? value.certifications : base.certifications,
    languages: Array.isArray(value.languages) ? value.languages : base.languages,
    custom_sections: Array.isArray(value.custom_sections) ? value.custom_sections : base.custom_sections
  };
}

function input(label,field,value='',type='text',extra='') {
  return `<label>${label}<input data-field="${field}" type="${type}" value="${escapeAttr(value)}" ${extra}></label>`;
}

function textarea(label,field,value='',rows=4,format='') {
  return `<label class="span-2">${label}<textarea data-field="${field}" rows="${rows}" ${format?`data-format="${format}"`:''}>${escapeHtml(value)}</textarea></label>`;
}

function itemShell(array,index,title,body) {
  return `<article class="cv-edit-item" data-array="${array}" data-index="${index}">
    <div class="cv-edit-item-head"><strong>${escapeHtml(title)}</strong><button class="remove-item" data-remove="${array}" data-index="${index}" type="button">Remove</button></div>
    <div class="editor-grid">${body}</div>
  </article>`;
}

function renderExperience() {
  $('#experienceEditor').innerHTML = currentCV.experience.length ? currentCV.experience.map((item,index)=>itemShell('experience',index,item.role||`Position ${index+1}`,
    input('Job title','role',item.role)+input('Company','company',item.company)+input('Location','location',item.location)+input('Period','period',item.period)+textarea('Achievements — one bullet per line','bullets',(item.bullets||[]).join('\n'),6,'lines')
  )).join('') : '<div class="empty-state">No experience entries.</div>';
}

function renderSkillGroups() {
  $('#skillGroupsEditor').innerHTML = currentCV.skill_groups.length ? currentCV.skill_groups.map((item,index)=>itemShell('skill_groups',index,item.name||`Skill group ${index+1}`,
    input('Group name','name',item.name)+textarea('Skills — separate by commas','items',(item.items||[]).join(', '),4,'commas')
  )).join('') : '<div class="empty-state">No skill groups.</div>';
}

function renderCVProjects() {
  $('#cvProjectsEditor').innerHTML = currentCV.projects.length ? currentCV.projects.map((item,index)=>itemShell('projects',index,item.title||`Project ${index+1}`,
    input('Project title','title',item.title)+input('Subtitle / technologies','subtitle',item.subtitle)+textarea('Description','description',item.description,4)+input('Project URL','url',item.url,'url')
  )).join('') : '<div class="empty-state">No CV projects.</div>';
}

function renderEducation() {
  $('#educationEditor').innerHTML = currentCV.education.length ? currentCV.education.map((item,index)=>itemShell('education',index,item.degree||`Education ${index+1}`,
    input('Degree','degree',item.degree)+input('Institution','institution',item.institution)+input('Location','location',item.location)+input('Period','period',item.period)+textarea('Details','details',item.details,4)
  )).join('') : '<div class="empty-state">No education entries.</div>';
}

function renderCertifications() {
  $('#certificationsEditor').innerHTML = currentCV.certifications.length ? currentCV.certifications.map((item,index)=>itemShell('certifications',index,item.name||`Certificate ${index+1}`,
    input('Certification / course','name',item.name)+input('Issuer','issuer',item.issuer)+input('Year','year',item.year)
  )).join('') : '<div class="empty-state">No certifications.</div>';
}

function renderLanguages() {
  $('#languagesEditor').innerHTML = currentCV.languages.length ? currentCV.languages.map((item,index)=>itemShell('languages',index,item.name||`Language ${index+1}`,
    input('Language','name',item.name)+input('Level','level',item.level)
  )).join('') : '<div class="empty-state">No languages.</div>';
}

function renderCustomSections() {
  $('#customSectionsEditor').innerHTML = currentCV.custom_sections.length ? currentCV.custom_sections.map((item,index)=>itemShell('custom_sections',index,item.title||`Custom section ${index+1}`,
    input('Section title','title',item.title)+textarea('Content — one item per line','items',(item.items||[]).join('\n'),6,'lines')
  )).join('') : '<div class="empty-state">No custom sections. Add awards, volunteering, references or anything else.</div>';
}

function setCvSaveState(dirty) {
  cvDirty = dirty;
  $('#cvSaveState').textContent = dirty ? 'Unsaved CV changes' : 'All CV changes saved';
  $('#cvSaveState').classList.toggle('dirty',dirty);
}

function renderCV() {
  const form = $('#cvForm');
  Object.entries(currentCV.profile).forEach(([name,value])=>{ if(form.elements[name]) form.elements[name].value=value||''; });
  document.querySelectorAll('[data-section-visible]').forEach(el=>{el.checked=currentCV.section_visibility[el.dataset.sectionVisible]!==false;});
  renderExperience();
  renderSkillGroups();
  renderCVProjects();
  renderEducation();
  renderCertifications();
  renderLanguages();
  renderCustomSections();
  $('#cvUpdatedText').textContent = currentCV.updated_at ? `Latest saved version: ${fmt(currentCV.updated_at)}. The PDF is generated from this data.` : 'The PDF is generated from the latest saved version.';
  renderStats();
  setCvSaveState(false);
}

async function loadCV() {
  currentCV = normalizeCV(await Data.getCV());
  renderCV();
}

function updateCVFromInput(el) {
  if (!currentCV) return;
  if (el.dataset.sectionVisible) {
    currentCV.section_visibility[el.dataset.sectionVisible] = el.checked;
    setCvSaveState(true);
    return;
  }
  const item = el.closest('.cv-edit-item');
  if (item && el.dataset.field) {
    const array = item.dataset.array;
    const index = Number(item.dataset.index);
    let value = el.value;
    if (el.dataset.format === 'lines') value = value.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
    if (el.dataset.format === 'commas') value = value.split(',').map(x=>x.trim()).filter(Boolean);
    currentCV[array][index][el.dataset.field] = value;
    const title = item.querySelector('.cv-edit-item-head strong');
    if (['role','name','title','degree'].includes(el.dataset.field) && title) title.textContent = el.value || 'Untitled item';
    setCvSaveState(true);
    return;
  }
  if (el.name && Object.prototype.hasOwnProperty.call(currentCV.profile,el.name)) {
    currentCV.profile[el.name] = el.value;
    setCvSaveState(true);
  }
}

function newCVItem(type) {
  const id = Data.uid();
  const map = {
    experience:{id,role:'',company:'',location:'',period:'',bullets:[]},
    skill_groups:{id,name:'',items:[]},
    projects:{id,title:'',subtitle:'',description:'',url:''},
    education:{id,degree:'',institution:'',location:'',period:'',details:''},
    certifications:{id,name:'',issuer:'',year:''},
    languages:{id,name:'',level:''},
    custom_sections:{id,title:'',items:[]}
  };
  return map[type];
}

function renderCVArray(type) {
  ({experience:renderExperience,skill_groups:renderSkillGroups,projects:renderCVProjects,education:renderEducation,certifications:renderCertifications,languages:renderLanguages,custom_sections:renderCustomSections})[type]();
}

async function saveCV(showSuccess=true) {
  if (!currentCV) return;
  setMessage($('#cvMessage'),'Saving latest CV...');
  try {
    currentCV = normalizeCV(await Data.saveCV(currentCV));
    renderCV();
    if (showSuccess) setMessage($('#cvMessage'),'Latest CV saved. Preview and PDF download now use this version.','success');
    return true;
  } catch(error) {
    setMessage($('#cvMessage'),error.message,'error');
    return false;
  }
}

async function saveAndOpenCV(download=false) {
  const popup = window.open('about:blank','_blank');
  const ok = await saveCV(false);
  if (!ok) { if (popup) popup.close(); return; }
  const base = window.CV_PAGE_URL || 'cv.html';
  const url = download ? `${base}${base.includes('?')?'&':'?'}download=1&t=${Date.now()}` : `${base}${base.includes('?')?'&':'?'}t=${Date.now()}`;
  if (popup) popup.location.href = url;
  else window.location.href = url;
  setMessage($('#cvMessage'),download?'Saved. Generating the newest PDF...':'Saved. Opening the newest CV preview...','success');
}

$('#loginForm').addEventListener('submit',async e=>{
  e.preventDefault();
  setMessage($('#loginMessage'),'Signing in...');
  try { const result=await Data.login($('#loginUsername').value.trim(),$('#loginPassword').value); showDashboard(result); await Promise.all([loadData(),loadSettings(),loadCV()]); }
  catch(error){ setMessage($('#loginMessage'),error.message,'error'); }
});

$('#logoutBtn').addEventListener('click',async()=>{ await Data.logout(); location.reload(); });
document.querySelector('.admin-nav').addEventListener('click',e=>{const btn=e.target.closest('button[data-view]');if(btn)switchView(btn.dataset.view);});
$('#addProjectBtn').addEventListener('click',()=>openEditor('projects'));
$('#addNoteBtn').addEventListener('click',()=>openEditor('notes'));
document.addEventListener('click',e=>{
  const edit=e.target.closest('.edit-btn');
  if(edit){const list=edit.dataset.type==='projects'?projects:notes;openEditor(edit.dataset.type,list.find(x=>x.id===edit.dataset.id));return;}
  const add=e.target.closest('[data-add]');
  if(add){const type=add.dataset.add;currentCV[type].push(newCVItem(type));renderCVArray(type);setCvSaveState(true);return;}
  const remove=e.target.closest('[data-remove]');
  if(remove){const type=remove.dataset.remove;const index=Number(remove.dataset.index);currentCV[type].splice(index,1);renderCVArray(type);setCvSaveState(true);}
});
$('#editorForm').addEventListener('submit',saveEditor);
$('#deleteItemBtn').addEventListener('click',deleteCurrent);
$('#editorClose').addEventListener('click',()=>$('#editorDialog').close());
$('#cancelEditorBtn').addEventListener('click',()=>$('#editorDialog').close());
$('#settingsForm').addEventListener('submit',async e=>{e.preventDefault();try{const data=Object.fromEntries(new FormData(e.currentTarget).entries());await Data.saveSettings(data);setMessage($('#settingsMessage'),'Settings saved.','success');}catch(error){setMessage($('#settingsMessage'),error.message,'error');}});
$('#cvForm').addEventListener('input',e=>updateCVFromInput(e.target));
$('#cvForm').addEventListener('change',e=>updateCVFromInput(e.target));
$('#cvForm').addEventListener('submit',async e=>{e.preventDefault();await saveCV(true);});
$('#previewCvBtn').addEventListener('click',e=>{e.preventDefault();saveAndOpenCV(false);});
$('#downloadLatestCvBtn').addEventListener('click',e=>{e.preventDefault();saveAndOpenCV(true);});
window.addEventListener('beforeunload',e=>{if(cvDirty){e.preventDefault();e.returnValue='';}});

(async()=>{
  if (!Data.isConfigured) {
    document.querySelector('.login-card')?.classList.add('backend-missing');
    setMessage($('#loginMessage'),'Secure login is disabled until Supabase is configured. No password exists in the website source.','error');
    return;
  }
  const session=await Data.getSession();
  if(session && await Data.ensureAdmin()) { showDashboard(session); await Promise.all([loadData(),loadSettings(),loadCV()]); }
})();
