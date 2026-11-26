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
            <button type="button" class="mobile-menu-btn" id="mobile-menu-toggle" aria-label="Buka menu navigasi" aria-expanded="false">
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

    const headerEl = document.getElementById('site-header');
    window.addEventListener('scroll', () => {
      if (headerEl) headerEl.classList.toggle('is-scrolled', window.scrollY > 12);
    }, { passive: true });

    const toggle = document.getElementById('mobile-menu-toggle');
    const drawer = document.getElementById('mobile-drawer');
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
                <li><a href="${root}pages/buyer/bookings.html">My Booking</a></li>
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
    const sidebarMount = document.getElementById('app-sidebar-mount');
    const topbarMount = document.getElementById('app-topbar-mount');
    const mainEl = document.querySelector('.app-main');
    const shellEl = document.querySelector('.app-shell');
    const root = getRootPrefix();
    const { icon } = window.SasyTix.Icons;
    const state = window.SasyTix.Storage.loadState();
    const user = window.SasyTix.Storage.getCurrentUser(state);

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
    const portalLabel = role === 'owner' ? 'Owner Executive' : 'Admin Operations';

    if (sidebarMount) {
      sidebarMount.innerHTML = `
        <div class="sidebar-backdrop" id="sidebar-backdrop"></div>
        <aside class="app-sidebar" id="app-sidebar">
          <div class="sidebar-brand">
            <a href="${root}index.html" class="brand-logo" style="color:#FFFFFF; text-decoration:none; display:flex; align-items:center; gap:10px;">
              <img src="${root}assets/logos/favicon.png" alt="Sasy.Tix" class="brand-logo-favicon">
              <span class="brand-logo-text">
                <img src="${root}assets/logos/logo.png" alt="Sasytix.com" style="height:22px; width:auto; object-fit:contain; display:block;">
                <span class="brand-logo-sub" style="color:rgba(255,255,255,0.72); font-size:0.6875rem; margin-top:2px;">${portalLabel}</span>
              </span>
            </a>
            <button type="button" class="sidebar-collapse-btn" id="sidebar-collapse-btn" title="${isCollapsed ? 'Lebarkan Sidebar' : 'Sembunyikan / Ciutkan Sidebar'}" aria-label="Toggle sidebar collapse">
              ${icon(isCollapsed ? 'chevronRight' : 'chevronLeft', 16)}
            </button>
          </div>
          <nav class="sidebar-nav" aria-label="${portalLabel} navigation">
            <div class="sidebar-section-label">${portalLabel}</div>
            ${menu.map(item => `
              <a href="${item.href}" class="sidebar-link ${activeKey === item.key ? 'is-active' : ''}" data-tooltip="${item.label}">
                ${icon(item.icon, 18)}
                <span>${item.label}</span>
              </a>
            `).join('')}
          </nav>
          <div class="sidebar-footer">
            <a href="${root}index.html" class="sidebar-link" data-tooltip="Kembali ke Beranda">
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
            <button type="button" class="sidebar-toggle-btn" id="sidebar-toggle-btn" title="Toggle Sidebar" aria-label="Toggle sidebar">
              ${icon('menu', 20)}
            </button>
            <div class="topbar-live-status">
              <span class="live-status-dot"></span>
              <span>Live System · Batam WIB</span>
            </div>
            <div class="breadcrumb">
              <span class="breadcrumb-pill">${role === 'owner' ? 'OWNER' : 'ADMIN'}</span>
              <span>/</span>
              <strong>${pageTitle}</strong>
            </div>
          </div>
          <div class="header-actions">
            <span class="badge badge--primary" style="display:inline-flex; align-items:center; gap:6px;">
              ${icon('user', 14)}
              ${user ? user.name : portalLabel}
            </span>
            <a href="${root}pages/buyer/auth.html?mode=login" class="btn btn--outline btn--sm">Ganti Akun</a>
          </div>
        </header>
      `;
    }

    if (mainEl && !mainEl.querySelector('.app-footer')) {
      const footer = document.createElement('footer');
      footer.className = 'app-footer';
      footer.innerHTML = `<span>© 2026 Sasy.Tix Maritime Portal · ${portalLabel}</span><span>Simulasi Operasional Ferry Batam · Singapura · Malaysia</span>`;
      mainEl.appendChild(footer);
    }

    // Sidebar collapse & drawer events
    const toggleBtn = document.getElementById('sidebar-toggle-btn');
    const collapseBtn = document.getElementById('sidebar-collapse-btn');
    const sidebar = document.getElementById('app-sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    const appShell = document.querySelector('.app-shell');

    function toggleSidebarCollapse() {
      if (!appShell) return;
      const willBeCollapsed = !appShell.classList.contains('sidebar-collapsed');
      appShell.classList.toggle('sidebar-collapsed', willBeCollapsed);
      localStorage.setItem('sasytix_sidebar_collapsed', willBeCollapsed ? 'true' : 'false');
      if (collapseBtn) {
        collapseBtn.innerHTML = icon(willBeCollapsed ? 'chevronRight' : 'chevronLeft', 16);
        collapseBtn.title = willBeCollapsed ? 'Lebarkan Sidebar' : 'Sembunyikan / Ciutkan Sidebar';
      }
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

    if (collapseBtn) {
      collapseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSidebarCollapse();
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
        <line x1="${paddingLeft}" y1="${yPos}" x2="${width - paddingRight}" y2="${yPos}" stroke="#E2E8F0" stroke-dasharray="4,4" stroke-width="1"/>
        <text x="${paddingLeft - 12}" y="${yPos + 4}" font-size="11" font-weight="600" fill="#94A3B8" text-anchor="end">${formatValue(yVal)}</text>
      `;
    }

    // X Axis labels
    let xLabels = '';
    const xStep = chartW / (labels.length - 1);
    labels.forEach((lbl, idx) => {
      const xPos = paddingLeft + idx * xStep;
      xLabels += `
        <text x="${xPos}" y="${height - 12}" font-size="12" font-weight="600" fill="#64748B" text-anchor="middle">${lbl}</text>
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
              <stop offset="0%" stop-color="${s.color}" stop-opacity="0.25"/>
              <stop offset="100%" stop-color="${s.color}" stop-opacity="0.01"/>
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
          <circle cx="${p.x}" cy="${p.y}" r="4.5" fill="#FFFFFF" stroke="${s.color}" stroke-width="2.5" class="chart-point-dot"/>
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
    initScrollReveal,
    renderDemoBar,
    renderPublicHeader,
    renderPublicFooter,
    renderDashboardShell,
    renderLineChart,
    generateDummyQR
  };
})();
