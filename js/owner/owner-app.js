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
    // Target budget comparison
    const targetData = [150, 185, 210, 220, 240, 265];

    const lineChartHtml = UI.renderLineChart({
      id: 'owner-revenue-line-chart',
      labels: months,
      series: [
        { name: 'Realisasi Revenue', data: revData, color: '#10B981', unit: ' Jt IDR', showArea: true },
        { name: 'Target Anggaran', data: targetData, color: '#F59E0B', unit: ' Jt IDR', dashed: true, showArea: false }
      ],
      height: 230,
      formatValue: (v) => 'Rp' + v + 'M'
    });

    root.innerHTML = `
      <div class="exec-banner">
        <div>
          <div class="exec-banner-badge">${icon('shield', 14)} Executive Summary · Sasy.Tix Maritime Group</div>
          <h1 style="font-size:1.5rem; font-weight:800; margin-top:6px; line-height:1.2;">Performa Koridor Batam – Singapura – Malaysia</h1>
          <div class="exec-banner-stats">
            <span class="exec-banner-stat-chip">${icon('trendingUp', 14)} Target Semester Tercapai 107.8%</span>
            <span class="exec-banner-stat-chip">${icon('ship', 14)} 4 Koridor Pelayaran Internasional</span>
            <span class="exec-banner-stat-chip">${icon('calendar', 14)} Periode: Semester II 2026</span>
          </div>
        </div>
        <div style="display:flex; gap:10px; align-items:center;">
          <a href="analytics.html" class="btn btn--accent btn--sm">${icon('barChart', 14)} Analitik Rute</a>
          <a href="financial.html" class="btn btn--outline btn--sm" style="background:rgba(255,255,255,0.14); color:#FFFFFF; border-color:rgba(255,255,255,0.3);">${icon('creditCard', 14)} Laporan Finansial</a>
        </div>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card">
          <div>
            <div class="kpi-header">
              <span class="kpi-label">Gross Revenue (Simulasi)</span>
              <span class="kpi-icon-badge kpi-icon-badge--teal">${icon('creditCard', 20)}</span>
            </div>
            <div class="kpi-value" style="font-size:1.35rem; color:var(--color-primary);">${UI.formatIDR(grossRev)}</div>
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
              <span class="kpi-icon-badge kpi-icon-badge--blue">${icon('users', 20)}</span>
            </div>
            <div class="kpi-value">${totalBookings} <span class="text-sm text-muted" style="font-weight:500;">(${totalPax} pax)</span></div>
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
              <span class="kpi-icon-badge kpi-icon-badge--green">${icon('checkCircle', 20)}</span>
            </div>
            <div class="kpi-value" style="color:var(--color-success);">${paySuccessRate}%</div>
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
              <span class="kpi-icon-badge kpi-icon-badge--red">${icon('alertCircle', 20)}</span>
            </div>
            <div class="kpi-value" style="color:var(--color-error);">${cancelRate}%</div>
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
                <span class="legend-item"><span class="legend-dot" style="background:#10B981;"></span> Realisasi Revenue</span>
                <span class="legend-item"><span class="legend-dot" style="background:#F59E0B;"></span> Target Anggaran</span>
              </div>
              <div class="chart-tab-group">
                <button type="button" class="chart-tab-btn is-active" id="tab-owner-line">${icon('lineChart', 14)} Line</button>
                <button type="button" class="chart-tab-btn" id="tab-owner-bar">${icon('barChart', 14)} Bar</button>
              </div>
            </div>
          </div>
          <div class="chart-body" style="padding:0;">
            <div id="owner-chart-line-view">
              ${lineChartHtml}
            </div>
            <div id="owner-chart-bar-view" style="display:none;">
              <div class="chart-bars">
                ${st.monthlyTrend.map(m => `
                  <div class="chart-bar-col">
                    <div class="chart-bar chart-bar--teal" style="height:${Math.round((m.revenueM / maxRev) * 160)}px;" title="Rp${m.revenueM} Jt"></div>
                    <span class="chart-bar-label">${m.month}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>

        <div class="card" style="box-shadow: 0 1px 3px rgba(0,0,0,0.03), 0 4px 14px rgba(11,37,60,0.02);">
          <div class="card-header" style="background:#FAFCFE; border-bottom:1px solid var(--color-border); padding:var(--space-5) var(--space-6);">
            <div>
              <h2 class="card-title" style="font-size:1.0625rem;">Executive Business Insights</h2>
              <div class="text-xs text-muted" style="margin-top:2px;">Analisis Strategis &amp; Tren Pertumbuhan</div>
            </div>
            <span class="badge badge--primary">Q4 2026</span>
          </div>
          <div class="card-body insight-list" style="padding:var(--space-5) var(--space-6);">
            <div class="insight-item">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                <strong class="text-sm" style="color:var(--color-primary);">Koridor Batam–Singapura Mendominasi</strong>
                <span class="badge badge--success" style="font-size:0.7rem;">+22% Okupansi</span>
              </div>
              <p class="text-xs text-muted">Pelayaran Batam Centre ↔ HarbourFront menyumbang okupansi tertinggi pada jam pagi (07:00–10:00).</p>
            </div>
            <div class="insight-item">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                <strong class="text-sm" style="color:var(--color-primary);">Peluang Pertumbuhan Batam–Malaysia</strong>
                <span class="badge badge--info" style="font-size:0.7rem;">Grup Besar</span>
              </div>
              <p class="text-xs text-muted">Rute Harbour Bay → Puteri Harbour menunjukkan rata-rata ukuran grup lebih besar (2+ pax per booking).</p>
            </div>
            <div class="insight-item">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                <strong class="text-sm" style="color:var(--color-primary);">Preferensi Pembayaran Digital</strong>
                <span class="badge badge--warning" style="font-size:0.7rem;">78% Non-Tunai</span>
              </div>
              <p class="text-xs text-muted">QRIS dan Virtual Account mendominasi metode checkout dibanding transfer manual.</p>
            </div>
          </div>
        </div>
      </div>
    `;

    const tabLine = document.getElementById('tab-owner-line');
    const tabBar = document.getElementById('tab-owner-bar');
    const viewLine = document.getElementById('owner-chart-line-view');
    const viewBar = document.getElementById('owner-chart-bar-view');
    if (tabLine && tabBar && viewLine && viewBar) {
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

    root.innerHTML = `
      <div class="kpi-grid" style="grid-template-columns:repeat(2, 1fr);">
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
          <div class="progress-track" style="margin-top:10px;"><div class="progress-fill" style="width:${Math.round((revMy / total) * 100)}%; background:var(--color-primary);"></div></div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><h2 class="card-title">Performa per Rute</h2></div>
        <div class="table-wrap" style="border:none; border-radius:0;">
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
            <tbody>
              ${st.routes.map(r => {
                const rBookings = st.bookings.filter(b => b.routeId === r.id);
                const rPax = rBookings.reduce((s, b) => s + b.passengers.length, 0);
                const rRev = rBookings.reduce((s, b) => s + b.totalAmount, 0);
                return `
                  <tr>
                    <td><strong>${r.originCity} → ${r.destinationCity}</strong><div class="text-xs text-muted">${r.originTerminal}</div></td>
                    <td>${r.corridor}</td>
                    <td>${rBookings.length}</td>
                    <td>${rPax}</td>
                    <td><strong>${UI.formatIDR(rRev)}</strong></td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderFinancial(root) {
    const st = Storage.loadState();
    const verified = st.bookings.filter(b => b.paymentStatus === 'Verified').reduce((s, b) => s + b.totalAmount, 0);
    const pending = st.bookings.filter(b => b.paymentStatus === 'Pending' || b.paymentStatus === 'Payment Submitted').reduce((s, b) => s + b.totalAmount, 0);
    const rejected = st.bookings.filter(b => b.paymentStatus === 'Rejected').reduce((s, b) => s + b.totalAmount, 0);

    root.innerHTML = `
      <div class="kpi-grid" style="grid-template-columns:repeat(3, 1fr);">
        <div class="kpi-card">
          <div class="kpi-label">Verified Revenue</div>
          <div class="kpi-value" style="color:var(--color-success); font-size:1.35rem;">${UI.formatIDR(verified)}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Pending Revenue</div>
          <div class="kpi-value" style="color:var(--color-warning); font-size:1.35rem;">${UI.formatIDR(pending)}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Rejected / Cancelled</div>
          <div class="kpi-value" style="color:var(--color-error); font-size:1.35rem;">${UI.formatIDR(rejected)}</div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><h2 class="card-title">Ringkasan Keuangan per Periode</h2></div>
        <div class="table-wrap" style="border:none; border-radius:0;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Bulan</th>
                <th>Total Booking</th>
                <th>Estimasi Gross Revenue</th>
              </tr>
            </thead>
            <tbody>
              ${st.monthlyTrend.map(m => `
                <tr>
                  <td><strong>${m.month} 2026</strong></td>
                  <td>${m.bookings}</td>
                  <td><strong>${UI.formatIDR(m.revenueM * 1000000)}</strong></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderOperational(root) {
    const st = Storage.loadState();
    const activeSch = st.schedules.filter(s => s.status === 'active');
    const totalQuota = activeSch.reduce((s, x) => s + x.quota, 0);
    const totalBooked = activeSch.reduce((s, x) => s + x.booked, 0);
    const occupancy = totalQuota ? Math.round((totalBooked / totalQuota) * 100) : 0;

    root.innerHTML = `
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
          <div class="kpi-value" style="color:var(--color-secondary);">${occupancy}%</div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><h2 class="card-title">Okupansi Jadwal Mendatang</h2></div>
        <div class="table-wrap" style="border:none; border-radius:0;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Kapal</th>
                <th>Rute</th>
                <th>Tanggal &amp; Jam</th>
                <th>Okupansi</th>
              </tr>
            </thead>
            <tbody>
              ${activeSch.map(sch => {
                const r = Storage.getRouteById(sch.routeId, st);
                const pct = Math.round((sch.booked / Math.max(sch.quota, 1)) * 100);
                return `
                  <tr>
                    <td><strong>${sch.vessel}</strong></td>
                    <td>${r ? `${r.originCity} → ${r.destinationCity}` : '-'}</td>
                    <td>${UI.formatDate(sch.date)} · ${sch.departureTime}</td>
                    <td style="min-width:160px;">
                      <div style="display:flex; justify-content:space-between; font-size:0.78rem; margin-bottom:4px;">
                        <span>${sch.booked}/${sch.quota}</span><span>${pct}%</span>
                      </div>
                      <div class="progress-track"><div class="progress-fill" style="width:${pct}%;"></div></div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderAdmins(root) {
    function draw() {
      const st = Storage.loadState();
      root.innerHTML = `
        <div class="section-header" style="margin-bottom:16px;">
          <h1 style="font-size:1.25rem; font-weight:700;">Manajemen Tim Admin (Simulasi)</h1>
          <button type="button" class="btn btn--primary btn--sm" id="btn-add-admin">+ Tambah Admin</button>
        </div>
        <div class="table-wrap">
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
            <tbody>
              ${st.admins.map(a => `
                <tr>
                  <td><strong>${a.name}</strong><div class="text-xs text-muted">Aktif: ${a.lastActive}</div></td>
                  <td>${a.email}</td>
                  <td><strong>${a.role}</strong><div class="text-xs text-muted">${(a.permissions || []).join(', ')}</div></td>
                  <td>${UI.statusBadge(a.status)}</td>
                  <td>
                    <div style="display:flex; gap:6px; flex-wrap:wrap;">
                      <button type="button" class="btn btn--outline btn--sm btn-edit-adm" data-id="${a.id}">Edit</button>
                      <button type="button" class="btn btn--outline btn--sm btn-toggle-adm" data-id="${a.id}">${a.status === 'Active' ? 'Nonaktifkan' : 'Aktifkan'}</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="modal-backdrop" id="adm-modal">
          <div class="modal">
            <div class="modal-header">
              <h2 class="modal-title" id="adm-modal-title">Tambah Admin Operasional</h2>
              <button type="button" class="btn btn--ghost btn--sm" id="adm-modal-close">Tutup</button>
            </div>
            <form id="adm-form">
              <input type="hidden" id="adm-edit-id" value="">
              <div class="modal-body" style="display:grid; gap:12px;">
                <div class="form-group">
                  <label class="form-label" for="adm-name">Nama Lengkap</label>
                  <input type="text" id="adm-name" class="form-control" required>
                </div>
                <div class="form-group">
                  <label class="form-label" for="adm-email">Email</label>
                  <input type="email" id="adm-email" class="form-control" required>
                </div>
                <div class="form-group">
                  <label class="form-label" for="adm-role">Role</label>
                  <select id="adm-role" class="form-control">
                    <option value="Ticketing Officer">Ticketing Officer</option>
                    <option value="Operations Lead">Operations Lead</option>
                    <option value="Schedule Coordinator">Schedule Coordinator</option>
                  </select>
                </div>
              </div>
              <div class="modal-footer">
                <button type="submit" class="btn btn--primary">Simpan Admin</button>
              </div>
            </form>
          </div>
        </div>
      `;

      const modal = document.getElementById('adm-modal');
      document.getElementById('btn-add-admin').addEventListener('click', () => {
        document.getElementById('adm-modal-title').textContent = 'Tambah Admin Operasional';
        document.getElementById('adm-edit-id').value = '';
        document.getElementById('adm-form').reset();
        modal.classList.add('is-open');
      });

      root.querySelectorAll('.btn-edit-adm').forEach(btn => {
        btn.addEventListener('click', () => {
          const cur = Storage.loadState();
          const adm = cur.admins.find(x => x.id === btn.getAttribute('data-id'));
          if (!adm) return;
          document.getElementById('adm-modal-title').textContent = 'Edit Admin Operasional';
          document.getElementById('adm-edit-id').value = adm.id;
          document.getElementById('adm-name').value = adm.name;
          document.getElementById('adm-email').value = adm.email;
          document.getElementById('adm-role').value = adm.role;
          modal.classList.add('is-open');
        });
      });

      document.getElementById('adm-modal-close').addEventListener('click', () => {
        modal.classList.remove('is-open');
      });
      document.getElementById('adm-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const cur = Storage.loadState();
        const editId = document.getElementById('adm-edit-id').value;
        const payload = {
          name: document.getElementById('adm-name').value.trim(),
          email: document.getElementById('adm-email').value.trim(),
          role: document.getElementById('adm-role').value
        };
        if (editId) {
          const idx = cur.admins.findIndex(x => x.id === editId);
          if (idx !== -1) cur.admins[idx] = { ...cur.admins[idx], ...payload };
          UI.showToast('Data admin berhasil diperbarui.', 'success');
        } else {
          cur.admins.push({
            id: 'adm-' + Date.now(),
            ...payload,
            permissions: ['Verify Payment', 'View Bookings'],
            status: 'Active',
            lastActive: 'Baru saja'
          });
          UI.showToast('Admin baru ditambahkan (simulasi).', 'success');
        }
        Storage.saveState(cur);
        draw();
      });

      root.querySelectorAll('.btn-toggle-adm').forEach(btn => {
        btn.addEventListener('click', () => {
          const cur = Storage.loadState();
          const adm = cur.admins.find(x => x.id === btn.getAttribute('data-id'));
          if (adm) {
            adm.status = adm.status === 'Active' ? 'Inactive' : 'Active';
            Storage.saveState(cur);
            UI.showToast('Status admin diperbarui.', 'info');
            draw();
          }
        });
      });
    }
    draw();
  }
})();
