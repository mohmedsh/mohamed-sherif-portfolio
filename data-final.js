(() => {
  'use strict';

  const cfg = window.PORTFOLIO_CONFIG || {};
  const configured = Boolean(
    window.supabase &&
    cfg.SUPABASE_URL &&
    cfg.SUPABASE_ANON_KEY &&
    !String(cfg.SUPABASE_URL).includes('YOUR_') &&
    !String(cfg.SUPABASE_ANON_KEY).includes('YOUR_')
  );

  const client = configured
    ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      })
    : null;

  const clone = value => JSON.parse(JSON.stringify(value));
  const now = () => new Date().toISOString();
  const uid = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);

  const defaults = {
    settings: {
      id: 1,
      headline: 'Network Infrastructure & Security Engineer',
      email: 'mohmedsherif599@gmail.com',
      linkedin_url: 'https://www.linkedin.com/',
      cv_url: 'cv.html',
      location: '6th of October City, Giza, Egypt'
    },
    projects: [
      {
        title: 'Fleet Request Management System', category: 'software', visibility: 'public', status: 'published', featured: true,
        summary: 'Enterprise vehicle-request workflow covering approvals, availability, conflicts, procurement, allocation and reporting.',
        content: 'A multi-role workflow for requesters, fleet operations and procurement. The solution validates booking windows, prevents vehicle and driver conflicts, supports internal assignment or rental, and provides dashboards, reports, audit trails and email notifications.',
        tags: ['Python', 'Flask', 'Workflow', 'Fleet', 'RBAC'], cover_url: '', document_url: '', sort_order: 1
      },
      {
        title: 'Zabbix Availability & Performance Engine', category: 'network', visibility: 'public', status: 'published', featured: true,
        summary: 'Automated weekly and monthly availability reporting with event merging, filtering, rankings and management-ready output.',
        content: 'A Python and Flask reporting engine that processes Zabbix data, classifies downtime and performance events, merges short incident windows, calculates availability and produces branded operational reports.',
        tags: ['Zabbix', 'Python', 'Flask', 'Monitoring', 'Reporting'], cover_url: '', document_url: '', sort_order: 2
      },
      {
        title: 'Enterprise Network & Security Operations', category: 'security', visibility: 'public', status: 'published', featured: true,
        summary: 'Operational support for a multi-site Cisco and Fortinet environment serving production facilities and enterprise users.',
        content: 'Hands-on operations across Cisco C9500 core, C9300 distribution, C9200L access, FortiGate 201G HA, Cisco WLC 9800 HA, VMware, Windows Server and enterprise monitoring.',
        tags: ['Cisco', 'FortiGate', 'WLC 9800', 'SD-WAN', 'HA'], cover_url: '', document_url: '', sort_order: 3
      },
      {
        title: 'Soft4U Market ERP', category: 'software', visibility: 'public', status: 'published', featured: false,
        summary: 'Retail ERP covering POS, inventory, purchasing, batches, returns, accounting, RBAC and audit workflows.',
        content: 'A modular retail ERP designed for practical store operations, including barcode sales, batches and expiry management, supplier purchases, inventory movements, accounting reports and access control.',
        tags: ['ERP', 'POS', 'Inventory', 'Accounting', 'RBAC'], cover_url: '', document_url: '', sort_order: 4
      }
    ],
    notes: [
      {
        title: 'OSPF Operation: Start, Convergence & Change', category: 'network', visibility: 'public', status: 'published', featured: true,
        summary: 'Structured explanation of OSPF neighbor formation, LSDB synchronization, SPF calculation and reconvergence.',
        content: 'Covers router IDs, hello packets, neighbor states, DR and BDR behavior, LSA flooding, SPF calculation and the sequence triggered when a link or network changes.',
        tags: ['OSPF', 'LSA', 'SPF'], cover_url: '', document_url: '', sort_order: 1
      },
      {
        title: 'RCNA-WLAN Fundamentals with Cisco Comparison', category: 'wireless', visibility: 'public', status: 'published', featured: true,
        summary: 'Wireless fundamentals explained alongside equivalent Cisco architecture and terminology.',
        content: 'Covers RF basics, channels, roaming, WLAN architecture, access points, controllers, security and vendor terminology comparisons.',
        tags: ['WLAN', 'RCNA', 'Cisco'], cover_url: '', document_url: '', sort_order: 2
      },
      {
        title: 'FortiGate HA, SD-WAN & Security Operations', category: 'security', visibility: 'public', status: 'published', featured: false,
        summary: 'Operational notes for HA, SD-WAN rules, VPN, FSSO, NAT and security profiles.',
        content: 'A field-oriented reference covering high availability, session synchronization, SD-WAN steering, NAT and VIP, VPN troubleshooting, FSSO, captive portal and security inspection.',
        tags: ['FortiGate', 'HA', 'SD-WAN'], cover_url: '', document_url: '', sort_order: 3
      },
      {
        title: 'Route Redistribution & Filtering', category: 'network', visibility: 'public', status: 'published', featured: false,
        summary: 'Redistribution design, route tags, metrics and filtering strategies explained with practical logic.',
        content: 'Explains why redistribution is required, how routing information crosses protocol boundaries, and how filtering and route tagging prevent feedback and unwanted advertisements.',
        tags: ['Redistribution', 'Filtering', 'Routing'], cover_url: '', document_url: '', sort_order: 4
      }
    ],
    cv: {
      updated_at: now(),
      profile: {
        full_name: 'Mohamed Sherif Abdelaziz Sand',
        title: 'Network Infrastructure & Security Engineer',
        email: 'mohmedsherif599@gmail.com',
        phone: '',
        location: '6th of October City, Giza, Egypt',
        linkedin: 'https://www.linkedin.com/',
        github: 'https://github.com/mohmedsh',
        website: 'https://mohmedsh.github.io/mohamed-sherif-portfolio/',
        summary: 'Network Infrastructure & Security Engineer with hands-on experience supporting multi-site enterprise environments. Experienced with Cisco switching and wireless, FortiGate security, Windows Server, VMware, Zabbix monitoring and Python/Flask automation.'
      },
      section_visibility: {
        experience: true, skills: true, projects: true, education: true,
        certifications: true, languages: true, custom: true
      },
      experience: [
        {
          id: uid(), role: 'IT Engineer — Network Responsibilities', company: 'Canal Sugar', location: 'Cairo, Egypt', period: 'Nov 2025 – Present',
          bullets: [
            'Support enterprise infrastructure across three production sites serving approximately 750 users.',
            'Operate Cisco C9500/C9300/C9200L switching, FortiGate 201G HA, Cisco WLC 9800 HA, wireless and monitoring platforms.',
            'Manage VLANs, LACP, spanning tree, ACLs, DHCP relay, SD-WAN, NAT, VPN, FSSO and captive portal services.',
            'Develop Python/Flask tools for availability reporting, incidents, change control and operational dashboards.'
          ]
        },
        {
          id: uid(), role: 'IT Helpdesk Specialist / IT Senior Executive', company: 'ISON Xperiences', location: 'Egypt', period: 'Jul 2024 – Nov 2025',
          bullets: [
            'Supported more than 1,200 users across Active Directory, VPN, LAN/Wi-Fi, Outlook, printers and endpoints.',
            'Handled 20+ incidents daily while maintaining approximately 95% SLA performance.'
          ]
        },
        {
          id: uid(), role: 'Technical Support Specialist', company: 'Brains Company', location: 'Egypt', period: 'Jun 2022 – Apr 2023',
          bullets: ['Provided Windows, Microsoft 365, printer, VPN, Active Directory and desktop support.']
        }
      ],
      skill_groups: [
        { id: uid(), name: 'Networking', items: ['Cisco C9500/C9300/C9200L', 'VLANs', 'STP/RSTP', 'LACP', 'OSPF', 'EIGRP', 'BGP', 'ACLs', 'NAT', 'VPN'] },
        { id: uid(), name: 'Security', items: ['FortiGate HA', 'SD-WAN', 'FSSO', 'SSL VPN', 'IPsec VPN', 'IPS', 'Antivirus', 'Web Filtering', 'F5 LTM/ASM', 'Wazuh SIEM'] },
        { id: uid(), name: 'Systems & Tools', items: ['Windows Server', 'Active Directory', 'DNS', 'DHCP', 'VMware ESXi', 'Linux', 'Zabbix', 'Python', 'Flask', 'GitHub'] }
      ],
      projects: [
        { id: uid(), title: 'Fleet Request Management System', subtitle: 'Python / Flask workflow platform', description: 'Designed a multi-role request, approval, allocation, rental and reporting workflow with availability and conflict controls.', url: '' },
        { id: uid(), title: 'Zabbix Availability & Performance Engine', subtitle: 'Monitoring automation', description: 'Built weekly/monthly availability reporting, event merging, Top 10 analysis, date filters and scheduled email delivery.', url: '' },
        { id: uid(), title: 'Unified IT Operations Portal', subtitle: 'Incident and change management', description: 'Created RBAC-based incident, change, audit, reporting and health-check modules for internal IT operations.', url: '' }
      ],
      education: [
        { id: uid(), degree: 'B.Sc. in Computer Science', institution: 'Minia University', location: 'Egypt', period: '2018 – 2022', details: 'Excellent with Honors. Graduation Project: Computer Network Infrastructure — Excellent.' }
      ],
      certifications: [
        { id: uid(), name: 'CCNA & CCNP Enterprise Training', issuer: 'NTI / Brains', year: '' },
        { id: uid(), name: 'FortiGate Security Training', issuer: 'Self-study / Hands-on', year: '' },
        { id: uid(), name: 'F5 LTM & ASM WAF Training', issuer: '', year: '' },
        { id: uid(), name: 'Kaspersky Endpoint & EDR Training', issuer: '', year: '' }
      ],
      languages: [
        { id: uid(), name: 'Arabic', level: 'Native' },
        { id: uid(), name: 'English', level: 'Professional working proficiency' }
      ],
      custom_sections: []
    }
  };

  function errorMessage(error, fallback = 'Something went wrong.') {
    if (!error) return fallback;
    return error.message || error.error_description || fallback;
  }

  async function requireOwner() {
    if (!client) throw new Error('Supabase is not configured.');
    const { data: { session }, error: sessionError } = await client.auth.getSession();
    if (sessionError) throw sessionError;
    if (!session) throw new Error('Please sign in again.');
    const { data, error } = await client.from('profiles').select('role').eq('id', session.user.id).maybeSingle();
    if (error) throw error;
    if (data?.role !== 'owner') throw new Error('This account does not have owner access.');
    return session;
  }

  function normalizeItem(item, table) {
    const allowed = ['id', 'title', 'category', 'visibility', 'status', 'featured', 'summary', 'content', 'tags', 'cover_url', 'document_url', 'sort_order'];
    const payload = {};
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(item, key)) payload[key] = item[key];
    }
    if (!payload.id || String(payload.id).startsWith('seed-')) delete payload.id;
    payload.title = String(payload.title || '').trim();
    payload.category = String(payload.category || (table === 'projects' ? 'software' : 'network'));
    payload.visibility = String(payload.visibility || 'public');
    payload.status = String(payload.status || 'draft');
    payload.featured = Boolean(payload.featured);
    payload.summary = String(payload.summary || '').trim();
    payload.content = String(payload.content || '').trim();
    payload.tags = Array.isArray(payload.tags) ? payload.tags.map(String).map(x => x.trim()).filter(Boolean) : [];
    payload.cover_url = String(payload.cover_url || '').trim();
    payload.document_url = String(payload.document_url || '').trim();
    payload.sort_order = Number.isFinite(Number(payload.sort_order)) ? Number(payload.sort_order) : 100;
    return payload;
  }

  async function seedOwnerData() {
    await requireOwner();

    for (const table of ['projects', 'notes']) {
      const { count, error } = await client.from(table).select('*', { count: 'exact', head: true });
      if (error) throw error;
      if (!count) {
        const rows = defaults[table].map(item => normalizeItem(item, table));
        const { error: insertError } = await client.from(table).insert(rows);
        if (insertError) throw insertError;
      }
    }

    const { data: cvRow, error: cvError } = await client.from('cv_documents').select('id,data').eq('id', 1).maybeSingle();
    if (cvError) throw cvError;
    if (!cvRow || !cvRow.data || Object.keys(cvRow.data).length === 0) {
      const { error } = await client.from('cv_documents').upsert({ id: 1, data: defaults.cv, updated_at: now() });
      if (error) throw error;
    }

    const { data: settingsRow, error: settingsError } = await client.from('site_settings').select('*').eq('id', 1).maybeSingle();
    if (settingsError) throw settingsError;
    if (!settingsRow) {
      const { error } = await client.from('site_settings').insert(defaults.settings);
      if (error) throw error;
    } else if (!settingsRow.email) {
      const { error } = await client.from('site_settings').update({ email: defaults.settings.email, location: defaults.settings.location, cv_url: 'cv.html' }).eq('id', 1);
      if (error) throw error;
    }
  }

  async function resolvePrivateAsset(value, expiresIn = 3600) {
    if (!value || !String(value).startsWith('private:')) return value || '';
    const path = String(value).slice('private:'.length);
    const { data, error } = await client.storage.from('portfolio-private').createSignedUrl(path, expiresIn);
    if (error) throw error;
    return data?.signedUrl || '';
  }

  const API = {
    client,
    configured,
    defaults,
    uid,
    clone,
    errorMessage,

    async signIn(username, password) {
      if (!client) throw new Error('Supabase connection is not configured.');
      const expectedUsername = String(cfg.AUTH_USERNAME || '').trim();
      if (String(username).trim() !== expectedUsername) throw new Error('Incorrect username or password.');
      const email = String(cfg.AUTH_EMAIL || '').trim();
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (error) throw new Error('Incorrect username or password.');
      try {
        await requireOwner();
        await seedOwnerData();
      } catch (ownerError) {
        await client.auth.signOut();
        throw ownerError;
      }
      return data;
    },

    async signOut() {
      if (client) await client.auth.signOut();
    },

    async getSession() {
      if (!client) return null;
      const { data, error } = await client.auth.getSession();
      if (error) throw error;
      return data.session;
    },

    async isOwner() {
      try { await requireOwner(); return true; }
      catch { return false; }
    },

    async seedOwnerData() {
      return seedOwnerData();
    },

    async listPublic(table) {
      if (!client) return clone(defaults[table]);
      const { data, error } = await client.from(table)
        .select('*')
        .eq('visibility', 'public')
        .eq('status', 'published')
        .order('sort_order', { ascending: true })
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return data?.length ? data : clone(defaults[table]);
    },

    async listAll(table) {
      await requireOwner();
      const { data, error } = await client.from(table)
        .select('*')
        .order('sort_order', { ascending: true })
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },

    async saveItem(table, item) {
      await requireOwner();
      const payload = normalizeItem(item, table);
      payload.updated_at = now();
      let result;
      if (payload.id) {
        const id = payload.id;
        delete payload.id;
        result = await client.from(table).update(payload).eq('id', id).select().single();
      } else {
        result = await client.from(table).insert(payload).select().single();
      }
      if (result.error) throw result.error;
      return result.data;
    },

    async deleteItem(table, id) {
      await requireOwner();
      const { error } = await client.from(table).delete().eq('id', id);
      if (error) throw error;
    },

    async getSettings() {
      if (!client) return clone(defaults.settings);
      const { data, error } = await client.from('site_settings').select('*').eq('id', 1).maybeSingle();
      if (error) throw error;
      return { ...clone(defaults.settings), ...(data || {}) };
    },

    async saveSettings(settings) {
      await requireOwner();
      const payload = {
        id: 1,
        headline: String(settings.headline || defaults.settings.headline).trim(),
        email: String(settings.email || '').trim(),
        linkedin_url: String(settings.linkedin_url || '').trim(),
        cv_url: String(settings.cv_url || 'cv.html').trim(),
        location: String(settings.location || '').trim(),
        updated_at: now()
      };
      const { data, error } = await client.from('site_settings').upsert(payload).select().single();
      if (error) throw error;
      return data;
    },

    async getCV() {
      if (!client) return clone(defaults.cv);
      const { data, error } = await client.from('cv_documents').select('data,updated_at').eq('id', 1).maybeSingle();
      if (error) throw error;
      if (!data?.data || Object.keys(data.data).length === 0) return clone(defaults.cv);
      return { ...clone(defaults.cv), ...data.data, updated_at: data.updated_at || data.data.updated_at || now() };
    },

    async saveCV(cv) {
      await requireOwner();
      const value = clone(cv);
      value.updated_at = now();
      const { data, error } = await client.from('cv_documents')
        .upsert({ id: 1, data: value, updated_at: value.updated_at })
        .select('data,updated_at')
        .single();
      if (error) throw error;
      return { ...data.data, updated_at: data.updated_at };
    },

    async uploadFile(file, { visibility = 'public', folder = 'files' } = {}) {
      await requireOwner();
      if (!(file instanceof File) || !file.size) throw new Error('Choose a valid file first.');
      if (file.size > 25 * 1024 * 1024) throw new Error('Maximum file size is 25 MB.');
      const safeName = file.name.normalize('NFKD').replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/-+/g, '-');
      const path = `${folder}/${Date.now()}-${uid().slice(0, 8)}-${safeName}`;
      const privateAccess = visibility === 'private';
      const bucket = privateAccess ? 'portfolio-private' : 'portfolio-public';
      const { error } = await client.storage.from(bucket).upload(path, file, { upsert: false, cacheControl: '3600' });
      if (error) throw error;
      if (privateAccess) return `private:${path}`;
      const { data } = client.storage.from(bucket).getPublicUrl(path);
      return data.publicUrl;
    },

    async resolveAsset(value) {
      return resolvePrivateAsset(value);
    }
  };

  window.PortfolioAPI = API;
})();
