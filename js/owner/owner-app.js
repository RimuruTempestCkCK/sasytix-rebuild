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

    UI.renderDemoBar();
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

    root.innerHTML = `
      <div class="exec-banner">
        <div>
          <span class="text-xs" style="opacity:0.8; text-transform:uppercase; letter-spacing:0.08em;">Executive Summary · Simulasi Bisnis</span>
          <h1 style="font-size:1.5rem; font-weight:800; margin-top:4px;">Performa Koridor Batam – Singapura – Malaysia</h1>
        </div>
        <a href="analytics.html" class="btn btn--accent btn--sm">Lihat Analitik Rute</a>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-label">Gross Revenue (Simulasi)</div>
          <div class="kpi-value" style="font-size:1.35rem; color:var(--color-primary);">${UI.formatIDR(grossRev)}</div>
          <div class="kpi-meta">+13.8% MoM (Nov vs Oct)</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Total Booking &amp; Penumpang</div>
          <div class="kpi-value">${totalBookings} <span class="text-sm text-muted">(${totalPax} pax)</span></div>
          <div class="kpi-meta">Avg Ticket: ${UI.formatIDR(avgTicket)}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Payment Success Rate</div>
          <div class="kpi-value" style="color:var(--color-success);">${paySuccessRate}%</div>
          <div class="kpi-meta">${verifiedCount} dari ${totalBookings} transaksi verified</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Cancellation Rate</div>
          <div class="kpi-value" style="color:var(--color-error);">${cancelRate}%</div>
          <div class="kpi-meta">${cancelledCount} booking dibatalkan/ditolak</div>
        </div>
      </div>

      <div class="dashboard-grid-2">
        <div class="card">
          <div class="card-header"><h2 class="card-title">Tren Revenue Bulanan (Juta IDR)</h2></div>
          <div class="card-body">
            <div class="chart-bars">
              ${st.monthlyTrend.map(m => `
                <div class="chart-bar-col">
                  <div class="chart-bar chart-bar--teal" style="height:${Math.round((m.revenueM / maxRev) * 150)}px;" title="Rp${m.revenueM} Jt"></div>
                  <span class="chart-bar-label">${m.month}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header"><h2 class="card-title">Executive Business Insights</h2></div>
          <div class="card-body insight-list">
            <div class="insight-item">
              <strong class="text-sm">Koridor Batam–Singapura Mendominasi</strong>
              <p class="text-xs text-muted" style="margin-top:4px;">Pelayaran Batam Centre ↔ HarbourFront menyumbang okupansi tertinggi pada jam pagi (07:00–10:00).</p>
            </div>
            <div class="insight-item">
              <strong class="text-sm">Peluang Pertumbuhan Batam–Malaysia</strong>
              <p class="text-xs text-muted" style="margin-top:4px;">Rute Harbour Bay → Puteri Harbour menunjukkan rata-rata ukuran grup lebih besar (2+ pax per booking).</p>
            </div>
            <div class="insight-item">
              <strong class="text-sm">Preferensi Pembayaran Digital</strong>
              <p class="text-xs text-muted" style="margin-top:4px;">QRIS dan Virtual Account mendominasi metode checkout dibanding transfer manual.</p>
            </div>
          </div>
        </div>
      </div>
    `;
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
                  <td><button type="button" class="btn btn--outline btn--sm btn-toggle-adm" data-id="${a.id}">${a.status === 'Active' ? 'Nonaktifkan' : 'Aktifkan'}</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="modal-backdrop" id="adm-modal">
          <div class="modal">
            <div class="modal-header">
              <h2 class="modal-title">Tambah Admin Operasional</h2>
              <button type="button" class="btn btn--ghost btn--sm" id="adm-modal-close">Tutup</button>
            </div>
            <form id="adm-form">
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

      document.getElementById('btn-add-admin').addEventListener('click', () => {
        document.getElementById('adm-modal').classList.add('is-open');
      });
      document.getElementById('adm-modal-close').addEventListener('click', () => {
        document.getElementById('adm-modal').classList.remove('is-open');
      });
      document.getElementById('adm-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const cur = Storage.loadState();
        cur.admins.push({
          id: 'adm-' + Date.now(),
          name: document.getElementById('adm-name').value.trim(),
          email: document.getElementById('adm-email').value.trim(),
          role: document.getElementById('adm-role').value,
          permissions: ['Verify Payment', 'View Bookings'],
          status: 'Active',
          lastActive: 'Baru saja'
        });
        Storage.saveState(cur);
        UI.showToast('Admin baru ditambahkan (simulasi).', 'success');
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
