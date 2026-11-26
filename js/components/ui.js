window.SasyTix = window.SasyTix || {};

(function () {
  function getRootPrefix() {
    return window.location.pathname.includes('/pages/') ? '../../' : '';
  }

  function formatIDR(amount) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  }

  function formatDate(isoDate) {
    if (!isoDate) return '-';
    const d = new Date(isoDate + 'T00:00:00');
    if (isNaN(d.getTime())) return isoDate;
    return d.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  function statusBadge(status) {
    const map = {
      'Confirmed': 'badge--success',
      'Verified': 'badge--success',
      'Completed': 'badge--info',
      'Active': 'badge--success',
      'active': 'badge--success',
      'Pending': 'badge--warning',
      'Pending Payment': 'badge--warning',
      'Payment Submitted': 'badge--info',
      'Rejected': 'badge--error',
      'Cancelled': 'badge--error',
      'Expired': 'badge--neutral',
      'Inactive': 'badge--neutral',
      'inactive': 'badge--neutral'
    };
    const cls = map[status] || 'badge--neutral';
    return `<span class="badge ${cls}">${status}</span>`;
  }

  function showToast(message, type) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const t = document.createElement('div');
    t.className = `toast toast--${type || 'info'}`;
    t.innerHTML = `<span>${message}</span>`;
    container.appendChild(t);
    setTimeout(() => {
      t.remove();
    }, 3600);
  }

  function renderDemoBar() {
    const existing = document.getElementById('demo-bar-mount');
    if (!existing) return;
    const state = window.SasyTix.Storage.loadState();
    const user = window.SasyTix.Storage.getCurrentUser(state);
    const root = getRootPrefix();
    const role = user ? user.role : 'guest';

    existing.innerHTML = `
      <div class="demo-bar">
        <div class="container demo-bar-inner">
          <div class="demo-role-pills">
            <span>Demo Mode:</span>
            <button type="button" class="demo-pill ${role === 'buyer' ? 'is-active' : ''}" data-demo-role="buyer">Buyer (${role === 'buyer' ? 'Aktif' : 'buyer@demo.com'})</button>
            <button type="button" class="demo-pill ${role === 'admin' ? 'is-active' : ''}" data-demo-role="admin">Admin (admin@demo.com)</button>
            <button type="button" class="demo-pill ${role === 'owner' ? 'is-active' : ''}" data-demo-role="owner">Owner (owner@demo.com)</button>
          </div>
          <div class="demo-role-pills">
            <button type="button" class="demo-pill" id="btn-reset-demo">Reset Demo Data</button>
          </div>
        </div>
      </div>
    `;

    existing.querySelectorAll('[data-demo-role]').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetRole = btn.getAttribute('data-demo-role');
        const st = window.SasyTix.Storage.loadState();
        const targetUser = st.users.find(u => u.role === targetRole);
        if (targetUser) {
          st.currentUserId = targetUser.id;
          window.SasyTix.Storage.saveState(st);
          if (targetRole === 'admin') {
            window.location.href = `${root}pages/admin/dashboard.html`;
          } else if (targetRole === 'owner') {
            window.location.href = `${root}pages/owner/dashboard.html`;
          } else {
            window.location.href = `${root}index.html`;
          }
        }
      });
    });

    const resetBtn = document.getElementById('btn-reset-demo');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        window.SasyTix.Storage.resetDemoData();
        showToast('Data demo berhasil direset ke kondisi awal.', 'success');
        setTimeout(() => window.location.reload(), 600);
      });
    }
  }

  function renderPublicHeader(activeKey) {
    const mount = document.getElementById('site-header-mount');
    if (!mount) return;
    const root = getRootPrefix();
    const { icon } = window.SasyTix.Icons;
    const state = window.SasyTix.Storage.loadState();
    const user = window.SasyTix.Storage.getCurrentUser(state);

    mount.innerHTML = `
      <header class="site-header">
        <div class="container header-inner">
          <a href="${root}index.html" class="brand-logo">
            <span class="brand-logo-mark">${icon('ship', 20)}</span>
            <span class="brand-logo-text">
              <span>Sasy.Tix</span>
              <span class="brand-logo-sub">Maritime Travel</span>
            </span>
          </a>
          <nav class="nav-links" aria-label="Navigasi utama">
            <a href="${root}index.html" class="nav-link ${activeKey === 'home' ? 'is-active' : ''}">Beranda</a>
            <a href="${root}pages/buyer/search.html" class="nav-link ${activeKey === 'search' ? 'is-active' : ''}">Cari Jadwal</a>
            <a href="${root}pages/buyer/bookings.html" class="nav-link ${activeKey === 'bookings' ? 'is-active' : ''}">My Booking</a>
            <a href="${root}pages/buyer/ticket.html" class="nav-link ${activeKey === 'ticket' ? 'is-active' : ''}">Tiket Saya</a>
            <a href="${root}pages/buyer/profile.html" class="nav-link ${activeKey === 'profile' ? 'is-active' : ''}">Profil</a>
          </nav>
          <div class="header-actions">
            ${user ? `
              <a href="${root}pages/buyer/profile.html" class="btn btn--outline btn--sm btn-desktop-only">${icon('user', 15)} ${user.name}</a>
            ` : `
              <a href="${root}pages/buyer/auth.html?mode=login" class="btn btn--outline btn--sm btn-desktop-only">Masuk</a>
              <a href="${root}pages/buyer/auth.html?mode=register" class="btn btn--primary btn--sm btn-desktop-only">Daftar</a>
            `}
            <button type="button" class="mobile-menu-btn" id="mobile-menu-toggle" aria-label="Buka menu navigasi">
              ${icon('menu', 20)}
            </button>
          </div>
        </div>
      </header>
      <div class="mobile-drawer" id="mobile-drawer">
        <a href="${root}index.html" class="nav-link">Beranda</a>
        <a href="${root}pages/buyer/search.html" class="nav-link">Cari Jadwal</a>
        <a href="${root}pages/buyer/bookings.html" class="nav-link">My Booking</a>
        <a href="${root}pages/buyer/ticket.html" class="nav-link">Tiket Saya</a>
        <a href="${root}pages/buyer/profile.html" class="nav-link">Profil</a>
        <hr style="border:none;border-top:1px solid var(--color-border);">
        <a href="${root}pages/buyer/auth.html?mode=login" class="btn btn--outline btn--block">Masuk / Ganti Akun</a>
        <a href="${root}pages/buyer/auth.html?mode=register" class="btn btn--primary btn--block">Daftar Akun Baru</a>
      </div>
    `;

    const toggle = document.getElementById('mobile-menu-toggle');
    const drawer = document.getElementById('mobile-drawer');
    if (toggle && drawer) {
      toggle.addEventListener('click', () => {
        drawer.classList.toggle('is-open');
      });
    }
  }

  function renderPublicFooter() {
    const mount = document.getElementById('site-footer-mount');
    if (!mount) return;
    const root = getRootPrefix();
    const { icon } = window.SasyTix.Icons;
    mount.innerHTML = `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div>
              <div class="brand-logo" style="color:#FFFFFF; margin-bottom:12px;">
                <span class="brand-logo-mark" style="background:var(--color-secondary);">${icon('ship', 20)}</span>
                <span>Sasy.Tix Maritime</span>
              </div>
              <p class="text-sm" style="color:rgba(255,255,255,0.75); max-width:34ch;">
                Platform pemesanan tiket feri modern untuk koridor Batam, Singapura, dan Malaysia dengan pengalaman perjalanan yang transparan dan terpercaya.
              </p>
            </div>
            <div>
              <h3 class="footer-heading">Rute Populer</h3>
              <ul class="footer-links">
                <li><a href="${root}pages/buyer/search.html?origin=Batam&destination=Singapura">Batam → Singapura</a></li>
                <li><a href="${root}pages/buyer/search.html?origin=Singapura&destination=Batam">Singapura → Batam</a></li>
                <li><a href="${root}pages/buyer/search.html?origin=Batam&destination=Malaysia">Batam → Malaysia</a></li>
                <li><a href="${root}pages/buyer/search.html?origin=Malaysia&destination=Batam">Malaysia → Batam</a></li>
              </ul>
            </div>
            <div>
              <h3 class="footer-heading">Akun & Portal</h3>
              <ul class="footer-links">
                <li><a href="${root}pages/buyer/bookings.html">My Booking</a></li>
                <li><a href="${root}pages/buyer/ticket.html">Boarding Pass Digital</a></li>
                <li><a href="${root}pages/admin/dashboard.html">Admin Operations</a></li>
                <li><a href="${root}pages/owner/dashboard.html">Owner Executive</a></li>
              </ul>
            </div>
            <div>
              <h3 class="footer-heading">Kantor Batam</h3>
              <p class="text-sm" style="color:rgba(255,255,255,0.75);">
                Jl. Jend. A. Yani, Taman Baloi, Batam Kota, Kepulauan Riau 29444
              </p>
              <p class="text-sm" style="margin-top:8px; color:rgba(255,255,255,0.85);">
                WhatsApp: +62 897-6950-796
              </p>
            </div>
          </div>
          <div class="footer-bottom">
            <span>© 2026 Sasy.Tix Maritime Prototype. Frontend Simulation Only.</span>
            <span>Batam · Singapura · Malaysia</span>
          </div>
        </div>
      </footer>
    `;
  }

  function renderDashboardShell(role, activeKey, pageTitle) {
    const sidebarMount = document.getElementById('app-sidebar-mount');
    const topbarMount = document.getElementById('app-topbar-mount');
    const root = getRootPrefix();
    const { icon } = window.SasyTix.Icons;
    const state = window.SasyTix.Storage.loadState();
    const user = window.SasyTix.Storage.getCurrentUser(state);

    const adminMenu = [
      { key: 'dashboard', label: 'Dashboard', href: `${root}pages/admin/dashboard.html`, icon: 'dashboard' },
      { key: 'bookings', label: 'Booking Management', href: `${root}pages/admin/bookings.html`, icon: 'fileText' },
      { key: 'payments', label: 'Payment Verification', href: `${root}pages/admin/payments.html`, icon: 'creditCard' },
      { key: 'schedules', label: 'Schedule', href: `${root}pages/admin/schedules.html`, icon: 'calendar' },
      { key: 'routes', label: 'Routes', href: `${root}pages/admin/routes.html`, icon: 'mapPin' },
      { key: 'passengers', label: 'Passengers', href: `${root}pages/admin/passengers.html`, icon: 'users' },
      { key: 'reports', label: 'Reports', href: `${root}pages/admin/reports.html`, icon: 'barChart' }
    ];

    const ownerMenu = [
      { key: 'dashboard', label: 'Executive Dashboard', href: `${root}pages/owner/dashboard.html`, icon: 'dashboard' },
      { key: 'analytics', label: 'Business Analytics', href: `${root}pages/owner/analytics.html`, icon: 'barChart' },
      { key: 'financial', label: 'Financial Overview', href: `${root}pages/owner/financial.html`, icon: 'creditCard' },
      { key: 'operational', label: 'Operational Overview', href: `${root}pages/owner/operational.html`, icon: 'ship' },
      { key: 'admins', label: 'Admin Management', href: `${root}pages/owner/admins.html`, icon: 'shield' }
    ];

    const menu = role === 'owner' ? ownerMenu : adminMenu;
    const portalLabel = role === 'owner' ? 'Owner Executive' : 'Admin Operations';

    if (sidebarMount) {
      sidebarMount.innerHTML = `
        <div class="sidebar-backdrop" id="sidebar-backdrop"></div>
        <aside class="app-sidebar" id="app-sidebar">
          <div class="sidebar-brand">
            <a href="${root}index.html" class="brand-logo" style="color:#FFFFFF;">
              <span class="brand-logo-mark" style="background:var(--color-secondary);">${icon('ship', 18)}</span>
              <span class="brand-logo-text">
                <span>Sasy.Tix</span>
                <span class="brand-logo-sub" style="color:rgba(255,255,255,0.68);">${portalLabel}</span>
              </span>
            </a>
          </div>
          <nav class="sidebar-nav" aria-label="${portalLabel} navigation">
            <div class="sidebar-section-label">${portalLabel}</div>
            ${menu.map(item => `
              <a href="${item.href}" class="sidebar-link ${activeKey === item.key ? 'is-active' : ''}">
                ${icon(item.icon, 18)}
                <span>${item.label}</span>
              </a>
            `).join('')}
          </nav>
          <div class="sidebar-footer">
            <a href="${root}index.html" class="sidebar-link">
              ${icon('logOut', 18)}
              <span>Kembali ke Beranda</span>
            </a>
          </div>
        </aside>
      `;
    }

    if (topbarMount) {
      topbarMount.innerHTML = `
        <header class="app-topbar">
          <div class="topbar-left">
            <button type="button" class="sidebar-toggle-btn" id="sidebar-toggle-btn" aria-label="Buka sidebar">
              ${icon('menu', 20)}
            </button>
            <div class="breadcrumb">
              <span>${portalLabel}</span>
              <span>/</span>
              <strong>${pageTitle}</strong>
            </div>
          </div>
          <div class="header-actions">
            <span class="badge badge--primary">${user ? user.name : portalLabel}</span>
            <a href="${root}pages/buyer/auth.html?mode=login" class="btn btn--outline btn--sm">Ganti Akun</a>
          </div>
        </header>
      `;
    }

    const toggleBtn = document.getElementById('sidebar-toggle-btn');
    const sidebar = document.getElementById('app-sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (toggleBtn && sidebar && backdrop) {
      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('is-open');
        backdrop.classList.toggle('is-open');
      });
      backdrop.addEventListener('click', () => {
        sidebar.classList.remove('is-open');
        backdrop.classList.remove('is-open');
      });
    }
  }

  function generateDummyQR(code) {
    const seed = (code || 'STX').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    let cells = '';
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const isCorner = (r < 3 && c < 3) || (r < 3 && c > 5) || (r > 5 && c < 3);
        const fill = isCorner || ((r * 7 + c * 11 + seed) % 3 === 0);
        if (fill) {
          cells += `<rect x="${c * 12 + 6}" y="${r * 12 + 6}" width="10" height="10" rx="1.5" fill="#123B5D"/>`;
        }
      }
    }
    return `<svg width="120" height="120" viewBox="0 0 120 120" role="img" aria-label="QR Code ${code}"><rect width="120" height="120" rx="8" fill="#FFFFFF" stroke="#E2E8F0"/>${cells}</svg>`;
  }

  window.SasyTix.UI = {
    getRootPrefix,
    formatIDR,
    formatDate,
    statusBadge,
    showToast,
    renderDemoBar,
    renderPublicHeader,
    renderPublicFooter,
    renderDashboardShell,
    generateDummyQR
  };
})();
