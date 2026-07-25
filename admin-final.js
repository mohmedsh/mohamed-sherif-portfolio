(() => {
  'use strict';
  const API = window.PortfolioAPI;
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const escapeAttr = escapeHtml;
  const fmt = value => value ? new Intl.DateTimeFormat('en-GB', { day:'2-digit', month:'short', year:'numeric' }).format(new Date(value)) : '—';

  let projects = [];
  let notes = [];
  let currentCV = null;
  let currentType = null;
  let currentItem = null;
  let cvDirty = false;

  function setMessage(element, text, type = '') {
    element.textContent = text || '';
    element.className = `form-message ${type}`;
  }

  function setBusy(element, busy) {
    element.classList.toggle('busy', busy);
    for (const control of element.querySelectorAll('button,input,textarea,select')) control.disabled = busy;
  }

  function contentRow(item, type) {
    const visibilityClass = item.visibility === 'public' ? 'public' : item.visibility === 'private' ? 'private' : '';
    return `<article class="content-row"><div class="content-info"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.summary)} • Updated ${fmt(item.updated_at)}</p></div><div class="row-meta"><span class="${visibilityClass}">${escapeHtml(item.visibility)}</span><span>${escapeHtml(item.status)}</span><span>${escapeHtml(item.category)}</span><button class="edit-btn" data-edit-type="${type}" data-edit-id="${escapeAttr(item.id)}" type="button">Edit</button></div></article>`;
  }

  function renderStats() {
    $('#statProjects').textContent = projects.length;
    $('#statPublished').textContent = projects.filter(item => item.status === 'published' && item.visibility === 'public').length;
    $('#statNotes').textContent = notes.length;
    $('#statCvUpdated').textContent = currentCV?.updated_at ? fmt(currentCV.updated_at) : '—';
  }

  function renderContent() {
    $('#adminProjectsList').innerHTML = projects.length ? projects.map(item => contentRow(item, 'projects')).join('') : '<div class="empty-state">No projects yet.</div>';
    $('#adminNotesList').innerHTML = notes.length ? notes.map(item => contentRow(item, 'notes')).join('') : '<div class="empty-state">No technical notes yet.</div>';
    const recent = [
      ...projects.map(item => ({ ...item, _type:'projects' })),
      ...notes.map(item => ({ ...item, _type:'notes' }))
    ].sort((a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0)).slice(0, 7);
    $('#recentList').innerHTML = recent.length ? recent.map(item => contentRow(item, item._type)).join('') : '<div class="empty-state">No content yet.</div>';
    renderStats();
  }

  async function loadContent() {
    [projects, notes] = await Promise.all([API.listAll('projects'), API.listAll('notes')]);
    renderContent();
  }

  function showDashboard(session) {
    $('#loginView').classList.add('hidden');
    $('#dashboardView').classList.remove('hidden');
    $('#adminEmail').textContent = session?.user?.email || 'Owner';
  }

  function switchView(name) {
    $$('.admin-section').forEach(section => section.classList.add('hidden'));
    $(`#${name}View`).classList.remove('hidden');
    $$('.admin-nav button').forEach(button => button.classList.toggle('active', button.dataset.view === name));
    $('#viewTitle').textContent = ({ overview:'Overview', cv:'CV Builder', projects:'Projects', notes:'Technical Notes', settings:'Website Settings' })[name] || 'Overview';
  }

  function openEditor(type, item = null) {
    currentType = type;
    currentItem = item;
    const form = $('#editorForm');
    form.reset();
    form.elements.content_type.value = type;
    form.elements.id.value = item?.id || '';
    $('#editorEyebrow').textContent = type === 'projects' ? 'Project editor' : 'Technical note editor';
    $('#editorTitle').textContent = item ? `Edit ${type === 'projects' ? 'project' : 'note'}` : `Add ${type === 'projects' ? 'project' : 'note'}`;
    $('#deleteItemBtn').classList.toggle('hidden', !item);
    setMessage($('#editorMessage'), '');
    if (item) {
      for (const name of ['title','category','visibility','status','summary','content','cover_url','document_url','sort_order']) {
        if (form.elements[name]) form.elements[name].value = item[name] ?? '';
      }
      form.elements.featured.value = String(Boolean(item.featured));
      form.elements.tags.value = (item.tags || []).join(', ');
    } else {
      form.elements.visibility.value = 'public';
      form.elements.status.value = 'published';
      form.elements.featured.value = 'false';
      form.elements.category.value = type === 'projects' ? 'software' : 'network';
      form.elements.sort_order.value = '100';
    }
    $('#editorDialog').showModal();
  }

  async function saveEditor(event) {
    event.preventDefault();
    const form = event.currentTarget;
    setBusy(form, true);
    setMessage($('#editorMessage'), 'Saving securely...');
    try {
      const visibility = form.elements.visibility.value;
      let coverUrl = form.elements.cover_url.value.trim();
      let documentUrl = form.elements.document_url.value.trim();
      const coverFile = form.elements.cover_file.files?.[0];
      const documentFile = form.elements.document_file.files?.[0];
      if (coverFile) {
        setMessage($('#editorMessage'), 'Uploading cover image...');
        coverUrl = await API.uploadFile(coverFile, { visibility, folder:`${currentType}/covers` });
      }
      if (documentFile) {
        setMessage($('#editorMessage'), 'Uploading document...');
        documentUrl = await API.uploadFile(documentFile, { visibility, folder:`${currentType}/documents` });
      }
      const payload = {
        id: form.elements.id.value || undefined,
        title: form.elements.title.value,
        category: form.elements.category.value,
        visibility,
        status: form.elements.status.value,
        featured: form.elements.featured.value === 'true',
        sort_order: Number(form.elements.sort_order.value || 100),
        summary: form.elements.summary.value,
        content: form.elements.content.value,
        tags: form.elements.tags.value.split(',').map(value => value.trim()).filter(Boolean),
        cover_url: coverUrl,
        document_url: documentUrl
      };
      await API.saveItem(currentType, payload);
      await loadContent();
      setMessage($('#editorMessage'), 'Saved successfully.', 'success');
      setTimeout(() => $('#editorDialog').close(), 450);
    } catch (error) {
      setMessage($('#editorMessage'), API.errorMessage(error), 'error');
    } finally {
      setBusy(form, false);
    }
  }

  async function deleteCurrent() {
    if (!currentItem || !confirm(`Delete “${currentItem.title}”?`)) return;
    try {
      await API.deleteItem(currentType, currentItem.id);
      await loadContent();
      $('#editorDialog').close();
    } catch (error) {
      setMessage($('#editorMessage'), API.errorMessage(error), 'error');
    }
  }

  async function loadSettings() {
    const settings = await API.getSettings();
    const form = $('#settingsForm');
    for (const name of ['headline','email','linkedin_url','cv_url','location']) form.elements[name].value = settings[name] || '';
  }

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

  function input(label, field, value = '', type = 'text', extra = '') {
    return `<label>${label}<input type="${type}" data-field="${field}" value="${escapeAttr(value)}" ${extra}></label>`;
  }
  function textarea(label, field, value = '', rows = 4, format = '') {
    return `<label class="span-2">${label}<textarea data-field="${field}" data-format="${format}" rows="${rows}">${escapeHtml(value)}</textarea></label>`;
  }

  function renderProfile() {
    const profile = currentCV.profile;
    $('#profileEditor').innerHTML = [
      input('Full name','full_name',profile.full_name), input('Professional title','title',profile.title),
      input('Email','email',profile.email,'email'), input('Phone','phone',profile.phone),
      input('Location','location',profile.location), input('LinkedIn URL','linkedin',profile.linkedin,'url'),
      input('GitHub URL','github',profile.github,'url'), input('Personal website','website',profile.website,'url'),
      textarea('Professional summary','summary',profile.summary,5)
    ].join('');
  }

  const cvSchemas = {
    experience: { container:'#experienceEditor', title:item => item.role || 'Untitled position', fields:[['Role','role'],['Company','company'],['Location','location'],['Period','period'],['Achievements','bullets','textarea','lines']] },
    skill_groups: { container:'#skillGroupsEditor', title:item => item.name || 'Untitled skill group', fields:[['Group name','name'],['Skills (comma separated)','items','textarea','commas']] },
    projects: { container:'#cvProjectsEditor', title:item => item.title || 'Untitled project', fields:[['Title','title'],['Subtitle','subtitle'],['URL','url'],['Description','description','textarea','']] },
    education: { container:'#educationEditor', title:item => item.degree || 'Untitled education', fields:[['Degree','degree'],['Institution','institution'],['Location','location'],['Period','period'],['Details','details','textarea','']] },
    certifications: { container:'#certificationsEditor', title:item => item.name || 'Untitled certificate', fields:[['Name','name'],['Issuer','issuer'],['Year','year']] },
    languages: { container:'#languagesEditor', title:item => item.name || 'Untitled language', fields:[['Language','name'],['Level','level']] },
    custom_sections: { container:'#customSectionsEditor', title:item => item.title || 'Untitled section', fields:[['Section title','title'],['Items (one per line)','items','textarea','lines']] }
  };

  function renderCvArray(type) {
    const schema = cvSchemas[type];
    const list = currentCV[type] || [];
    $(schema.container).innerHTML = list.map((item, index) => {
      const fields = schema.fields.map(([label, field, kind, format]) => {
        const raw = item[field] ?? '';
        const value = Array.isArray(raw) ? raw.join(format === 'commas' ? ', ' : '\n') : raw;
        if (kind === 'textarea') return textarea(label, field, value, 4, format);
        return input(label, field, value, field === 'url' ? 'url' : 'text');
      }).join('');
      return `<article class="cv-edit-item" data-array="${type}" data-index="${index}"><div class="cv-edit-item-head"><strong>${escapeHtml(schema.title(item))}</strong><button class="remove-cv-item" type="button" data-remove-cv="${type}" data-index="${index}">Remove</button></div><div class="editor-grid">${fields}</div></article>`;
    }).join('') || '<div class="empty-state">No items. Use the add button above.</div>';
  }

  function renderCV() {
    renderProfile();
    for (const type of Object.keys(cvSchemas)) renderCvArray(type);
    $$('[data-section-visible]').forEach(inputElement => { inputElement.checked = Boolean(currentCV.section_visibility[inputElement.dataset.sectionVisible]); });
    $('#cvUpdatedText').textContent = currentCV.updated_at ? `Latest saved version: ${fmt(currentCV.updated_at)}.` : 'The PDF uses the latest saved cloud version.';
    renderStats();
    setCvDirty(false);
  }

  function setCvDirty(value) {
    cvDirty = value;
    $('#cvSaveState').textContent = value ? 'Unsaved changes' : 'No unsaved changes';
  }

  function newCvItem(type) {
    const id = API.uid();
    const map = {
      experience:{ id, role:'', company:'', location:'', period:'', bullets:[] },
      skill_groups:{ id, name:'', items:[] },
      projects:{ id, title:'', subtitle:'', description:'', url:'' },
      education:{ id, degree:'', institution:'', location:'', period:'', details:'' },
      certifications:{ id, name:'', issuer:'', year:'' },
      languages:{ id, name:'', level:'' },
      custom_sections:{ id, title:'', items:[] }
    };
    return map[type];
  }

  function updateCVFromControl(control) {
    if (!currentCV) return;
    if (control.dataset.sectionVisible) {
      currentCV.section_visibility[control.dataset.sectionVisible] = control.checked;
      setCvDirty(true);
      return;
    }
    const itemElement = control.closest('.cv-edit-item');
    if (itemElement && control.dataset.field) {
      const type = itemElement.dataset.array;
      const index = Number(itemElement.dataset.index);
      let value = control.value;
      if (control.dataset.format === 'lines') value = value.split(/\r?\n/).map(text => text.trim()).filter(Boolean);
      if (control.dataset.format === 'commas') value = value.split(',').map(text => text.trim()).filter(Boolean);
      currentCV[type][index][control.dataset.field] = value;
      setCvDirty(true);
      return;
    }
    if (control.dataset.field && Object.prototype.hasOwnProperty.call(currentCV.profile, control.dataset.field)) {
      currentCV.profile[control.dataset.field] = control.value;
      setCvDirty(true);
    }
  }

  async function loadCV() {
    currentCV = normalizeCV(await API.getCV());
    renderCV();
  }

  async function saveCV(showSuccess = true) {
    if (!currentCV) return false;
    setMessage($('#cvMessage'), 'Saving latest CV...');
    try {
      currentCV = normalizeCV(await API.saveCV(currentCV));
      renderCV();
      if (showSuccess) setMessage($('#cvMessage'), 'Latest CV saved. Preview and PDF now use this version.', 'success');
      return true;
    } catch (error) {
      setMessage($('#cvMessage'), API.errorMessage(error), 'error');
      return false;
    }
  }

  async function saveAndOpenCV(download = false) {
    const popup = window.open('about:blank', '_blank');
    const saved = await saveCV(false);
    if (!saved) { if (popup) popup.close(); return; }
    const url = `cv.html?${download ? 'download=1&' : ''}v=${Date.now()}`;
    if (popup) popup.location.href = url; else window.location.href = url;
  }

  async function loadDashboard() {
    await Promise.all([loadContent(), loadSettings(), loadCV()]);
  }

  $('#loginForm').addEventListener('submit', async event => {
    event.preventDefault();
    setBusy(event.currentTarget, true);
    setMessage($('#loginMessage'), 'Signing in securely...');
    try {
      const result = await API.signIn($('#loginUsername').value.trim(), $('#loginPassword').value);
      showDashboard(result.session || { user:result.user });
      await loadDashboard();
    } catch (error) {
      setMessage($('#loginMessage'), API.errorMessage(error), 'error');
    } finally {
      setBusy(event.currentTarget, false);
    }
  });

  $('#logoutBtn').addEventListener('click', async () => { await API.signOut(); location.reload(); });
  $('.admin-nav').addEventListener('click', event => { const button = event.target.closest('button[data-view]'); if (button) switchView(button.dataset.view); });
  $('#addProjectBtn').addEventListener('click', () => openEditor('projects'));
  $('#addNoteBtn').addEventListener('click', () => openEditor('notes'));
  $('#editorForm').addEventListener('submit', saveEditor);
  $('#deleteItemBtn').addEventListener('click', deleteCurrent);
  $('#editorClose').addEventListener('click', () => $('#editorDialog').close());
  $('#cancelEditorBtn').addEventListener('click', () => $('#editorDialog').close());
  $('#settingsForm').addEventListener('submit', async event => {
    event.preventDefault();
    setBusy(event.currentTarget, true);
    try {
      const values = Object.fromEntries(new FormData(event.currentTarget).entries());
      await API.saveSettings(values);
      setMessage($('#settingsMessage'), 'Website settings saved.', 'success');
    } catch (error) {
      setMessage($('#settingsMessage'), API.errorMessage(error), 'error');
    } finally { setBusy(event.currentTarget, false); }
  });
  $('#cvForm').addEventListener('input', event => updateCVFromControl(event.target));
  $('#cvForm').addEventListener('change', event => updateCVFromControl(event.target));
  $('#cvForm').addEventListener('submit', async event => { event.preventDefault(); await saveCV(true); });
  $('#previewCvBtn').addEventListener('click', () => saveAndOpenCV(false));
  $('#downloadLatestCvBtn').addEventListener('click', () => saveAndOpenCV(true));
  $('#seedBtn').addEventListener('click', async () => {
    setMessage($('#overviewMessage'), 'Checking starter content...');
    try { await API.seedOwnerData(); await loadDashboard(); setMessage($('#overviewMessage'), 'Starter content is ready.', 'success'); }
    catch (error) { setMessage($('#overviewMessage'), API.errorMessage(error), 'error'); }
  });

  document.addEventListener('click', event => {
    const edit = event.target.closest('[data-edit-type]');
    if (edit) {
      const list = edit.dataset.editType === 'projects' ? projects : notes;
      openEditor(edit.dataset.editType, list.find(item => item.id === edit.dataset.editId));
      return;
    }
    const add = event.target.closest('[data-add-cv]');
    if (add) {
      const type = add.dataset.addCv;
      currentCV[type].push(newCvItem(type));
      renderCvArray(type);
      setCvDirty(true);
      return;
    }
    const remove = event.target.closest('[data-remove-cv]');
    if (remove) {
      const type = remove.dataset.removeCv;
      currentCV[type].splice(Number(remove.dataset.index), 1);
      renderCvArray(type);
      setCvDirty(true);
    }
  });

  window.addEventListener('beforeunload', event => { if (cvDirty) { event.preventDefault(); event.returnValue = ''; } });

  (async () => {
    if (!API.configured) {
      setMessage($('#loginMessage'), 'Supabase configuration is missing. Upload the complete final project again.', 'error');
      return;
    }
    try {
      const session = await API.getSession();
      if (session && await API.isOwner()) {
        await API.seedOwnerData();
        showDashboard(session);
        await loadDashboard();
      }
    } catch (error) {
      console.error(error);
      setMessage($('#loginMessage'), 'Session check failed. Sign in again.', 'error');
    }
  })();
})();
