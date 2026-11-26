(function () {
  const { Storage, UI } = window.SasyTix;

  document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.getAttribute('data-page') || 'dashboard';
    const titles = {
      dashboard: 'Executive Dashboard',
      analytics: 'Business Analytics',
      financial: 'Financial Overview',
      operational: 'Operational Overview',
      admins: 'Admin Management'
    };

    UI.renderDashboardShell('owner', page, titles[page] || 'Owner');

    const root = document.getElementById('owner-main-content');
    if (!root) return;

    if (page === 'dashboard') renderExecutive(root);
    if (page === 'analytics') renderAnalytics(root);
    if (page === 'financial') renderFinancial(root);
    if (page === 'operational') renderOperational(root);
    if (page === 'admins') renderAdmins(root);
  });

  function renderExecutive(root) {
    const st = Storage.loadState();
    const totalBookings = st.bookings.length;
    const totalPax = st.bookings.reduce((s, b) => s + b.passengers.length, 0);
    const grossRev = st.bookings.reduce((s, b) => s + b.totalAmount, 0);
    const verifiedCount = st.bookings.filter(b => b.paymentStatus === 'Verified').length;
    const cancelledCount = st.bookings.filter(b => b.bookingStatus === 'Cancelled').length;
    const avgTicket = totalBookings ? Math.round(grossRev / totalBookings) : 0;
    const paySuccessRate = totalBookings ? Math.round((verifiedCount / totalBookings) * 100) : 0;
    const cancelRate = totalBookings ? Math.round((cancelledCount / totalBookings) * 100) : 0;
    const maxRev = Math.max(...st.monthlyTrend.map(m => m.revenueM), 1);
    const { icon } = window.SasyTix.Icons;

    const months = st.monthlyTrend.map(m => m.month);
    const revData = st.monthlyTrend.map(m => m.revenueM);
    const targetData = [150, 185, 210, 220, 240, 265];

    const lineChartHtml = UI.renderLineChart({
      id: 'owner-revenue-line-chart',
      labels: months,
      series: [
        { name: 'Realisasi Revenue', data: revData, color: '#10b981', unit: ' Jt IDR', showArea: true },
        { name: 'Target Anggaran', data: targetData, color: '#f59e0b', unit: ' Jt IDR', dashed: true, showArea: false }
      ],
      height: 230,
      formatValue: (v) => 'Rp' + v + 'M'
    });

    root.innerHTML = `
      <section class="page-hero">
        <div>
          <span class="eyebrow">Executive Summary · Sasy.Tix Maritime Group</span>
          <h1 class="page-hero-title">Performa Koridor Batam – Singapura – Malaysia</h1>
          <p class="page-hero-sub">Target Semester Tercapai <strong>107.8%</strong> · 4 Koridor Pelayaran Internasional · Semester II 2026</p>
        </div>
        <div class="page-hero-actions">
          <a href="analytics.html" class="btn btn--primary">${icon('barChart', 14)} Analitik Rute</a>
          <a href="financial.html" class="btn btn--outline">${icon('creditCard', 14)} Laporan Finansial</a>
        </div>
      </section>

      <div class="kpi-grid">
        <div class="kpi-card">
          <div>
            <div class="kpi-header">
              <span class="kpi-label">Gross Revenue (Simulasi)</span>
              <span class="kpi-icon-badge kpi-icon-badge--teal">${icon('creditCard', 19)}</span>
            </div>
            <div class="kpi-value" style="font-size:20px; color:var(--primary);">${UI.formatIDR(grossRev)}</div>
          </div>
          <div class="kpi-meta">
            <span class="kpi-trend kpi-trend--up">${icon('trendingUp', 12)} +13.8% MoM</span>
            <span>Pertumbuhan stabil</span>
          </div>
        </div>

        <div class="kpi-card">
          <div>
            <div class="kpi-header">
              <span class="kpi-label">Total Booking &amp; Penumpang</span>
              <span class="kpi-icon-badge kpi-icon-badge--blue">${icon('users', 19)}</span>
            </div>
            <div class="kpi-value">${totalBookings} <span style="font-size:14px; font-weight:500; color:var(--t-muted);">(${totalPax} pax)</span></div>
          </div>
          <div class="kpi-meta">
            <span class="kpi-trend kpi-trend--neutral">${icon('ticket', 12)} Avg Ticket</span>
            <span>${UI.formatIDR(avgTicket)} / booking</span>
          </div>
        </div>

        <div class="kpi-card">
          <div>
            <div class="kpi-header">
              <span class="kpi-label">Payment Success Rate</span>
              <span class="kpi-icon-badge kpi-icon-badge--green">${icon('checkCircle', 19)}</span>
            </div>
            <div class="kpi-value" style="color:var(--success);">${paySuccessRate}%</div>
          </div>
          <div class="kpi-meta">
            <span class="kpi-trend kpi-trend--up">${icon('checkCircle', 12)} Optimal</span>
            <span>${verifiedCount} dari ${totalBookings} transaksi</span>
          </div>
        </div>

        <div class="kpi-card">
          <div>
            <div class="kpi-header">
              <span class="kpi-label">Cancellation Rate</span>
              <span class="kpi-icon-badge kpi-icon-badge--red">${icon('alertCircle', 19)}</span>
            </div>
            <div class="kpi-value" style="color:var(--danger);">${cancelRate}%</div>
          </div>
          <div class="kpi-meta">
            <span class="kpi-trend ${cancelRate > 20 ? 'kpi-trend--down' : 'kpi-trend--neutral'}">${icon('alertCircle', 12)} Terkendali</span>
            <span>${cancelledCount} transaksi dibatalkan</span>
          </div>
        </div>
      </div>

      <div class="dashboard-grid-2">
        <div class="chart-card">
          <div class="chart-header">
            <div class="chart-title-wrap">
              <h2 class="chart-title">Tren Revenue &amp; Realisasi Target Finansial</h2>
              <span class="chart-subtitle">Pendapatan bulanan vs target anggaran (Juta IDR · H2 2026)</span>
            </div>
            <div class="chart-controls">
              <div class="chart-legend">
                <span class="legend-item"><span class="legend-dot" style="background:#10b981;"></span> Realisasi Revenue</span>
                <span class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span> Target Anggaran</span>
              </div>
              <div class="chart-tab-group">
                <button type="button" class="chart-tab-btn is-active" id="tab-owner-line">${icon('lineChart', 14)} Line</button>
                <button type="button" class="chart-tab-btn" id="tab-owner-bar">${icon('barChart', 14)} Bar</button>
              </div>
            </div>
          </div>
          <div class="chart-body" style="padding:0;">
            <div id="owner-chart-line-view">${lineChartHtml}</div>
            <div id="owner-chart-bar-view" style="display:none;">
              <div class="chart-bars">
                ${st.monthlyTrend.map(m => `
                  <div class="chart-bar-col">
                    <div class="chart-bar chart-bar--emerald" style="height:${Math.round((m.revenueM / maxRev) * 160)}px;" title="Rp${m.revenueM} Jt"></div>
                    <span class="chart-bar-label">${m.month}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div>
              <span class="eyebrow">Insights</span>
              <h2 class="card-title">Executive Business Insights</h2>
            </div>
            <span class="badge badge--info">Q4 2026</span>
          </div>
          <div class="card-body insight-list">
            <div class="insight-item">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                <strong style="font-size:13px; color:var(--primary);">Koridor Batam–Singapura Mendominasi</strong>
                <span class="badge badge--success">+22% Okupansi</span>
              </div>
              <p style="margin:0; font-size:12px; color:var(--t-muted);">Pelayaran Batam Centre ↔ HarbourFront menyumbang okupansi tertinggi pada jam pagi (07:00–10:00).</p>
            </div>
            <div class="insight-item">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                <strong style="font-size:13px; color:var(--primary);">Peluang Pertumbuhan Batam–Malaysia</strong>
                <span class="badge badge--info">Grup Besar</span>
              </div>
              <p style="margin:0; font-size:12px; color:var(--t-muted);">Rute Harbour Bay → Puteri Harbour menunjukkan rata-rata ukuran grup lebih besar (2+ pax per booking).</p>
            </div>
            <div class="insight-item">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                <strong style="font-size:13px; color:var(--primary);">Preferensi Pembayaran Digital</strong>
                <span class="badge badge--warning">78% Non-Tunai</span>
              </div>
              <p style="margin:0; font-size:12px; color:var(--t-muted);">QRIS dan Virtual Account mendominasi metode checkout dibanding transfer manual.</p>
            </div>
          </div>
        </div>
      </div>
    `;

    const tabLine = document.getElementById('tab-owner-line');
    const tabBar = document.getElementById('tab-owner-bar');
    const viewLine = document.getElementById('owner-chart-line-view');
    const viewBar = document.getElementById('owner-chart-bar-view');

    if (tabLine && tabBar) {
      tabLine.addEventListener('click', () => {
        tabLine.classList.add('is-active');
        tabBar.classList.remove('is-active');
        viewLine.style.display = 'block';
        viewBar.style.display = 'none';
      });
      tabBar.addEventListener('click', () => {
        tabBar.classList.add('is-active');
        tabLine.classList.remove('is-active');
        viewLine.style.display = 'none';
        viewBar.style.display = 'block';
      });
    }
  }

  function renderAnalytics(root) {
    const st = Storage.loadState();
    const btmSin = st.bookings.filter(b => Storage.getRouteById(b.routeId, st)?.corridor === 'Batam - Singapura');
    const btmMy = st.bookings.filter(b => Storage.getRouteById(b.routeId, st)?.corridor === 'Batam - Malaysia');
    const revSin = btmSin.reduce((s, b) => s + b.totalAmount, 0);
    const revMy = btmMy.reduce((s, b) => s + b.totalAmount, 0);
    const total = Math.max(revSin + revMy, 1);

    let currentPage = 1;
    const pageSize = 6;

    root.innerHTML = `
      <section class="page-hero">
        <div>
          <span class="eyebrow">Analitik</span>
          <h1 class="page-hero-title">Business Analytics</h1>
          <p class="page-hero-sub">Perbandingan kontribusi pendapatan antar koridor dan performa rute pelayaran.</p>
        </div>
      </section>

      <div class="kpi-grid" style="grid-template-columns:repeat(2, minmax(0, 1fr));">
        <div class="kpi-card">
          <div class="kpi-label">Koridor Batam – Singapura</div>
          <div class="kpi-value">${UI.formatIDR(revSin)}</div>
          <div class="kpi-meta">${btmSin.length} booking · Share ${Math.round((revSin / total) * 100)}%</div>
          <div class="progress-track" style="margin-top:10px;"><div class="progress-fill" style="width:${Math.round((revSin / total) * 100)}%;"></div></div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Koridor Batam – Malaysia</div>
          <div class="kpi-value">${UI.formatIDR(revMy)}</div>
          <div class="kpi-meta">${btmMy.length} booking · Share ${Math.round((revMy / total) * 100)}%</div>
          <div class="progress-track" style="margin-top:10px;"><div class="progress-fill" style="width:${Math.round((revMy / total) * 100)}%; background:var(--success);"></div></div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div>
            <span class="eyebrow">Rute</span>
            <h2 class="card-title">Performa per Rute</h2>
          </div>
        </div>
        <div class="table-wrap" style="border:none; border-radius:0; box-shadow:none;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Rute</th>
                <th>Koridor</th>
                <th>Jumlah Booking</th>
                <th>Total Penumpang</th>
                <th>Revenue Simulasi</th>
              </tr>
            </thead>
            <tbody id="anl-tbody"></tbody>
          </table>
        </div>
        <div id="anl-pagination"></div>
      </div>
    `;

    function draw() {
      const list = st.routes;
      const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
      if (currentPage > totalPages) currentPage = totalPages;
      const paged = list.slice((currentPage - 1) * pageSize, currentPage * pageSize);

      document.getElementById('anl-tbody').innerHTML = paged.map(r => {
        const rBookings = st.bookings.filter(b => b.routeId === r.id);
        const rPax = rBookings.reduce((s, b) => s + b.passengers.length, 0);
        const rRev = rBookings.reduce((s, b) => s + b.totalAmount, 0);
        return `
          <tr>
            <td><strong>${r.originCity} → ${r.destinationCity}</strong><div style="font-size:11.5px; color:var(--t-muted);">${r.originTerminal}</div></td>
            <td>${r.corridor}</td>
            <td>${rBookings.length}</td>
            <td>${rPax}</td>
            <td><strong>${UI.formatIDR(rRev)}</strong></td>
          </tr>
        `;
      }).join('');

      const pagEl = document.getElementById('anl-pagination');
      pagEl.innerHTML = UI.renderPagination(list.length, currentPage, pageSize);
      UI.bindPagination(pagEl, list.length, pageSize, (p) => { currentPage = p; draw(); });
    }
    draw();
  }

  function renderFinancial(root) {
    const st = Storage.loadState();
    const { icon } = window.SasyTix.Icons;
    const verified = st.bookings.filter(b => b.paymentStatus === 'Verified').reduce((s, b) => s + b.totalAmount, 0);
    const pending = st.bookings.filter(b => b.paymentStatus === 'Pending' || b.paymentStatus === 'Payment Submitted').reduce((s, b) => s + b.totalAmount, 0);
    const rejected = st.bookings.filter(b => b.paymentStatus === 'Rejected').reduce((s, b) => s + b.totalAmount, 0);

    let currentPage = 1;
    const pageSize = 8;

    root.innerHTML = `
      <section class="page-hero">
        <div>
          <span class="eyebrow">Keuangan</span>
          <h1 class="page-hero-title">Financial Overview</h1>
          <p class="page-hero-sub">Ikhtisar pendapatan terverifikasi, tagihan tertunda, dan buku besar transaksi.</p>
        </div>
        <div class="page-hero-actions">
          <button type="button" class="btn btn--primary" id="btn-export-fin">${icon('download', 15)} Ekspor Laporan</button>
        </div>
      </section>

      <div class="kpi-grid" style="grid-template-columns:repeat(3, minmax(0, 1fr));">
        <div class="kpi-card">
          <div class="kpi-label">Verified Revenue</div>
          <div class="kpi-value" style="color:var(--success); font-size:21px;">${UI.formatIDR(verified)}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Pending Revenue</div>
          <div class="kpi-value" style="color:var(--warning); font-size:21px;">${UI.formatIDR(pending)}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Rejected / Cancelled</div>
          <div class="kpi-value" style="color:var(--danger); font-size:21px;">${UI.formatIDR(rejected)}</div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div>
            <span class="eyebrow">Transaksi</span>
            <h2 class="card-title">Buku Besar Transaksi Finansial</h2>
          </div>
          <select id="fin-status-filter" class="select" style="max-width:190px;">
            <option value="">Semua Status</option>
            <option value="Verified">Verified</option>
            <option value="Payment Submitted">Payment Submitted</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <div class="table-wrap" style="border:none; border-radius:0; box-shadow:none;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Tanggal</th>
                <th>Metode Pembayaran</th>
                <th>Referensi</th>
                <th>Status</th>
                <th>Nominal</th>
              </tr>
            </thead>
            <tbody id="fin-tbody"></tbody>
          </table>
        </div>
        <div id="fin-pagination"></div>
      </div>
    `;

    function draw() {
      const statusF = document.getElementById('fin-status-filter').value;
      const list = st.bookings.filter(b => !statusF || b.paymentStatus === statusF);
      const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
      if (currentPage > totalPages) currentPage = totalPages;
      const paged = list.slice((currentPage - 1) * pageSize, currentPage * pageSize);

      document.getElementById('fin-tbody').innerHTML = paged.map(b => `
        <tr>
          <td class="mono"><strong>${b.id}</strong></td>
          <td>${UI.formatDate(b.travelDate)}</td>
          <td>${b.paymentMethod}</td>
          <td class="mono" style="font-size:12px; color:var(--t-muted);">${b.paymentProofRef || '-'}</td>
          <td>${UI.statusBadge(b.paymentStatus)}</td>
          <td><strong>${UI.formatIDR(b.totalAmount)}</strong></td>
        </tr>
      `).join('');

      const pagEl = document.getElementById('fin-pagination');
      pagEl.innerHTML = UI.renderPagination(list.length, currentPage, pageSize);
      UI.bindPagination(pagEl, list.length, pageSize, (p) => { currentPage = p; draw(); });
    }

    document.getElementById('fin-status-filter').addEventListener('change', () => { currentPage = 1; draw(); });
    document.getElementById('btn-export-fin').addEventListener('click', () => {
      UI.showToast('Laporan finansial CSV berhasil diunduh.', 'success');
    });
    draw();
  }

  function renderOperational(root) {
    const st = Storage.loadState();
    const activeSch = st.schedules.filter(s => s.status === 'active');
    const totalQuota = activeSch.reduce((s, x) => s + x.quota, 0);
    const totalBooked = activeSch.reduce((s, x) => s + x.booked, 0);
    const occupancy = totalQuota ? Math.round((totalBooked / totalQuota) * 100) : 0;

    let currentPage = 1;
    const pageSize = 8;

    root.innerHTML = `
      <section class="page-hero">
        <div>
          <span class="eyebrow">Armada &amp; Okupansi</span>
          <h1 class="page-hero-title">Operational Overview</h1>
          <p class="page-hero-sub">Pantau tingkat keterisian kursi armada dan efektivitas jadwal keberangkatan.</p>
        </div>
      </section>

      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-label">Jadwal Aktif</div>
          <div class="kpi-value">${activeSch.length}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Operator / Armada</div>
          <div class="kpi-value">${st.operators.length}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Kursi Terisi</div>
          <div class="kpi-value">${totalBooked} / ${totalQuota}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Okupansi Simulasi</div>
          <div class="kpi-value" style="color:var(--primary);">${occupancy}%</div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div>
            <span class="eyebrow">Armada</span>
            <h2 class="card-title">Okupansi Jadwal Mendatang</h2>
          </div>
          <input type="search" id="ops-search" class="input" style="max-width:230px;" placeholder="Cari kapal / rute...">
        </div>
        <div class="table-wrap" style="border:none; border-radius:0; box-shadow:none;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Kapal</th>
                <th>Rute</th>
                <th>Tanggal &amp; Jam</th>
                <th>Okupansi</th>
              </tr>
            </thead>
            <tbody id="ops-tbody"></tbody>
          </table>
        </div>
        <div id="ops-pagination"></div>
      </div>
    `;

    function draw() {
      const q = document.getElementById('ops-search').value.trim().toLowerCase();
      const list = activeSch.filter(sch => {
        if (!q) return true;
        const r = Storage.getRouteById(sch.routeId, st);
        return `${sch.vessel} ${r ? `${r.originCity} ${r.destinationCity}` : ''}`.toLowerCase().includes(q);
      });

      const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
      if (currentPage > totalPages) currentPage = totalPages;
      const paged = list.slice((currentPage - 1) * pageSize, currentPage * pageSize);

      document.getElementById('ops-tbody').innerHTML = paged.map(sch => {
        const r = Storage.getRouteById(sch.routeId, st);
        const pct = Math.round((sch.booked / Math.max(sch.quota, 1)) * 100);
        return `
          <tr>
            <td><strong>${sch.vessel}</strong></td>
            <td>${r ? `${r.originCity} → ${r.destinationCity}` : '-'}</td>
            <td>${UI.formatDate(sch.date)} · ${sch.departureTime}</td>
            <td style="min-width:170px;">
              <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px;">
                <span>${sch.booked}/${sch.quota}</span><span><strong>${pct}%</strong></span>
              </div>
              <div class="progress-track"><div class="progress-fill" style="width:${pct}%;"></div></div>
            </td>
          </tr>
        `;
      }).join('');

      const pagEl = document.getElementById('ops-pagination');
      pagEl.innerHTML = UI.renderPagination(list.length, currentPage, pageSize);
      UI.bindPagination(pagEl, list.length, pageSize, (p) => { currentPage = p; draw(); });
    }

    document.getElementById('ops-search').addEventListener('input', () => { currentPage = 1; draw(); });
    draw();
  }

  function renderAdmins(root) {
    const { icon } = window.SasyTix.Icons;
    let currentPage = 1;
    const pageSize = 8;

    root.innerHTML = `
      <section class="page-hero">
        <div>
          <span class="eyebrow">Akses &amp; Tim</span>
          <h1 class="page-hero-title">Admin Management</h1>
          <p class="page-hero-sub">Kelola akun tim operasional, hak akses modul, dan status keaktifan admin.</p>
        </div>
        <div class="page-hero-actions">
          <button type="button" class="btn btn--primary" id="btn-add-admin">${icon('plus', 15)} Tambah Admin</button>
        </div>
      </section>

      <div class="filter-bar">
        <input type="search" id="adm-search" class="input" style="max-width:260px;" placeholder="Cari nama / email / role...">
        <select id="adm-status-filter" class="select" style="max-width:180px;">
          <option value="">Semua Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div class="card">
        <div class="table-wrap" style="border:none; border-radius:14px 14px 0 0; box-shadow:none;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Email</th>
                <th>Role &amp; Izin</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody id="adm-tbody"></tbody>
          </table>
        </div>
        <div id="adm-pagination"></div>
      </div>
    `;

    function openAdminModal(existing) {
      const isEdit = Boolean(existing);
      UI.openFormModal({
        title: isEdit ? `Edit Admin · ${existing.name}` : 'Tambah Admin Operasional',
        submitLabel: isEdit ? 'Simpan Perubahan' : 'Tambah Admin',
        bodyHtml: `
          <div class="form-group">
            <label class="form-label" for="adm-name">Nama Lengkap</label>
            <input type="text" id="adm-name" class="input" value="${existing ? existing.name : ''}" placeholder="Contoh: Rina Kusuma" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="adm-email">Email</label>
            <input type="email" id="adm-email" class="input" value="${existing ? existing.email : ''}" placeholder="nama@sasytix.id" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="adm-role">Role Operasional</label>
            <select id="adm-role" class="select">
              <option value="Ticketing Officer" ${existing?.role === 'Ticketing Officer' ? 'selected' : ''}>Ticketing Officer</option>
              <option value="Operations Lead" ${existing?.role === 'Operations Lead' ? 'selected' : ''}>Operations Lead</option>
              <option value="Schedule Coordinator" ${existing?.role === 'Schedule Coordinator' ? 'selected' : ''}>Schedule Coordinator</option>
              <option value="Finance Verifier" ${existing?.role === 'Finance Verifier' ? 'selected' : ''}>Finance Verifier</option>
              <option value="Port Supervisor" ${existing?.role === 'Port Supervisor' ? 'selected' : ''}>Port Supervisor</option>
              <option value="Customer Support" ${existing?.role === 'Customer Support' ? 'selected' : ''}>Customer Support</option>
            </select>
          </div>
        `,
        onSubmit: () => {
          const cur = Storage.loadState();
          const payload = {
            name: document.getElementById('adm-name').value.trim(),
            email: document.getElementById('adm-email').value.trim(),
            role: document.getElementById('adm-role').value
          };
          if (isEdit) {
            const idx = cur.admins.findIndex(x => x.id === existing.id);
            if (idx !== -1) cur.admins[idx] = { ...cur.admins[idx], ...payload };
            UI.showToast('Data admin berhasil diperbarui.', 'success');
          } else {
            cur.admins.unshift({
              id: 'adm-' + Date.now(),
              ...payload,
              permissions: ['Verify Payment', 'View Bookings'],
              status: 'Active',
              lastActive: 'Baru saja'
            });
            UI.showToast('Admin baru berhasil ditambahkan.', 'success');
          }
          Storage.saveState(cur);
          draw();
        }
      });
    }

    function draw() {
      const st = Storage.loadState();
      const q = document.getElementById('adm-search').value.trim().toLowerCase();
      const statusF = document.getElementById('adm-status-filter').value;

      const list = st.admins.filter(a => {
        if (statusF && a.status !== statusF) return false;
        if (q) {
          const hay = `${a.name} ${a.email} ${a.role}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      });

      const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
      if (currentPage > totalPages) currentPage = totalPages;
      const paged = list.slice((currentPage - 1) * pageSize, currentPage * pageSize);

      document.getElementById('adm-tbody').innerHTML = paged.map(a => `
        <tr>
          <td><strong>${a.name}</strong><div style="font-size:11.5px; color:var(--t-muted);">Aktif: ${a.lastActive}</div></td>
          <td>${a.email}</td>
          <td><strong>${a.role}</strong><div style="font-size:11.5px; color:var(--t-muted);">${(a.permissions || []).join(', ')}</div></td>
          <td>${UI.statusBadge(a.status)}</td>
          <td>
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
              <button type="button" class="btn btn--outline btn--sm btn-edit-adm" data-id="${a.id}">Edit</button>
              <button type="button" class="btn btn--outline btn--sm btn-toggle-adm" data-id="${a.id}">${a.status === 'Active' ? 'Nonaktifkan' : 'Aktifkan'}</button>
            </div>
          </td>
        </tr>
      `).join('') || '<tr><td colspan="5" style="text-align:center; padding:24px; color:var(--t-muted);">Tidak ada data admin.</td></tr>';

      const pagEl = document.getElementById('adm-pagination');
      pagEl.innerHTML = UI.renderPagination(list.length, currentPage, pageSize);
      UI.bindPagination(pagEl, list.length, pageSize, (p) => { currentPage = p; draw(); });

      root.querySelectorAll('.btn-edit-adm').forEach(btn => {
        btn.addEventListener('click', () => {
          const cur = Storage.loadState();
          const adm = cur.admins.find(x => x.id === btn.getAttribute('data-id'));
          if (adm) openAdminModal(adm);
        });
      });

      root.querySelectorAll('.btn-toggle-adm').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          const cur = Storage.loadState();
          const adm = cur.admins.find(x => x.id === id);
          if (!adm) return;
          const nextStatus = adm.status === 'Active' ? 'Inactive' : 'Active';
          UI.confirmDialog({
            title: `${nextStatus === 'Active' ? 'Aktifkan' : 'Nonaktifkan'} Akun Admin`,
            message: `Ubah status akses untuk <strong>${adm.name}</strong> menjadi <strong>${nextStatus}</strong>?`,
            confirmLabel: 'Ya, Ubah Status',
            type: nextStatus === 'Inactive' ? 'danger' : 'primary',
            onConfirm: () => {
              adm.status = nextStatus;
              Storage.saveState(cur);
              UI.showToast(`Status ${adm.name} diperbarui menjadi ${nextStatus}.`, 'info');
              draw();
            }
          });
        });
      });
    }

    document.getElementById('btn-add-admin').addEventListener('click', () => openAdminModal(null));
    document.getElementById('adm-search').addEventListener('input', () => { currentPage = 1; draw(); });
    document.getElementById('adm-status-filter').addEventListener('change', () => { currentPage = 1; draw(); });
    draw();
  }
})();
