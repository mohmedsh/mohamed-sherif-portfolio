(() => {
  const cfg = window.PORTFOLIO_CONFIG || {};
  const configured = cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY && !cfg.SUPABASE_URL.includes('YOUR_') && !cfg.SUPABASE_ANON_KEY.includes('YOUR_');
  const client = configured && window.supabase ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY) : null;

  const now = () => new Date().toISOString();
  const uid = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);

  const defaults = {
    projects: [
      {
        id: 'seed-project-1', title: 'Fleet Request Management System', category: 'software', visibility: 'public', status: 'published', featured: true,
        summary: 'Enterprise vehicle-request workflow covering approvals, availability, conflict prevention, procurement and operational reporting.',
        content: 'A complete workflow platform designed for requesters, fleet operations and procurement. The system validates booking windows, prevents vehicle and driver conflicts, handles internal assignment or rental, and provides dashboards, reports and email notifications.\n\nKey impact:\n• Reduced manual coordination and repeated calls.\n• Added traceable approval and assignment history.\n• Improved vehicle and driver availability visibility.\n• Centralized request, extension and completion workflows.',
        tags: ['Python', 'Flask', 'SQLite', 'Workflow', 'Fleet'], cover_url: '', document_url: '', sort_order: 1, created_at: '2026-07-18T10:00:00Z', updated_at: '2026-07-24T10:00:00Z'
      },
      {
        id: 'seed-project-2', title: 'Zabbix Availability & Performance Engine', category: 'network', visibility: 'public', status: 'published', featured: true,
        summary: 'Automated weekly and monthly availability reporting with issue merging, filtering, rankings and management-ready output.',
        content: 'A Python/Flask reporting engine connected to Zabbix data. It classifies downtime and performance events, merges short incident windows, calculates availability and produces practical management summaries.\n\nCapabilities include date filters, host categories, Top 10 reports, automated email scheduling and branded output.',
        tags: ['Zabbix', 'Python', 'Flask', 'Monitoring', 'Reporting'], cover_url: '', document_url: '', sort_order: 2, created_at: '2026-06-12T10:00:00Z', updated_at: '2026-07-20T10:00:00Z'
      },
      {
        id: 'seed-project-3', title: 'Enterprise Network & Security Operations', category: 'security', visibility: 'public', status: 'published', featured: true,
        summary: 'Operational support for a multi-site Cisco and Fortinet environment serving production facilities and enterprise users.',
        content: 'Hands-on operations across Cisco C9500 core, C9300 distribution, C9200L access, FortiGate 201G HA, Cisco WLC 9800 HA and enterprise monitoring.\n\nScope includes VLANs, LACP, spanning tree, ACLs, DHCP relay, SD-WAN, NAT, VPN, captive portal, FSSO, wireless services and documentation.',
        tags: ['Cisco', 'FortiGate', 'WLC 9800', 'SD-WAN', 'HA'], cover_url: '', document_url: '', sort_order: 3, created_at: '2025-11-20T10:00:00Z', updated_at: '2026-07-22T10:00:00Z'
      },
      {
        id: 'seed-project-4', title: 'Soft4U Market ERP', category: 'software', visibility: 'public', status: 'published', featured: false,
        summary: 'Retail ERP covering POS, inventory, purchasing, batches, returns, accounting, RBAC and audit workflows.',
        content: 'A modular retail ERP designed for practical store operations. It includes barcode-based sales, batch and expiry management, supplier purchasing, inventory movements, accounting reports, access control and audit logs.',
        tags: ['ERP', 'POS', 'Inventory', 'Accounting', 'RBAC'], cover_url: '', document_url: '', sort_order: 4, created_at: '2026-05-10T10:00:00Z', updated_at: '2026-07-19T10:00:00Z'
      },
    ],
    notes: [
      { id:'seed-note-1', title:'OSPF Operation: Start, Convergence & Change', category:'network', visibility:'public', status:'published', featured:true, summary:'A structured explanation of OSPF neighbor formation, LSDB synchronization, SPF calculation and reconvergence.', content:'Covers router IDs, hello packets, neighbor states, DR/BDR behavior, LSA flooding, SPF calculation and the sequence triggered when a link or network changes.', tags:['OSPF','LSA','SPF'], cover_url:'', document_url:'', sort_order:1, created_at:'2026-07-20T10:00:00Z',updated_at:'2026-07-24T10:00:00Z' },
      { id:'seed-note-2', title:'RCNA-WLAN Fundamentals with Cisco Comparison', category:'wireless', visibility:'public', status:'published', featured:true, summary:'Wireless fundamentals explained alongside equivalent Cisco architecture and terminology.', content:'Covers RF basics, channels, roaming, WLAN architecture, access points, controllers, security and a vendor-by-vendor terminology comparison.', tags:['WLAN','RCNA','Cisco'], cover_url:'', document_url:'', sort_order:2, created_at:'2026-07-23T10:00:00Z',updated_at:'2026-07-24T10:00:00Z' },
      { id:'seed-note-3', title:'FortiGate HA, SD-WAN & Security Operations', category:'security', visibility:'public', status:'published', featured:false, summary:'Operational notes for HA, SD-WAN rules, VPN, FSSO, NAT and security profiles.', content:'A field-oriented reference covering high availability, session synchronization, SD-WAN steering, NAT/VIP, VPN troubleshooting, FSSO, captive portal and security inspection.', tags:['FortiGate','HA','SD-WAN'], cover_url:'', document_url:'', sort_order:3, created_at:'2026-07-10T10:00:00Z',updated_at:'2026-07-22T10:00:00Z' },
      { id:'seed-note-4', title:'Route Redistribution & Filtering', category:'network', visibility:'public', status:'published', featured:false, summary:'Redistribution design, route tags, metrics and filtering strategies explained with practical logic.', content:'Explains why redistribution is required, how routing information crosses protocol boundaries, and how filtering and route tagging prevent feedback and unwanted advertisements.', tags:['Redistribution','Filtering','Routing'], cover_url:'', document_url:'', sort_order:4, created_at:'2026-07-24T04:00:00Z',updated_at:'2026-07-24T05:00:00Z' },
    ],
    settings: {
      headline: 'Network Infrastructure & Security Engineer',
      email: 'mohamed.sherif@example.com',
      linkedin_url: 'https://www.linkedin.com/',
      cv_url: '',
      location: '6th of October City, Giza, Egypt'
    },
    cv: {
      updated_at: now(),
      profile: {
        full_name: 'Mohamed Sherif Abdelaziz Sand',
        title: 'Network Infrastructure & Security Engineer',
        email: 'mohamed.sherif@example.com',
        phone: '',
        location: '6th of October City, Giza, Egypt',
        linkedin: 'https://www.linkedin.com/',
        github: 'https://github.com/',
        website: '',
        summary: 'Network Infrastructure & Security Engineer with hands-on experience supporting multi-site enterprise environments. Experienced with Cisco switching and wireless, FortiGate security, Windows Server, VMware, Zabbix monitoring and Python/Flask automation.'
      },
      section_visibility: {
        experience: true,
        skills: true,
        projects: true,
        education: true,
        certifications: true,
        languages: true,
        custom: true
      },
      experience: [
        {
          id: uid(),
          role: 'IT Engineer — Network Responsibilities',
          company: 'Canal Sugar',
          location: 'Cairo, Egypt',
          period: 'Nov 2025 – Present',
          bullets: [
            'Support enterprise infrastructure across three production sites serving approximately 750 users.',
            'Operate Cisco C9500/C9300/C9200L switching, FortiGate 201G HA, Cisco WLC 9800 HA, wireless and monitoring platforms.',
            'Manage VLANs, LACP, spanning tree, ACLs, DHCP relay, SD-WAN, NAT, VPN, FSSO and captive portal services.',
            'Develop Python/Flask tools for availability reporting, incidents, change control and operational dashboards.'
          ]
        },
        {
          id: uid(),
          role: 'IT Helpdesk Specialist / IT Senior Executive',
          company: 'ISON Xperiences',
          location: 'Egypt',
          period: 'Jul 2024 – Nov 2025',
          bullets: [
            'Supported more than 1,200 users across Active Directory, VPN, LAN/Wi-Fi, Outlook, printers and endpoints.',
            'Handled 20+ incidents daily while maintaining approximately 95% SLA performance.'
          ]
        },
        {
          id: uid(),
          role: 'Technical Support Specialist',
          company: 'Brains Company',
          location: 'Egypt',
          period: 'Jun 2022 – Apr 2023',
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

  function clone(value) { return JSON.parse(JSON.stringify(value)); }

  const backendError = () => new Error(
    'Secure admin backend is not configured. Add the Supabase URL, anon key and owner email to config.js, then run supabase-schema.sql.'
  );

  async function isOwner() {
    if (!client) return false;
    const { data: { session } } = await client.auth.getSession();
    if (!session) return false;
    const { data, error } = await client.from('profiles').select('role').eq('id', session.user.id).single();
    return !error && data?.role === 'owner';
  }

  const service = {
    isConfigured: Boolean(client),
    isReadOnlyFallback: !client,
    client,
    defaults,
    uid,

    async login(username, password) {
      if (!client) throw backendError();

      const expectedUsername = String(cfg.AUTH_USERNAME || 'mohamed.sherif').trim();
      if (username !== expectedUsername) throw new Error('Incorrect username or password.');

      const authEmail = String(cfg.AUTH_EMAIL || '').trim();
      if (!authEmail || authEmail === 'YOUR_SUPABASE_OWNER_EMAIL') {
        throw new Error('Owner email is not configured in config.js.');
      }

      const { data, error } = await client.auth.signInWithPassword({ email: authEmail, password });
      if (error) throw new Error('Incorrect username or password.');

      if (!(await isOwner())) {
        await client.auth.signOut();
        throw new Error('This account does not have owner access.');
      }

      if (data?.user) {
        data.user.user_metadata = { ...(data.user.user_metadata || {}), username: expectedUsername };
      }
      return data;
    },

    async logout() {
      if (client) await client.auth.signOut();
    },

    async getSession() {
      if (!client) return null;
      const { data: { session } } = await client.auth.getSession();
      return session;
    },

    async ensureAdmin() {
      return isOwner();
    },

    async getPublic(type) {
      if (!client) {
        return clone(defaults[type] || [])
          .filter(item => item.visibility === 'public' && item.status === 'published')
          .sort((a,b) => (a.sort_order || 99) - (b.sort_order || 99));
      }
      const { data, error } = await client
        .from(type)
        .select('*')
        .eq('visibility','public')
        .eq('status','published')
        .order('sort_order',{ascending:true})
        .order('updated_at',{ascending:false});
      if (error) throw error;
      return data || [];
    },

    async listAll(type) {
      if (!client) throw backendError();
      if (!(await isOwner())) throw new Error('Owner access required.');
      const { data, error } = await client.from(type).select('*').order('updated_at',{ascending:false});
      if (error) throw error;
      return data || [];
    },

    async save(type, item) {
      if (!client) throw backendError();
      if (!(await isOwner())) throw new Error('Owner access required.');
      const normalized = {
        ...item,
        featured: item.featured === true || item.featured === 'true',
        tags: Array.isArray(item.tags) ? item.tags : String(item.tags || '').split(',').map(x => x.trim()).filter(Boolean),
        updated_at: now()
      };
      const payload = { ...normalized };
      if (!payload.id) delete payload.id;
      const { data, error } = await client.from(type).upsert(payload).select().single();
      if (error) throw error;
      return data;
    },

    async remove(type, id) {
      if (!client) throw backendError();
      if (!(await isOwner())) throw new Error('Owner access required.');
      const { error } = await client.from(type).delete().eq('id', id);
      if (error) throw error;
    },

    async getSettings() {
      if (!client) return clone(defaults.settings);
      const { data, error } = await client.from('site_settings').select('*').eq('id',1).maybeSingle();
      if (error) throw error;
      return data || clone(defaults.settings);
    },

    async saveSettings(settings) {
      if (!client) throw backendError();
      if (!(await isOwner())) throw new Error('Owner access required.');
      const { data, error } = await client
        .from('site_settings')
        .upsert({ id:1, ...settings, updated_at:now() })
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async getCV() {
      if (!client) return clone(defaults.cv);
      const { data, error } = await client.from('cv_documents').select('data,updated_at').eq('id',1).maybeSingle();
      if (error) throw error;
      if (!data?.data) return clone(defaults.cv);
      return { ...data.data, updated_at: data.updated_at || data.data.updated_at };
    },

    async saveCV(cv) {
      if (!client) throw backendError();
      if (!(await isOwner())) throw new Error('Owner access required.');
      const payload = { ...cv, updated_at: now() };
      const { data, error } = await client
        .from('cv_documents')
        .upsert({ id:1, data:payload, updated_at:payload.updated_at })
        .select('data,updated_at')
        .single();
      if (error) throw error;
      return { ...data.data, updated_at: data.updated_at };
    }
  };

  window.PortfolioData = service;
})();
