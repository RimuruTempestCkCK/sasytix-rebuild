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

  function initPasswordToggles(container = document) {
    const { icon } = window.SasyTix.Icons;
    container.querySelectorAll('.btn-toggle-password').forEach(btn => {
      if (btn._hasPasswordToggle) return;
      btn._hasPasswordToggle = true;

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = btn.getAttribute('data-target');
        const input = targetId ? document.getElementById(targetId) : btn.closest('.password-input-wrap')?.querySelector('input');
        if (!input) return;

        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        btn.setAttribute('aria-label', isPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi');
        btn.title = isPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi';
        btn.innerHTML = icon(isPassword ? 'eyeOff' : 'eye', 18);
      });
    });
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
    const { icon } = window.SasyTix.Icons;
    const toastType = type || 'info';
    const iconName = toastType === 'success' ? 'checkCircle' : (toastType === 'error' || toastType === 'danger' || toastType === 'warning') ? 'alertCircle' : 'clock';
    const t = document.createElement('div');
    t.className = `toast toast--${toastType}`;
    t.setAttribute('role', 'status');
    t.innerHTML = `
      <span class="toast-icon">${icon(iconName, 17)}</span>
      <div class="toast-body">${message}</div>
      <button type="button" class="toast-close" aria-label="Tutup notifikasi">${icon('x', 14)}</button>
    `;
    t.querySelector('.toast-close').addEventListener('click', () => t.remove());
    container.appendChild(t);
    setTimeout(() => {
      if (t.parentNode) t.remove();
    }, 4000);
  }

  function confirmDialog({ title, message, confirmLabel = 'Ya, Lanjutkan', cancelLabel = 'Batal', type = 'primary', showInput = false, inputLabel = '', inputPlaceholder = '', inputDefault = '', onConfirm }) {
    let backdrop = document.getElementById('ui-confirm-modal-backdrop');
    if (backdrop) backdrop.remove();

    const { icon } = window.SasyTix.Icons;
    backdrop = document.createElement('div');
    backdrop.id = 'ui-confirm-modal-backdrop';
    backdrop.className = 'modal-backdrop is-open';
    const btnClass = type === 'danger' ? 'btn--primary' : 'btn--primary';
    const btnStyle = type === 'danger' ? 'background:var(--danger); border-color:var(--danger);' : '';

    backdrop.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true" style="max-width:440px;">
        <div class="modal-header">
          <h3 class="modal-title">${title}</h3>
          <button type="button" class="icon-btn" id="ui-confirm-close" aria-label="Tutup">${icon('x', 16)}</button>
        </div>
        <div class="modal-body">
          <p style="margin:0 0 ${showInput ? '14px' : '0'}; color:var(--t-muted); line-height:1.55;">${message}</p>
          ${showInput ? `
            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label" for="ui-confirm-input">${inputLabel}</label>
              <input type="text" class="input" id="ui-confirm-input" value="${inputDefault}" placeholder="${inputPlaceholder}">
            </div>
          ` : ''}
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn--outline btn--sm" id="ui-confirm-cancel">${cancelLabel}</button>
          <button type="button" class="btn ${btnClass} btn--sm" id="ui-confirm-ok" style="${btnStyle}">${confirmLabel}</button>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);

    const close = () => backdrop.remove();
    document.getElementById('ui-confirm-close').addEventListener('click', close);
    document.getElementById('ui-confirm-cancel').addEventListener('click', close);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) close();
    });

    const okBtn = document.getElementById('ui-confirm-ok');
    okBtn.addEventListener('click', () => {
      const val = showInput ? document.getElementById('ui-confirm-input').value.trim() : true;
      close();
      if (onConfirm) onConfirm(val);
    });

    if (showInput) {
      setTimeout(() => document.getElementById('ui-confirm-input')?.focus(), 40);
    }
  }

  function openFormModal({ title, bodyHtml, submitLabel = 'Simpan', onSubmit }) {
    let backdrop = document.getElementById('ui-form-modal-backdrop');
    if (backdrop) backdrop.remove();

    const { icon } = window.SasyTix.Icons;
    backdrop = document.createElement('div');
    backdrop.id = 'ui-form-modal-backdrop';
    backdrop.className = 'modal-backdrop is-open';
    backdrop.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true" style="max-width:560px;">
        <div class="modal-header">
          <h3 class="modal-title">${title}</h3>
          <button type="button" class="icon-btn" id="ui-form-close" aria-label="Tutup">${icon('x', 16)}</button>
        </div>
        <form id="ui-popup-form">
          <div class="modal-body">
            ${bodyHtml}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn--outline btn--sm" id="ui-form-cancel">Batal</button>
            <button type="submit" class="btn btn--primary btn--sm">${submitLabel}</button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(backdrop);

    const close = () => backdrop.remove();
    document.getElementById('ui-form-close').addEventListener('click', close);
    document.getElementById('ui-form-cancel').addEventListener('click', close);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) close();
    });

    document.getElementById('ui-popup-form').addEventListener('submit', (e) => {
      e.preventDefault();
      if (onSubmit) {
        const shouldClose = onSubmit(e.target, close);
        if (shouldClose !== false) close();
      } else {
        close();
      }
    });
  }

  function renderPagination(totalItems, currentPage, pageSize) {
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const safePage = Math.min(Math.max(1, currentPage), totalPages);
    const startIdx = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
    const endIdx = Math.min(totalItems, safePage * pageSize);

    let pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safePage > 3) pages.push('...');
      for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) {
        pages.push(i);
      }
      if (safePage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }

    return `
      <div class="pagination-bar" data-total-pages="${totalPages}">
        <div class="pagination-info">
          Menampilkan <strong>${startIdx}–${endIdx}</strong> dari <strong>${totalItems}</strong> data · Hal. <strong>${safePage}</strong> / ${totalPages}
        </div>
        <div class="pagination-controls">
          <button type="button" class="page-btn" data-page="${safePage - 1}" ${safePage <= 1 ? 'disabled' : ''} aria-label="Halaman sebelumnya">‹</button>
          ${pages.map(p => p === '...'
            ? '<span class="page-ellipsis">…</span>'
            : `<button type="button" class="page-btn ${p === safePage ? 'is-active' : ''}" data-page="${p}">${p}</button>`
          ).join('')}
          <button type="button" class="page-btn" data-page="${safePage + 1}" ${safePage >= totalPages ? 'disabled' : ''} aria-label="Halaman berikutnya">›</button>
          <div class="page-jump">
            <span>Loncat:</span>
            <input type="number" class="page-jump-input" min="1" max="${totalPages}" value="${safePage}" aria-label="Loncat ke halaman">
            <button type="button" class="page-jump-btn">Go</button>
          </div>
        </div>
      </div>
    `;
  }

  function bindPagination(containerEl, totalItems, pageSize, onPageChange) {
    if (!containerEl) return;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    containerEl.querySelectorAll('.page-btn[data-page]').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = parseInt(btn.getAttribute('data-page'), 10);
        if (!isNaN(target) && target >= 1 && target <= totalPages) {
          onPageChange(target);
        }
      });
    });
    const jumpInput = containerEl.querySelector('.page-jump-input');
    const jumpBtn = containerEl.querySelector('.page-jump-btn');
    function doJump() {
      if (!jumpInput) return;
      const val = parseInt(jumpInput.value, 10);
      if (isNaN(val) || val < 1 || val > totalPages) {
        showToast(`Masukkan nomor halaman antara 1 sampai ${totalPages}.`, 'warning');
        return;
      }
      onPageChange(val);
    }
    if (jumpBtn) jumpBtn.addEventListener('click', doJump);
    if (jumpInput) {
      jumpInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          doJump();
        }
      });
    }
  }

  function initScrollReveal() {
    const els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('is-revealed'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    els.forEach(el => io.observe(el));
  }

  function renderDemoBar() {
    // Demo switcher permanently removed
  }

  function renderPublicHeader(activeKey) {
    document.body.classList.add('public-body');
    const mount = document.getElementById('site-header-mount');
    if (!mount) return;
    const root = getRootPrefix();
    const { icon } = window.SasyTix.Icons;
    const state = window.SasyTix.Storage.loadState();
    const user = window.SasyTix.Storage.getCurrentUser(state);

    mount.innerHTML = `
      <header class="site-header" id="site-header">
        <div class="container header-inner">
          <a href="${root}index.html" class="brand-logo" aria-label="Sasy.Tix Beranda">
            <img src="${root}assets/logos/logo.png" alt="Sasytix.com" class="brand-logo-img">
          </a>
          <nav class="nav-links" aria-label="Navigasi utama">
            <a href="${root}index.html" class="nav-link ${activeKey === 'home' ? 'is-active' : ''}">Beranda</a>
            <a href="${root}pages/buyer/search.html" class="nav-link ${activeKey === 'search' ? 'is-active' : ''}">Cari Jadwal</a>
            <a href="${root}pages/buyer/bookings.html" class="nav-link ${activeKey === 'bookings' ? 'is-active' : ''}">Pesanan Saya</a>
            <a href="${root}pages/buyer/ticket.html" class="nav-link ${activeKey === 'ticket' ? 'is-active' : ''}">Tiket Saya</a>
            <a href="${root}index.html#faq" class="nav-link">Pusat Bantuan</a>
          </nav>
          <div class="header-actions">
            <div class="user-dropdown-wrap" id="user-dropdown-wrap">
              <button type="button" class="btn btn--outline btn--sm btn-desktop-only user-dropdown-toggle" id="user-menu-toggle" aria-expanded="false" aria-haspopup="true">
                ${icon('user', 15)}
                <span class="user-dropdown-name">${user ? user.name : 'Hendra Wijaya'}</span>
                ${icon('chevronDown', 13)}
              </button>
              <div class="user-dropdown-menu" id="user-dropdown-menu" role="menu" aria-label="Menu pengguna">
                <div class="user-dropdown-header">
                  <div class="user-dropdown-title">${user ? user.name : 'Hendra Wijaya'}</div>
                  <div class="user-dropdown-email">${user ? user.email : 'hendra.wijaya@gmail.com'}</div>
                </div>
                <div class="user-dropdown-divider"></div>
                <a href="${root}pages/buyer/profile.html" class="user-dropdown-item" role="menuitem">
                  ${icon('user', 15)}
                  <span>Profil Akun</span>
                </a>
                <div class="user-dropdown-divider"></div>
                <button type="button" class="user-dropdown-item user-dropdown-logout" id="btn-header-logout" role="menuitem">
                  ${icon('logOut', 15)}
                  <span>Keluar (Logout)</span>
                </button>
              </div>
            </div>
            <button type="button" class="mobile-menu-btn" id="mobile-menu-toggle" aria-label="Buka menu navigasi" aria-expanded="false">
              ${icon('menu', 20)}
            </button>
          </div>
        </div>
      </header>
      <div class="mobile-drawer" id="mobile-drawer">
        <a href="${root}index.html" class="nav-link">Beranda</a>
        <a href="${root}pages/buyer/search.html" class="nav-link">Cari Jadwal</a>
        <a href="${root}pages/buyer/bookings.html" class="nav-link">Pesanan Saya</a>
        <a href="${root}pages/buyer/ticket.html" class="nav-link">Tiket Saya</a>
        <a href="${root}index.html#faq" class="nav-link">Pusat Bantuan</a>
        <hr style="border:none;border-top:1px solid var(--color-border);">
        <a href="${root}pages/buyer/profile.html" class="btn btn--outline btn--block" style="margin-bottom:8px;">
          ${icon('user', 15)} ${user ? user.name : 'Hendra Wijaya'} (Profil Akun)
        </a>
        <button type="button" class="btn btn--outline btn--block user-dropdown-logout" id="mobile-logout-btn" style="color:var(--color-error); border-color:#fca5a5;">
          ${icon('logOut', 15)} Keluar (Logout)
        </button>
      </div>
    `;

    const headerEl = document.getElementById('site-header');
    window.addEventListener('scroll', () => {
      if (headerEl) headerEl.classList.toggle('is-scrolled', window.scrollY > 12);
    }, { passive: true });

    const toggle = document.getElementById('mobile-menu-toggle');
    const drawer = document.getElementById('mobile-drawer');
    const userToggle = document.getElementById('user-menu-toggle');
    const userWrap = document.getElementById('user-dropdown-wrap');
    const btnLogout = document.getElementById('btn-header-logout');
    const mobileLogout = document.getElementById('mobile-logout-btn');

    if (userToggle && userWrap) {
      userToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = userWrap.classList.toggle('is-open');
        userToggle.setAttribute('aria-expanded', String(isOpen));
      });

      document.addEventListener('click', (e) => {
        if (!userWrap.contains(e.target)) {
          userWrap.classList.remove('is-open');
          userToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    function doLogout() {
      if (window.SasyTix.Auth) {
        window.SasyTix.Auth.logout();
      }
      showToast('Anda telah keluar dari akun.', 'info');
      setTimeout(() => {
        window.location.href = root + 'pages/buyer/login.html';
      }, 500);
    }

    if (btnLogout) btnLogout.addEventListener('click', doLogout);
    if (mobileLogout) mobileLogout.addEventListener('click', doLogout);

    if (toggle && drawer) {
      toggle.addEventListener('click', () => {
        const isOpen = drawer.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(isOpen));
        toggle.innerHTML = icon(isOpen ? 'x' : 'menu', 20);
      });
    }

    initScrollReveal();
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
              <a href="${root}index.html" class="brand-logo" style="margin-bottom:14px; display:inline-block;" aria-label="Sasy.Tix Beranda">
                <img src="${root}assets/logos/logo.png" alt="Sasytix.com" class="brand-logo-img brand-logo-img--footer">
              </a>
              <p class="text-sm" style="color:rgba(255,255,255,0.78); max-width:34ch;">
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
              <h3 class="footer-heading">Akun &amp; Portal</h3>
              <ul class="footer-links">
                <li><a href="${root}pages/buyer/bookings.html">Pesanan Saya</a></li>
                <li><a href="${root}pages/buyer/ticket.html">Boarding Pass Digital</a></li>
                <li><a href="${root}pages/admin/dashboard.html">Admin Operations</a></li>
                <li><a href="${root}pages/owner/dashboard.html">Owner Executive</a></li>
              </ul>
            </div>
            <div>
              <h3 class="footer-heading">Kantor Batam</h3>
              <p class="text-sm" style="color:rgba(255,255,255,0.78);">
                Jl. Jend. A. Yani, Taman Baloi, Batam Kota, Kepulauan Riau 29444
              </p>
              <p class="text-sm" style="margin-top:8px; color:rgba(255,255,255,0.9);">
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
    const savedTheme = localStorage.getItem('sasytix_admin_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const sidebarMount = document.getElementById('app-sidebar-mount');
    const topbarMount = document.getElementById('app-topbar-mount');
    const mainEl = document.querySelector('.app-main');
    const shellEl = document.querySelector('.app-shell');
    const root = getRootPrefix();
    const { icon } = window.SasyTix.Icons;
    const state = window.SasyTix.Storage.loadState();
    const user = window.SasyTix.Storage.getCurrentUser(state);

    const displayName = user ? user.name : (role === 'owner' ? 'Hendra Wijaya' : 'Fajar Pratama');
    const roleLabel = role === 'owner' ? 'Managing Director' : 'Operations Admin';
    const initials = displayName
      .split(/\s+/)
      .map(p => p.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase();

    const isCollapsed = localStorage.getItem('sasytix_sidebar_collapsed') === 'true';
    if (shellEl && isCollapsed && window.innerWidth >= 992) {
      shellEl.classList.add('sidebar-collapsed');
    }

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
    const portalLabel = role === 'owner' ? 'Owner Portal' : 'Admin Portal';

    if (sidebarMount) {
      sidebarMount.innerHTML = `
        <div class="sidebar-backdrop" id="sidebar-backdrop"></div>
        <aside class="app-sidebar" id="app-sidebar">
          <div class="sidebar-brand">
            <a href="${root}pages/${role}/dashboard.html" class="brand-link" aria-label="Sasy.Tix ${portalLabel}">
              <img src="${root}assets/logos/logo.png" alt="Sasytix.com" class="sidebar-brand-img">
              <img src="${root}assets/logos/favicon.png" alt="Sasy.Tix" class="sidebar-brand-favicon">
            </a>
          </div>
          <nav class="sidebar-nav" aria-label="${portalLabel} navigation">
            <div class="sidebar-section-label">Workspace</div>
            ${menu.map(item => `
              <a href="${item.href}" class="sidebar-link ${activeKey === item.key ? 'is-active' : ''}" data-tooltip="${item.label}">
                ${icon(item.icon, 17)}
                <span>${item.label}</span>
              </a>
            `).join('')}
          </nav>
          <div class="sidebar-footer">
            <div class="workspace-card">
              <div class="workspace-avatar">${initials}</div>
              <div class="workspace-text">
                <div class="workspace-name">${displayName}</div>
                <div class="workspace-role">${roleLabel}</div>
              </div>
            </div>
            <a href="${root}index.html" class="sidebar-link" data-tooltip="Portal Pembeli">
              ${icon('logOut', 17)}
              <span>Ke Portal Pembeli</span>
            </a>
          </div>
        </aside>
      `;
    }

    if (topbarMount) {
      topbarMount.innerHTML = `
        <header class="app-topbar">
          <div class="topbar-left">
            <button type="button" class="sidebar-toggle-btn" id="sidebar-toggle-btn" title="Toggle Sidebar" aria-label="Toggle sidebar">
              ${icon('menu', 19)}
            </button>
            <div class="crumbs">
              <span>${role === 'owner' ? 'Owner' : 'Admin'}</span>
              <span class="sep">${icon('chevronRight', 12)}</span>
              <span class="current">${pageTitle}</span>
            </div>
          </div>
          <div class="topbar-actions">
            <button type="button" class="cmd-btn" id="cmd-palette-trigger" aria-label="Quick Search">
              ${icon('search', 14)}
              <span>Search...</span>
              <kbd class="kbd">⌘K</kbd>
            </button>
            <button type="button" class="icon-btn" id="themeToggle" aria-label="Toggle theme" title="Ganti Tema (Light / Dark)">
              ${icon(savedTheme === 'dark' ? 'sun' : 'moon', 17)}
            </button>
            <div class="user-dropdown-wrap" id="admin-user-dropdown-wrap">
              <button type="button" class="avatar-btn" id="admin-user-toggle" aria-expanded="false" aria-label="Menu Akun">
                ${initials}
              </button>
              <div class="user-dropdown-menu" id="admin-user-dropdown-menu" role="menu">
                <div class="user-dropdown-header">
                  <div class="user-dropdown-title">${displayName}</div>
                  <div class="user-dropdown-email">${roleLabel}</div>
                </div>
                <div class="user-dropdown-divider"></div>
                <a href="${root}index.html" class="user-dropdown-item" role="menuitem">
                  ${icon('anchor', 15)}
                  <span>Ke Portal Pembeli</span>
                </a>
                <div class="user-dropdown-divider"></div>
                <button type="button" class="user-dropdown-item user-dropdown-logout" id="btn-admin-logout" role="menuitem">
                  ${icon('logOut', 15)}
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>
      `;
    }

    if (mainEl && !mainEl.querySelector('.app-footer')) {
      const footer = document.createElement('footer');
      footer.className = 'app-footer';
      footer.innerHTML = `
        <div>© ${new Date().getFullYear()} <strong>Sasy.Tix</strong> · ${portalLabel}</div>
        <div class="app-footer-meta">BATAM · SINGAPURA · MALAYSIA</div>
      `;
      mainEl.appendChild(footer);
    }

    // Command Palette Modal
    if (!document.getElementById('cmd-palette-backdrop')) {
      const pal = document.createElement('div');
      pal.id = 'cmd-palette-backdrop';
      pal.className = 'cmd-palette-backdrop';
      pal.innerHTML = `
        <div class="cmd-palette-box" role="dialog" aria-label="Quick Navigation">
          <div class="cmd-palette-input-wrap">
            ${icon('search', 16)}
            <input type="text" class="cmd-palette-input" id="cmd-palette-input" placeholder="Cari halaman atau menu..." autocomplete="off">
            <kbd class="kbd">ESC</kbd>
          </div>
          <div class="cmd-palette-list" id="cmd-palette-list"></div>
        </div>
      `;
      document.body.appendChild(pal);

      const palInput = document.getElementById('cmd-palette-input');
      const palList = document.getElementById('cmd-palette-list');

      function renderPalItems(q) {
        const term = (q || '').toLowerCase();
        const filtered = menu.filter(m => m.label.toLowerCase().includes(term));
        palList.innerHTML = filtered.length
          ? filtered.map(m => `
              <a href="${m.href}" class="cmd-palette-item">
                <span class="cmd-palette-item-left">${icon(m.icon, 15)} <span>${m.label}</span></span>
                <span class="kbd">${portalLabel}</span>
              </a>
            `).join('')
          : `<div style="padding:16px; text-align:center; color:var(--t-muted); font-size:13px;">Tidak ada menu cocok.</div>`;
      }

      function openPalette() {
        pal.classList.add('is-open');
        palInput.value = '';
        renderPalItems('');
        setTimeout(() => palInput.focus(), 40);
      }

      function closePalette() {
        pal.classList.remove('is-open');
      }

      pal.addEventListener('click', (e) => {
        if (e.target === pal) closePalette();
      });

      palInput.addEventListener('input', (e) => renderPalItems(e.target.value));

      const cmdBtn = document.getElementById('cmd-palette-trigger');
      if (cmdBtn) cmdBtn.addEventListener('click', openPalette);

      document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          if (pal.classList.contains('is-open')) closePalette();
          else openPalette();
        } else if (e.key === 'Escape' && pal.classList.contains('is-open')) {
          closePalette();
        }
      });
    }

    // Theme Toggle
    const themeToggleBtn = document.getElementById('themeToggle');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('sasytix_admin_theme', next);
        themeToggleBtn.innerHTML = icon(next === 'dark' ? 'sun' : 'moon', 17);
      });
    }

    // Sidebar collapse & drawer events
    const toggleBtn = document.getElementById('sidebar-toggle-btn');
    const sidebar = document.getElementById('app-sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    const appShell = document.querySelector('.app-shell');

    function toggleSidebarCollapse() {
      if (!appShell) return;
      const willBeCollapsed = !appShell.classList.contains('sidebar-collapsed');
      appShell.classList.toggle('sidebar-collapsed', willBeCollapsed);
      localStorage.setItem('sasytix_sidebar_collapsed', willBeCollapsed ? 'true' : 'false');
    }

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        if (window.innerWidth >= 992) {
          toggleSidebarCollapse();
        } else if (sidebar && backdrop) {
          sidebar.classList.toggle('is-open');
          backdrop.classList.toggle('is-open');
        }
      });
    }

    const adminToggle = document.getElementById('admin-user-toggle');
    const adminWrap = document.getElementById('admin-user-dropdown-wrap');
    const adminLogout = document.getElementById('btn-admin-logout');

    if (adminToggle && adminWrap) {
      adminToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = adminWrap.classList.toggle('is-open');
        adminToggle.setAttribute('aria-expanded', String(isOpen));
      });
      document.addEventListener('click', (e) => {
        if (!adminWrap.contains(e.target)) {
          adminWrap.classList.remove('is-open');
          adminToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    if (adminLogout) {
      adminLogout.addEventListener('click', () => {
        if (window.SasyTix.Auth) {
          window.SasyTix.Auth.logout();
        }
        showToast('Anda telah keluar dari portal.', 'info');
        setTimeout(() => {
          window.location.href = root + 'pages/buyer/login.html';
        }, 500);
      });
    }

    if (backdrop && sidebar) {
      backdrop.addEventListener('click', () => {
        sidebar.classList.remove('is-open');
        backdrop.classList.remove('is-open');
      });
    }
  }

  /* ==========================================================================
     INTERACTIVE SVG LINE CHART GENERATOR
     ========================================================================== */
  function renderLineChart(options) {
    const {
      id = 'chart-' + Math.random().toString(36).substr(2, 9),
      labels = ['Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov'],
      series = [
        { name: 'Total Booking', data: [310, 385, 420, 398, 465, 512], color: '#0F766E', unit: ' booking', showArea: true }
      ],
      height = 230,
      formatValue = (v) => typeof v === 'number' ? v.toLocaleString('id-ID') : v
    } = options;

    const width = 640;
    const paddingLeft = 55;
    const paddingRight = 30;
    const paddingTop = 25;
    const paddingBottom = 40;
    const chartW = width - paddingLeft - paddingRight;
    const chartH = height - paddingTop - paddingBottom;

    // Determine max value
    let allVals = [];
    series.forEach(s => { allVals = allVals.concat(s.data); });
    const rawMax = Math.max(...allVals, 10);
    const maxVal = Math.ceil(rawMax * 1.15 / 10) * 10;
    const minVal = 0;

    // Grid lines (4 steps)
    const gridSteps = 4;
    let gridLines = '';
    for (let i = 0; i <= gridSteps; i++) {
      const yVal = Math.round(minVal + (maxVal - minVal) * (i / gridSteps));
      const yPos = paddingTop + chartH - (i / gridSteps) * chartH;
      gridLines += `
        <line x1="${paddingLeft}" y1="${yPos}" x2="${width - paddingRight}" y2="${yPos}" stroke="var(--border-soft, #E2E8F0)" stroke-dasharray="4,4" stroke-width="1"/>
        <text x="${paddingLeft - 12}" y="${yPos + 4}" font-size="11" font-weight="600" fill="var(--t-light, #94A3B8)" text-anchor="end">${formatValue(yVal)}</text>
      `;
    }

    // X Axis labels
    let xLabels = '';
    const xStep = chartW / (labels.length - 1);
    labels.forEach((lbl, idx) => {
      const xPos = paddingLeft + idx * xStep;
      xLabels += `
        <text x="${xPos}" y="${height - 12}" font-size="12" font-weight="600" fill="var(--t-muted, #64748B)" text-anchor="middle">${lbl}</text>
      `;
    });

    // Series rendering
    const seriesSvg = series.map((s, sIdx) => {
      const points = s.data.map((val, idx) => {
        const x = paddingLeft + idx * xStep;
        const y = paddingTop + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;
        return { x, y, val, label: labels[idx] };
      });

      // Smooth Bezier path
      let pathD = `M ${points[0].x} ${points[0].y}`;
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i];
        const p1 = points[i + 1];
        const cp1x = p0.x + (p1.x - p0.x) * 0.45;
        const cp1y = p0.y;
        const cp2x = p1.x - (p1.x - p0.x) * 0.45;
        const cp2y = p1.y;
        pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
      }

      // Optional Area fill
      let areaMarkup = '';
      if (s.showArea) {
        const lastP = points[points.length - 1];
        const firstP = points[0];
        const bottomY = paddingTop + chartH;
        areaMarkup = `
          <defs>
            <linearGradient id="areaGrad-${id}-${sIdx}" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="${s.color}" stop-opacity="0.14"/>
              <stop offset="65%" stop-color="${s.color}" stop-opacity="0.03"/>
              <stop offset="100%" stop-color="${s.color}" stop-opacity="0.0"/>
            </linearGradient>
          </defs>
          <path d="${pathD} L ${lastP.x} ${bottomY} L ${firstP.x} ${bottomY} Z" fill="url(#areaGrad-${id}-${sIdx})" />
        `;
      }

      const strokeDash = s.dashed ? 'stroke-dasharray="6,4"' : '';

      // Interactive points
      const dots = points.map(p => `
        <g class="chart-interactive-point" data-series="${s.name}" data-month="${p.label}" data-val="${formatValue(p.val)}${s.unit || ''}">
          <circle cx="${p.x}" cy="${p.y}" r="8" fill="${s.color}" fill-opacity="0.15" class="chart-point-pulse"/>
          <circle cx="${p.x}" cy="${p.y}" r="4.5" fill="var(--bg-card, #FFFFFF)" stroke="${s.color}" stroke-width="2.5" class="chart-point-dot"/>
        </g>
      `).join('');

      return `
        ${areaMarkup}
        <path d="${pathD}" fill="none" stroke="${s.color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" ${strokeDash} class="chart-line-path"/>
        ${dots}
      `;
    }).join('');

    // Attach interaction script once mounted
    setTimeout(() => {
      initChartTooltips(id);
    }, 50);

    return `
      <div class="line-chart-container" id="${id}">
        <div class="line-chart-tooltip" id="tooltip-${id}" style="display:none;"></div>
        <svg viewBox="0 0 ${width} ${height}" class="line-chart-svg" preserveAspectRatio="xMidYMid meet">
          ${gridLines}
          ${xLabels}
          ${seriesSvg}
        </svg>
      </div>
    `;
  }

  function initChartTooltips(chartId) {
    const container = document.getElementById(chartId);
    if (!container) return;
    const tooltip = container.querySelector('.line-chart-tooltip');
    if (!tooltip) return;

    const points = container.querySelectorAll('.chart-interactive-point');
    points.forEach(pt => {
      pt.addEventListener('mouseenter', (e) => {
        const seriesName = pt.getAttribute('data-series');
        const month = pt.getAttribute('data-month');
        const val = pt.getAttribute('data-val');

        tooltip.innerHTML = `
          <div style="font-size:0.75rem; color:#94A3B8; margin-bottom:2px;">Bulan ${month} 2026</div>
          <div style="font-weight:700; color:#FFFFFF;">${seriesName}: <span style="color:#14B8A6;">${val}</span></div>
        `;
        tooltip.style.display = 'block';

        const rect = pt.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const left = rect.left - containerRect.left + (rect.width / 2);
        const top = rect.top - containerRect.top;

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
      });

      pt.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
      });
    });
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
    confirmDialog,
    openFormModal,
    renderPagination,
    bindPagination,
    initScrollReveal,
    renderDemoBar,
    renderPublicHeader,
    renderPublicFooter,
    renderDashboardShell,
    renderLineChart,
    generateDummyQR,
    initPasswordToggles
  };
})();
