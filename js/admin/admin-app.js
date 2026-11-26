(function () {
  const { Storage, UI } = window.SasyTix;

  document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.getAttribute('data-page') || 'dashboard';
    const titles = {
      dashboard: 'Admin Dashboard',
      bookings: 'Booking Management',
      payments: 'Payment Verification',
      schedules: 'Schedule Management',
      routes: 'Route Management',
      passengers: 'Passenger Management',
      reports: 'Operational Reports'
    };

    UI.renderDashboardShell('admin', page, titles[page] || 'Admin');

    const root = document.getElementById('admin-main-content');
    if (!root) return;

    if (page === 'dashboard') renderDashboard(root);
    if (page === 'bookings') renderBookings(root);
    if (page === 'payments') renderPayments(root);
    if (page === 'schedules') renderSchedules(root);
    if (page === 'routes') renderRoutes(root);
    if (page === 'passengers') renderPassengers(root);
    if (page === 'reports') renderReports(root);
  });

  function renderDashboard(root) {
    const state = Storage.loadState();
    const bookings = state.bookings;
    const totalBooking = bookings.length;
    const pendingPay = bookings.filter(b => b.paymentStatus === 'Pending' || b.paymentStatus === 'Payment Submitted').length;
    const verifiedPay = bookings.filter(b => b.paymentStatus === 'Verified').length;
    const rejectedPay = bookings.filter(b => b.paymentStatus === 'Rejected').length;
    const totalPax = bookings.reduce((s, b) => s + b.passengers.length, 0);
    const totalRev = bookings.filter(b => b.paymentStatus === 'Verified').reduce((s, b) => s + b.totalAmount, 0);
    const { icon } = window.SasyTix.Icons;

    const maxTrend = Math.max(...state.monthlyTrend.map(m => m.bookings), 1);
    const months = state.monthlyTrend.map(m => m.month);
    const bookingData = state.monthlyTrend.map(m => m.bookings);
    const paxData = state.monthlyTrend.map(m => Math.round(m.bookings * 1.32));

    const lineChartHtml = UI.renderLineChart({
      id: 'admin-booking-line-chart',
      labels: months,
      series: [
        { name: 'Total Booking', data: bookingData, color: '#2563eb', unit: ' booking', showArea: true },
        { name: 'Penumpang (Pax)', data: paxData, color: '#0ea5e9', unit: ' pax', dashed: true, showArea: false }
      ],
      height: 230
    });

    root.innerHTML = `
      <section class="page-hero">
        <div>
          <span class="eyebrow">Admin Operations</span>
          <h1 class="page-hero-title">Dashboard Operasional</h1>
          <p class="page-hero-sub">Ringkasan pemesanan tiket, verifikasi pembayaran, dan jadwal keberangkatan aktif.</p>
        </div>
      </section>

      <div class="kpi-grid">
        <div class="kpi-card">
          <div>
            <div class="kpi-header">
              <span class="kpi-label">Total Booking</span>
              <span class="kpi-icon-badge kpi-icon-badge--blue">${icon('ship', 19)}</span>
            </div>
            <div class="kpi-value">${totalBooking}</div>
          </div>
          <div class="kpi-meta">
            <span class="kpi-trend kpi-trend--up">${icon('trendingUp', 12)} +14.2%</span>
            <span>${totalPax} penumpang tercatat</span>
          </div>
        </div>

        <div class="kpi-card">
          <div>
            <div class="kpi-header">
              <span class="kpi-label">Pending Verification</span>
              <span class="kpi-icon-badge kpi-icon-badge--amber">${icon('clock', 19)}</span>
            </div>
            <div class="kpi-value" style="color:var(--warning);">${pendingPay}</div>
          </div>
          <div class="kpi-meta">
            <span class="kpi-trend ${pendingPay > 0 ? 'kpi-trend--down' : 'kpi-trend--neutral'}">${icon('alertCircle', 12)} ${pendingPay > 0 ? 'Perlu Review' : 'Semua Clear'}</span>
            <span>Pemeriksaan bukti transfer</span>
          </div>
        </div>

        <div class="kpi-card">
          <div>
            <div class="kpi-header">
              <span class="kpi-label">Verified / Rejected</span>
              <span class="kpi-icon-badge kpi-icon-badge--green">${icon('checkCircle', 19)}</span>
            </div>
            <div class="kpi-value">${verifiedPay} <span style="font-size:14px; font-weight:500; color:var(--t-muted);">/ ${rejectedPay}</span></div>
          </div>
          <div class="kpi-meta">
            <span class="kpi-trend kpi-trend--up">${icon('checkCircle', 12)} ${Math.round((verifiedPay / Math.max(totalBooking, 1)) * 100)}% Rate</span>
            <span>Status checkout tervalidasi</span>
          </div>
        </div>

        <div class="kpi-card">
          <div>
            <div class="kpi-header">
              <span class="kpi-label">Revenue Terverifikasi</span>
              <span class="kpi-icon-badge kpi-icon-badge--teal">${icon('creditCard', 19)}</span>
            </div>
            <div class="kpi-value" style="font-size:20px; color:var(--success);">${UI.formatIDR(totalRev)}</div>
          </div>
          <div class="kpi-meta">
            <span class="kpi-trend kpi-trend--up">${icon('trendingUp', 12)} +18.5%</span>
            <span>Akumulasi dana tiket</span>
          </div>
        </div>
      </div>

      <div class="dashboard-grid-2">
        <div class="chart-card">
          <div class="chart-header">
            <div class="chart-title-wrap">
              <h2 class="chart-title">Tren Pertumbuhan Booking &amp; Penumpang</h2>
              <span class="chart-subtitle">Statistik bulanan koridor Batam, Singapura &amp; Malaysia (H2 2026)</span>
            </div>
            <div class="chart-controls">
              <div class="chart-legend">
                <span class="legend-item"><span class="legend-dot" style="background:#2563eb;"></span> Booking</span>
                <span class="legend-item"><span class="legend-dot" style="background:#0ea5e9;"></span> Penumpang</span>
              </div>
              <div class="chart-tab-group">
                <button type="button" class="chart-tab-btn is-active" id="tab-admin-line">${icon('lineChart', 14)} Line</button>
                <button type="button" class="chart-tab-btn" id="tab-admin-bar">${icon('barChart', 14)} Bar</button>
              </div>
            </div>
          </div>
          <div class="chart-body" style="padding:0;">
            <div id="admin-chart-line-view">${lineChartHtml}</div>
            <div id="admin-chart-bar-view" style="display:none;">
              <div class="chart-bars">
                ${state.monthlyTrend.map(m => `
                  <div class="chart-bar-col">
                    <div class="chart-bar" style="height:${Math.round((m.bookings / maxTrend) * 160)}px;" title="${m.bookings} booking"></div>
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
              <span class="eyebrow">Jadwal</span>
              <h2 class="card-title">Keberangkatan Terdekat</h2>
            </div>
            <span class="badge badge--info">${state.schedules.length} Jadwal</span>
          </div>
          <div class="card-body" style="display:flex; flex-direction:column; gap:12px;">
            ${state.schedules.slice(0, 4).map(sch => {
              const r = Storage.getRouteById(sch.routeId, state);
              const pct = Math.min(100, Math.round((sch.booked / Math.max(sch.quota, 1)) * 100));
              return `
                <div style="padding:12px; border-radius:10px; background:var(--bg-hover); border:1px solid var(--border-soft);">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                    <strong style="font-size:13px; color:var(--t-base);">${r ? `${r.originCity} → ${r.destinationCity}` : sch.id}</strong>
                    <span class="badge badge--info">${sch.booked}/${sch.quota} kursi</span>
                  </div>
                  <div style="display:flex; justify-content:space-between; align-items:center; font-size:12px; color:var(--t-muted); margin-bottom:6px;">
                    <span>${icon('clock', 12)} ${sch.departureTime} WIB</span>
                    <span>${icon('ship', 12)} ${sch.vessel}</span>
                  </div>
                  <div class="progress-track">
                    <div class="progress-fill" style="width:${pct}%; background:${pct > 80 ? 'var(--warning)' : 'var(--primary)'};"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div>
            <span class="eyebrow">Transaksi</span>
            <h2 class="card-title">Booking Terbaru Masuk</h2>
          </div>
          <a href="bookings.html" class="btn btn--outline btn--sm">${icon('fileText', 14)} Kelola Semua</a>
        </div>
        <div class="table-wrap" style="border:none; border-radius:0; box-shadow:none;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Rute Pelayaran</th>
                <th>Tanggal</th>
                <th>Penumpang</th>
                <th>Total Bayar</th>
                <th>Status Bayar</th>
              </tr>
            </thead>
            <tbody>
              ${bookings.slice(0, 6).map(b => {
                const r = Storage.getRouteById(b.routeId, state);
                return `
                  <tr>
                    <td class="mono"><strong>${b.id}</strong></td>
                    <td>${r ? `${r.originCity} → ${r.destinationCity}` : '-'}</td>
                    <td>${UI.formatDate(b.travelDate)}</td>
                    <td>${b.passengers.length} pax</td>
                    <td><strong>${UI.formatIDR(b.totalAmount)}</strong></td>
                    <td>${UI.statusBadge(b.paymentStatus)}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    const tabLine = document.getElementById('tab-admin-line');
    const tabBar = document.getElementById('tab-admin-bar');
    const viewLine = document.getElementById('admin-chart-line-view');
    const viewBar = document.getElementById('admin-chart-bar-view');

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

  function renderBookings(root) {
    const state = Storage.loadState();
    const { icon } = window.SasyTix.Icons;
    let currentPage = 1;
    const pageSize = 8;

    root.innerHTML = `
      <section class="page-hero">
        <div>
          <span class="eyebrow">Transaksi</span>
          <h1 class="page-hero-title">Booking Management</h1>
          <p class="page-hero-sub">Kelola seluruh pemesanan tiket kapal, lihat manifest penumpang, dan perbarui status booking.</p>
        </div>
      </section>

      <div class="filter-bar">
        <input type="search" id="bk-search" class="input" style="max-width:260px;" placeholder="Cari Booking ID / Nama...">
        <select id="bk-route" class="select" style="max-width:240px;">
          <option value="">Semua Rute</option>
          ${state.routes.map(r => `<option value="${r.id}">${r.originCity} → ${r.destinationCity} (${r.originTerminal.split(' ')[0]})</option>`).join('')}
        </select>
        <select id="bk-status" class="select" style="max-width:190px;">
          <option value="">Semua Status</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Pending Payment">Pending Payment</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div class="card">
        <div class="table-wrap" style="border:none; border-radius:14px 14px 0 0; box-shadow:none;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Penumpang Utama</th>
                <th>Rute &amp; Tanggal</th>
                <th>Total</th>
                <th>Booking</th>
                <th>Pembayaran</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody id="bk-tbody"></tbody>
          </table>
        </div>
        <div id="bk-pagination"></div>
      </div>
    `;

    function draw() {
      const st = Storage.loadState();
      const q = document.getElementById('bk-search').value.trim().toLowerCase();
      const rId = document.getElementById('bk-route').value;
      const status = document.getElementById('bk-status').value;

      const list = st.bookings.filter(b => {
        if (rId && b.routeId !== rId) return false;
        if (status && b.bookingStatus !== status) return false;
        if (q) {
          const hay = (b.id + ' ' + b.passengers.map(p => p.fullName).join(' ')).toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      });

      const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
      if (currentPage > totalPages) currentPage = totalPages;
      const start = (currentPage - 1) * pageSize;
      const paged = list.slice(start, start + pageSize);

      document.getElementById('bk-tbody').innerHTML = paged.map(b => {
        const r = Storage.getRouteById(b.routeId, st);
        return `
          <tr>
            <td class="mono"><strong>${b.id}</strong></td>
            <td>${b.passengers[0]?.fullName || '-'} <span style="font-size:11.5px; color:var(--t-muted);">(${b.passengers.length} pax)</span></td>
            <td>${r ? `${r.originCity} → ${r.destinationCity}` : '-'}<div style="font-size:11.5px; color:var(--t-muted);">${UI.formatDate(b.travelDate)}</div></td>
            <td><strong>${UI.formatIDR(b.totalAmount)}</strong></td>
            <td>${UI.statusBadge(b.bookingStatus)}</td>
            <td>${UI.statusBadge(b.paymentStatus)}</td>
            <td>
              <div style="display:flex; gap:6px;">
                <button type="button" class="btn btn--outline btn--sm btn-view-bk" data-id="${b.id}">${icon('eye', 13)} Detail</button>
                <button type="button" class="btn btn--outline btn--sm btn-edit-bk" data-id="${b.id}">Edit</button>
              </div>
            </td>
          </tr>
        `;
      }).join('') || '<tr><td colspan="7" style="text-align:center; padding:24px; color:var(--t-muted);">Tidak ada booking yang cocok.</td></tr>';

      const pagEl = document.getElementById('bk-pagination');
      pagEl.innerHTML = UI.renderPagination(list.length, currentPage, pageSize);
      UI.bindPagination(pagEl, list.length, pageSize, (p) => {
        currentPage = p;
        draw();
      });

      document.querySelectorAll('.btn-view-bk').forEach(btn => {
        btn.addEventListener('click', () => {
          const b = st.bookings.find(x => x.id === btn.getAttribute('data-id'));
          const r = Storage.getRouteById(b.routeId, st);
          UI.openFormModal({
            title: `Detail Booking · ${b.id}`,
            submitLabel: 'Tutup',
            bodyHtml: `
              <div style="display:grid; gap:8px; font-size:13px;">
                <div><strong>Booking ID:</strong> <span class="mono">${b.id}</span></div>
                <div><strong>Rute:</strong> ${r ? `${r.originCity} (${r.originTerminal}) → ${r.destinationCity} (${r.destinationTerminal})` : '-'}</div>
                <div><strong>Tanggal Keberangkatan:</strong> ${UI.formatDate(b.travelDate)}</div>
                <div><strong>Metode Bayar:</strong> ${b.paymentMethod} (<span class="mono">${b.paymentProofRef || 'Belum ada bukti'}</span>)</div>
                <div><strong>Status:</strong> ${UI.statusBadge(b.bookingStatus)} ${UI.statusBadge(b.paymentStatus)}</div>
              </div>
              <hr style="border:none; border-top:1px solid var(--border-soft); margin:14px 0;">
              <strong style="font-size:13px;">Daftar Penumpang (${b.passengers.length} pax):</strong>
              <ul style="margin-top:8px; display:grid; gap:6px;">
                ${b.passengers.map(p => `<li style="padding:8px 10px; border-radius:8px; background:var(--bg-hover); border:1px solid var(--border-soft); font-size:12.5px;"><strong>${p.fullName}</strong> · Paspor <span class="mono">${p.passportNumber}</span> · ${p.nationality} · Kursi <strong>${p.seat || '-'}</strong></li>`).join('')}
              </ul>
            `
          });
        });
      });

      document.querySelectorAll('.btn-edit-bk').forEach(btn => {
        btn.addEventListener('click', () => {
          const cur = Storage.loadState();
          const b = cur.bookings.find(x => x.id === btn.getAttribute('data-id'));
          if (!b) return;
          UI.openFormModal({
            title: `Edit Status Booking · ${b.id}`,
            submitLabel: 'Simpan Perubahan',
            bodyHtml: `
              <div class="form-group">
                <label class="form-label" for="edit-bk-status">Status Booking</label>
                <select id="edit-bk-status" class="select">
                  <option value="Confirmed" ${b.bookingStatus === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
                  <option value="Pending Payment" ${b.bookingStatus === 'Pending Payment' ? 'selected' : ''}>Pending Payment</option>
                  <option value="Completed" ${b.bookingStatus === 'Completed' ? 'selected' : ''}>Completed</option>
                  <option value="Cancelled" ${b.bookingStatus === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label" for="edit-pay-status">Status Pembayaran</label>
                <select id="edit-pay-status" class="select">
                  <option value="Verified" ${b.paymentStatus === 'Verified' ? 'selected' : ''}>Verified</option>
                  <option value="Payment Submitted" ${b.paymentStatus === 'Payment Submitted' ? 'selected' : ''}>Payment Submitted</option>
                  <option value="Pending" ${b.paymentStatus === 'Pending' ? 'selected' : ''}>Pending</option>
                  <option value="Rejected" ${b.paymentStatus === 'Rejected' ? 'selected' : ''}>Rejected</option>
                </select>
              </div>
            `,
            onSubmit: () => {
              b.bookingStatus = document.getElementById('edit-bk-status').value;
              b.paymentStatus = document.getElementById('edit-pay-status').value;
              b.ticketIssued = b.paymentStatus === 'Verified';
              Storage.saveState(cur);
              UI.showToast(`Status booking ${b.id} berhasil diperbarui.`, 'success');
              draw();
            }
          });
        });
      });
    }

    ['bk-search', 'bk-route', 'bk-status'].forEach(id => {
      const el = document.getElementById(id);
      el.addEventListener('input', () => { currentPage = 1; draw(); });
      el.addEventListener('change', () => { currentPage = 1; draw(); });
    });
    draw();
  }

  function renderPayments(root) {
    let currentPage = 1;
    const pageSize = 8;
    let statusFilter = '';

    root.innerHTML = `
      <section class="page-hero">
        <div>
          <span class="eyebrow">Keuangan</span>
          <h1 class="page-hero-title">Payment Verification</h1>
          <p class="page-hero-sub">Periksa bukti pembayaran transfer, Virtual Account, dan QRIS sebelum menerbitkan e-tiket.</p>
        </div>
      </section>

      <div class="filter-bar">
        <input type="search" id="pay-search" class="input" style="max-width:260px;" placeholder="Cari Booking ID / Referensi...">
        <select id="pay-status-filter" class="select" style="max-width:220px;">
          <option value="">Semua Status Pembayaran</option>
          <option value="Payment Submitted">Payment Submitted</option>
          <option value="Pending">Pending</option>
          <option value="Verified">Verified</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div class="card">
        <div class="table-wrap" style="border:none; border-radius:14px 14px 0 0; box-shadow:none;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Metode &amp; Referensi</th>
                <th>Total Tagihan</th>
                <th>Status</th>
                <th>Aksi Verifikasi</th>
              </tr>
            </thead>
            <tbody id="pay-tbody"></tbody>
          </table>
        </div>
        <div id="pay-pagination"></div>
      </div>
    `;

    function draw() {
      const st = Storage.loadState();
      const q = document.getElementById('pay-search').value.trim().toLowerCase();
      statusFilter = document.getElementById('pay-status-filter').value;

      const list = st.bookings.filter(b => {
        if (statusFilter && b.paymentStatus !== statusFilter) return false;
        if (q) {
          const hay = (b.id + ' ' + (b.paymentProofRef || '') + ' ' + (b.passengers[0]?.fullName || '')).toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      });

      const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
      if (currentPage > totalPages) currentPage = totalPages;
      const paged = list.slice((currentPage - 1) * pageSize, currentPage * pageSize);

      document.getElementById('pay-tbody').innerHTML = paged.map(b => `
        <tr>
          <td class="mono"><strong>${b.id}</strong><div style="font-size:11.5px; color:var(--t-muted); font-family:Inter,sans-serif;">${b.passengers[0]?.fullName || ''}</div></td>
          <td>${b.paymentMethod}<div class="mono" style="font-size:11.5px; color:var(--t-muted);">${b.paymentProofRef || 'Menunggu bukti'}</div></td>
          <td><strong>${UI.formatIDR(b.totalAmount)}</strong></td>
          <td>${UI.statusBadge(b.paymentStatus)}${b.ticketIssued ? ' <span class="badge badge--info">Tiket Terbit</span>' : ''}</td>
          <td>
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
              <button type="button" class="btn btn--primary btn--sm btn-approve-pay" data-id="${b.id}" ${b.paymentStatus === 'Verified' ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>Setujui</button>
              <button type="button" class="btn btn--outline btn--sm btn-reject-pay" data-id="${b.id}">Tolak</button>
            </div>
          </td>
        </tr>
      `).join('') || '<tr><td colspan="5" style="text-align:center; padding:24px; color:var(--t-muted);">Tidak ada data pembayaran.</td></tr>';

      const pagEl = document.getElementById('pay-pagination');
      pagEl.innerHTML = UI.renderPagination(list.length, currentPage, pageSize);
      UI.bindPagination(pagEl, list.length, pageSize, (p) => { currentPage = p; draw(); });

      root.querySelectorAll('.btn-approve-pay').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          UI.confirmDialog({
            title: 'Konfirmasi Verifikasi Pembayaran',
            message: `Setujui pembayaran untuk booking <strong>${id}</strong> dan terbitkan e-tiket secara otomatis?`,
            confirmLabel: 'Ya, Setujui & Terbitkan',
            onConfirm: () => {
              const cur = Storage.loadState();
              const b = cur.bookings.find(x => x.id === id);
              if (b) {
                b.paymentStatus = 'Verified';
                b.bookingStatus = 'Confirmed';
                b.ticketIssued = true;
                b.ticketCode = b.ticketCode || ('BP-' + b.id);
                b.rejectionNote = '';
                Storage.saveState(cur);
                UI.showToast(`Pembayaran ${b.id} disetujui & tiket diterbitkan.`, 'success');
                draw();
              }
            }
          });
        });
      });

      root.querySelectorAll('.btn-reject-pay').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          UI.confirmDialog({
            title: `Tolak Pembayaran · ${id}`,
            message: 'Berikan alasan penolakan bukti pembayaran agar tercatat di riwayat transaksi.',
            confirmLabel: 'Tolak Pembayaran',
            type: 'danger',
            showInput: true,
            inputLabel: 'Catatan Penolakan',
            inputPlaceholder: 'Contoh: Nominal transfer tidak sesuai.',
            inputDefault: 'Nominal bukti transfer tidak sesuai.',
            onConfirm: (reason) => {
              const cur = Storage.loadState();
              const b = cur.bookings.find(x => x.id === id);
              if (b) {
                b.paymentStatus = 'Rejected';
                b.bookingStatus = 'Cancelled';
                b.ticketIssued = false;
                b.rejectionNote = reason || 'Ditolak oleh admin.';
                Storage.saveState(cur);
                UI.showToast(`Pembayaran ${b.id} ditolak.`, 'warning');
                draw();
              }
            }
          });
        });
      });
    }

    document.getElementById('pay-search').addEventListener('input', () => { currentPage = 1; draw(); });
    document.getElementById('pay-status-filter').addEventListener('change', () => { currentPage = 1; draw(); });
    draw();
  }

  function renderSchedules(root) {
    const { icon } = window.SasyTix.Icons;
    let currentPage = 1;
    const pageSize = 8;

    root.innerHTML = `
      <section class="page-hero">
        <div>
          <span class="eyebrow">Operasional</span>
          <h1 class="page-hero-title">Schedule Management</h1>
          <p class="page-hero-sub">Atur jadwal keberangkatan kapal ferry, harga tiket, dan kuota kursi per pelayaran.</p>
        </div>
        <div class="page-hero-actions">
          <button type="button" class="btn btn--primary" id="btn-add-schedule">${icon('plus', 15)} Tambah Jadwal</button>
        </div>
      </section>

      <div class="filter-bar">
        <input type="search" id="sch-search" class="input" style="max-width:260px;" placeholder="Cari ID / Kapal / Rute...">
        <select id="sch-status-filter" class="select" style="max-width:180px;">
          <option value="">Semua Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div class="card">
        <div class="table-wrap" style="border:none; border-radius:14px 14px 0 0; box-shadow:none;">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Rute</th>
                <th>Operator / Kapal</th>
                <th>Tanggal &amp; Jam</th>
                <th>Harga</th>
                <th>Kuota</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody id="sch-tbody"></tbody>
          </table>
        </div>
        <div id="sch-pagination"></div>
      </div>
    `;

    function openScheduleModal(existing) {
      const cur = Storage.loadState();
      const isEdit = Boolean(existing);
      UI.openFormModal({
        title: isEdit ? `Edit Jadwal · ${existing.id}` : 'Tambah Jadwal Kapal Baru',
        submitLabel: isEdit ? 'Simpan Perubahan' : 'Tambah Jadwal',
        bodyHtml: `
          <div class="form-group">
            <label class="form-label" for="sch-route">Rute Pelayaran</label>
            <select id="sch-route" class="select" required>
              ${cur.routes.map(r => `<option value="${r.id}" ${existing?.routeId === r.id ? 'selected' : ''}>${r.originCity} (${r.originTerminal}) → ${r.destinationCity}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label" for="sch-op">Operator</label>
            <select id="sch-op" class="select" required>
              ${cur.operators.map(o => `<option value="${o.id}" ${existing?.operatorId === o.id ? 'selected' : ''}>${o.name} (${o.vessel})</option>`).join('')}
            </select>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <div class="form-group">
              <label class="form-label" for="sch-date">Tanggal</label>
              <input type="date" id="sch-date" class="input" value="${existing ? existing.date : '2026-11-28'}" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="sch-time">Jam Berangkat</label>
              <input type="time" id="sch-time" class="input" value="${existing ? existing.departureTime : '09:00'}" required>
            </div>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <div class="form-group">
              <label class="form-label" for="sch-price">Harga (IDR)</label>
              <input type="number" id="sch-price" class="input" value="${existing ? existing.price : 440000}" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="sch-quota">Kuota Kursi</label>
              <input type="number" id="sch-quota" class="input" value="${existing ? existing.quota : 40}" required>
            </div>
          </div>
        `,
        onSubmit: () => {
          const st = Storage.loadState();
          const op = Storage.getOperatorById(document.getElementById('sch-op').value, st);
          const payload = {
            routeId: document.getElementById('sch-route').value,
            operatorId: op.id,
            vessel: op.vessel,
            date: document.getElementById('sch-date').value,
            departureTime: document.getElementById('sch-time').value,
            price: Number(document.getElementById('sch-price').value) || 440000,
            quota: Number(document.getElementById('sch-quota').value) || 40
          };
          if (isEdit) {
            const idx = st.schedules.findIndex(s => s.id === existing.id);
            if (idx !== -1) st.schedules[idx] = { ...st.schedules[idx], ...payload };
            UI.showToast(`Jadwal ${existing.id} berhasil diperbarui.`, 'success');
          } else {
            st.schedules.unshift({
              id: 'SCH-' + String(Math.floor(1100 + Math.random() * 8800)),
              ...payload,
              arrivalTime: '10:00',
              booked: 0,
              facilities: ['Air Conditioning', 'Luggage 20kg'],
              status: 'active'
            });
            UI.showToast('Jadwal baru berhasil ditambahkan.', 'success');
          }
          Storage.saveState(st);
          draw();
        }
      });
    }

    function draw() {
      const st = Storage.loadState();
      const q = document.getElementById('sch-search').value.trim().toLowerCase();
      const statusF = document.getElementById('sch-status-filter').value;

      const list = st.schedules.filter(sch => {
        if (statusF && sch.status !== statusF) return false;
        if (q) {
          const r = Storage.getRouteById(sch.routeId, st);
          const hay = `${sch.id} ${sch.vessel} ${r ? `${r.originCity} ${r.destinationCity}` : ''}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      });

      const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
      if (currentPage > totalPages) currentPage = totalPages;
      const paged = list.slice((currentPage - 1) * pageSize, currentPage * pageSize);

      document.getElementById('sch-tbody').innerHTML = paged.map(sch => {
        const r = Storage.getRouteById(sch.routeId, st);
        const op = Storage.getOperatorById(sch.operatorId, st);
        return `
          <tr>
            <td class="mono"><strong>${sch.id}</strong></td>
            <td>${r ? `${r.originCity} → ${r.destinationCity}` : '-'}</td>
            <td>${op ? op.name : ''}<div style="font-size:11.5px; color:var(--t-muted);">${sch.vessel}</div></td>
            <td>${UI.formatDate(sch.date)} · ${sch.departureTime}</td>
            <td><strong>${UI.formatIDR(sch.price)}</strong></td>
            <td>${sch.booked} / ${sch.quota}</td>
            <td>${UI.statusBadge(sch.status)}</td>
            <td>
              <div style="display:flex; gap:6px; flex-wrap:wrap;">
                <button type="button" class="btn btn--outline btn--sm btn-edit-sch" data-id="${sch.id}">Edit</button>
                <button type="button" class="btn btn--outline btn--sm btn-del-sch" data-id="${sch.id}">Hapus</button>
              </div>
            </td>
          </tr>
        `;
      }).join('') || '<tr><td colspan="8" style="text-align:center; padding:24px; color:var(--t-muted);">Tidak ada jadwal yang cocok.</td></tr>';

      const pagEl = document.getElementById('sch-pagination');
      pagEl.innerHTML = UI.renderPagination(list.length, currentPage, pageSize);
      UI.bindPagination(pagEl, list.length, pageSize, (p) => { currentPage = p; draw(); });

      root.querySelectorAll('.btn-edit-sch').forEach(btn => {
        btn.addEventListener('click', () => {
          const cur = Storage.loadState();
          const sch = cur.schedules.find(s => s.id === btn.getAttribute('data-id'));
          if (sch) openScheduleModal(sch);
        });
      });

      root.querySelectorAll('.btn-del-sch').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          UI.confirmDialog({
            title: 'Hapus Jadwal Kapal',
            message: `Yakin ingin menghapus jadwal <strong>${id}</strong>? Tindakan ini tidak dapat dibatalkan.`,
            confirmLabel: 'Ya, Hapus Jadwal',
            type: 'danger',
            onConfirm: () => {
              const cur = Storage.loadState();
              cur.schedules = cur.schedules.filter(s => s.id !== id);
              Storage.saveState(cur);
              UI.showToast(`Jadwal ${id} berhasil dihapus.`, 'info');
              draw();
            }
          });
        });
      });
    }

    document.getElementById('btn-add-schedule').addEventListener('click', () => openScheduleModal(null));
    document.getElementById('sch-search').addEventListener('input', () => { currentPage = 1; draw(); });
    document.getElementById('sch-status-filter').addEventListener('change', () => { currentPage = 1; draw(); });
    draw();
  }

  function renderRoutes(root) {
    const { icon } = window.SasyTix.Icons;
    let currentPage = 1;
    const pageSize = 8;

    root.innerHTML = `
      <section class="page-hero">
        <div>
          <span class="eyebrow">Jaringan Pelayaran</span>
          <h1 class="page-hero-title">Route &amp; Terminal Management</h1>
          <p class="page-hero-sub">Kelola koridor pelayaran internasional dan status operasional masing-masing terminal.</p>
        </div>
        <div class="page-hero-actions">
          <button type="button" class="btn btn--primary" id="btn-add-route">${icon('plus', 15)} Tambah Rute</button>
        </div>
      </section>

      <div class="filter-bar">
        <input type="search" id="rt-search" class="input" style="max-width:260px;" placeholder="Cari kota / terminal...">
        <select id="rt-status-filter" class="select" style="max-width:180px;">
          <option value="">Semua Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div class="card">
        <div class="table-wrap" style="border:none; border-radius:14px 14px 0 0; box-shadow:none;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Koridor</th>
                <th>Terminal Asal</th>
                <th>Terminal Tujuan</th>
                <th>Durasi</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody id="rt-tbody"></tbody>
          </table>
        </div>
        <div id="rt-pagination"></div>
      </div>
    `;

    function openRouteModal(existing) {
      const isEdit = Boolean(existing);
      UI.openFormModal({
        title: isEdit ? `Edit Rute · ${existing.originCity} → ${existing.destinationCity}` : 'Tambah Rute Baru',
        submitLabel: isEdit ? 'Simpan Perubahan' : 'Tambah Rute',
        bodyHtml: `
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <div class="form-group">
              <label class="form-label" for="rt-origin-city">Kota Asal</label>
              <input type="text" id="rt-origin-city" class="input" value="${existing ? existing.originCity : ''}" placeholder="Batam" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="rt-dest-city">Kota Tujuan</label>
              <input type="text" id="rt-dest-city" class="input" value="${existing ? existing.destinationCity : ''}" placeholder="Singapura" required>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label" for="rt-origin-term">Terminal Asal</label>
            <input type="text" id="rt-origin-term" class="input" value="${existing ? existing.originTerminal : ''}" placeholder="Batam Centre International Ferry Terminal" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="rt-dest-term">Terminal Tujuan</label>
            <input type="text" id="rt-dest-term" class="input" value="${existing ? existing.destinationTerminal : ''}" placeholder="HarbourFront Centre" required>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <div class="form-group">
              <label class="form-label" for="rt-dur">Estimasi Durasi (menit)</label>
              <input type="number" id="rt-dur" class="input" value="${existing ? existing.durationMinutes : 50}" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="rt-status">Status Rute</label>
              <select id="rt-status" class="select">
                <option value="active" ${existing?.status === 'active' ? 'selected' : ''}>Active</option>
                <option value="inactive" ${existing?.status === 'inactive' ? 'selected' : ''}>Inactive</option>
              </select>
            </div>
          </div>
        `,
        onSubmit: () => {
          const cur = Storage.loadState();
          const originCity = document.getElementById('rt-origin-city').value.trim();
          const destinationCity = document.getElementById('rt-dest-city').value.trim();
          const payload = {
            originCity,
            destinationCity,
            originTerminal: document.getElementById('rt-origin-term').value.trim(),
            destinationTerminal: document.getElementById('rt-dest-term').value.trim(),
            durationMinutes: Number(document.getElementById('rt-dur').value) || 50,
            status: document.getElementById('rt-status').value,
            corridor: `${originCity} - ${destinationCity}`
          };
          if (isEdit) {
            const idx = cur.routes.findIndex(x => x.id === existing.id);
            if (idx !== -1) cur.routes[idx] = { ...cur.routes[idx], ...payload };
            UI.showToast('Rute berhasil diperbarui.', 'success');
          } else {
            cur.routes.unshift({
              id: 'rt-' + Date.now(),
              originCountry: 'Indonesia',
              destinationCountry: destinationCity,
              basePrice: 450000,
              ...payload
            });
            UI.showToast('Rute baru berhasil ditambahkan.', 'success');
          }
          Storage.saveState(cur);
          draw();
        }
      });
    }

    function draw() {
      const st = Storage.loadState();
      const q = document.getElementById('rt-search').value.trim().toLowerCase();
      const statusF = document.getElementById('rt-status-filter').value;

      const list = st.routes.filter(r => {
        if (statusF && r.status !== statusF) return false;
        if (q) {
          const hay = `${r.originCity} ${r.destinationCity} ${r.originTerminal} ${r.destinationTerminal}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      });

      const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
      if (currentPage > totalPages) currentPage = totalPages;
      const paged = list.slice((currentPage - 1) * pageSize, currentPage * pageSize);

      document.getElementById('rt-tbody').innerHTML = paged.map(r => `
        <tr>
          <td><strong>${r.originCity} → ${r.destinationCity}</strong></td>
          <td>${r.originTerminal}</td>
          <td>${r.destinationTerminal}</td>
          <td>${r.durationMinutes} mnt</td>
          <td>${UI.statusBadge(r.status)}</td>
          <td>
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
              <button type="button" class="btn btn--outline btn--sm btn-edit-rt" data-id="${r.id}">Edit</button>
              <button type="button" class="btn btn--outline btn--sm btn-toggle-rt" data-id="${r.id}">${r.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}</button>
            </div>
          </td>
        </tr>
      `).join('') || '<tr><td colspan="6" style="text-align:center; padding:24px; color:var(--t-muted);">Tidak ada rute ditemukan.</td></tr>';

      const pagEl = document.getElementById('rt-pagination');
      pagEl.innerHTML = UI.renderPagination(list.length, currentPage, pageSize);
      UI.bindPagination(pagEl, list.length, pageSize, (p) => { currentPage = p; draw(); });

      root.querySelectorAll('.btn-edit-rt').forEach(btn => {
        btn.addEventListener('click', () => {
          const cur = Storage.loadState();
          const rt = cur.routes.find(x => x.id === btn.getAttribute('data-id'));
          if (rt) openRouteModal(rt);
        });
      });

      root.querySelectorAll('.btn-toggle-rt').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          const cur = Storage.loadState();
          const rt = cur.routes.find(x => x.id === id);
          if (!rt) return;
          const nextStatus = rt.status === 'active' ? 'inactive' : 'active';
          UI.confirmDialog({
            title: `${nextStatus === 'active' ? 'Aktifkan' : 'Nonaktifkan'} Rute`,
            message: `Ubah status rute <strong>${rt.originCity} → ${rt.destinationCity}</strong> menjadi <strong>${nextStatus}</strong>?`,
            confirmLabel: 'Ya, Ubah Status',
            onConfirm: () => {
              rt.status = nextStatus;
              Storage.saveState(cur);
              UI.showToast(`Status rute diubah menjadi ${rt.status}.`, 'info');
              draw();
            }
          });
        });
      });
    }

    document.getElementById('btn-add-route').addEventListener('click', () => openRouteModal(null));
    document.getElementById('rt-search').addEventListener('input', () => { currentPage = 1; draw(); });
    document.getElementById('rt-status-filter').addEventListener('change', () => { currentPage = 1; draw(); });
    draw();
  }

  function renderPassengers(root) {
    const st = Storage.loadState();
    const { icon } = window.SasyTix.Icons;
    const allRows = [];
    st.bookings.forEach(b => {
      const r = Storage.getRouteById(b.routeId, st);
      b.passengers.forEach(p => {
        allRows.push({ bookingId: b.id, route: r ? `${r.originCity} → ${r.destinationCity}` : '-', date: b.travelDate, ...p });
      });
    });

    let currentPage = 1;
    const pageSize = 8;

    root.innerHTML = `
      <section class="page-hero">
        <div>
          <span class="eyebrow">Manifest</span>
          <h1 class="page-hero-title">Passenger Management</h1>
          <p class="page-hero-sub">Daftar manifest penumpang terdaftar beserta nomor paspor, kebangsaan, dan kode booking.</p>
        </div>
      </section>

      <div class="filter-bar">
        <input type="search" id="pax-search" class="input" style="max-width:280px;" placeholder="Cari nama / paspor / Booking ID...">
        <select id="pax-nat" class="select" style="max-width:200px;">
          <option value="">Semua Kebangsaan</option>
          <option value="Indonesia">Indonesia</option>
          <option value="Singapore">Singapore</option>
          <option value="Malaysia">Malaysia</option>
        </select>
      </div>

      <div class="card">
        <div class="table-wrap" style="border:none; border-radius:14px 14px 0 0; box-shadow:none;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Nama Penumpang</th>
                <th>Nomor Paspor</th>
                <th>Kebangsaan</th>
                <th>Booking ID</th>
                <th>Rute &amp; Tanggal</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody id="pax-tbody"></tbody>
          </table>
        </div>
        <div id="pax-pagination"></div>
      </div>
    `;

    function draw() {
      const q = document.getElementById('pax-search').value.trim().toLowerCase();
      const nat = document.getElementById('pax-nat').value;

      const list = allRows.filter(p => {
        if (nat && p.nationality !== nat) return false;
        if (q) {
          const hay = `${p.fullName} ${p.passportNumber} ${p.bookingId} ${p.email}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      });

      const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
      if (currentPage > totalPages) currentPage = totalPages;
      const paged = list.slice((currentPage - 1) * pageSize, currentPage * pageSize);

      document.getElementById('pax-tbody').innerHTML = paged.map((p, idx) => `
        <tr>
          <td><strong>${p.fullName}</strong><div style="font-size:11.5px; color:var(--t-muted);">${p.email}</div></td>
          <td class="mono">${p.passportNumber}</td>
          <td>${p.nationality}</td>
          <td class="mono">${p.bookingId}</td>
          <td>${p.route}<div style="font-size:11.5px; color:var(--t-muted);">${UI.formatDate(p.date)}</div></td>
          <td><button type="button" class="btn btn--outline btn--sm btn-pax-detail" data-idx="${(currentPage - 1) * pageSize + idx}">${icon('eye', 13)} Detail</button></td>
        </tr>
      `).join('') || '<tr><td colspan="6" style="text-align:center; padding:24px; color:var(--t-muted);">Tidak ada data penumpang.</td></tr>';

      const pagEl = document.getElementById('pax-pagination');
      pagEl.innerHTML = UI.renderPagination(list.length, currentPage, pageSize);
      UI.bindPagination(pagEl, list.length, pageSize, (p) => { currentPage = p; draw(); });

      root.querySelectorAll('.btn-pax-detail').forEach(btn => {
        btn.addEventListener('click', () => {
          const p = list[parseInt(btn.getAttribute('data-idx'), 10)];
          if (!p) return;
          UI.openFormModal({
            title: `Detail Penumpang · ${p.fullName}`,
            submitLabel: 'Tutup',
            bodyHtml: `
              <div style="display:grid; gap:10px; font-size:13px;">
                <div><strong>Nama Lengkap:</strong> ${p.fullName} (${p.gender || '-'})</div>
                <div><strong>Tanggal Lahir:</strong> ${UI.formatDate(p.dob)}</div>
                <div><strong>Kebangsaan:</strong> ${p.nationality}</div>
                <div><strong>Nomor Paspor:</strong> <span class="mono">${p.passportNumber}</span> (Exp: ${UI.formatDate(p.passportExpiry)})</div>
                <div><strong>Kontak:</strong> ${p.email} · ${p.phone}</div>
                <div><strong>Booking / Kursi:</strong> <span class="mono">${p.bookingId}</span> · Kursi <strong>${p.seat || '-'}</strong></div>
                <div><strong>Rute &amp; Tanggal:</strong> ${p.route} (${UI.formatDate(p.date)})</div>
              </div>
            `
          });
        });
      });
    }

    document.getElementById('pax-search').addEventListener('input', () => { currentPage = 1; draw(); });
    document.getElementById('pax-nat').addEventListener('change', () => { currentPage = 1; draw(); });
    draw();
  }

  function renderReports(root) {
    const st = Storage.loadState();
    const { icon } = window.SasyTix.Icons;
    const verifiedRev = st.bookings.filter(b => b.paymentStatus === 'Verified').reduce((s, b) => s + b.totalAmount, 0);
    const pendingRev = st.bookings.filter(b => b.paymentStatus !== 'Verified' && b.paymentStatus !== 'Rejected').reduce((s, b) => s + b.totalAmount, 0);
    let currentPage = 1;
    const pageSize = 8;

    root.innerHTML = `
      <section class="page-hero">
        <div>
          <span class="eyebrow">Laporan</span>
          <h1 class="page-hero-title">Operational Reports</h1>
          <p class="page-hero-sub">Rekapitulasi transaksi operasional, metode pembayaran, dan ekspor laporan CSV.</p>
        </div>
        <div class="page-hero-actions">
          <button type="button" class="btn btn--primary" id="btn-export-report">${icon('download', 15)} Ekspor CSV</button>
        </div>
      </section>

      <div class="kpi-grid" style="grid-template-columns:repeat(3, minmax(0, 1fr));">
        <div class="kpi-card">
          <div class="kpi-label">Revenue Terverifikasi</div>
          <div class="kpi-value" style="color:var(--success); font-size:21px;">${UI.formatIDR(verifiedRev)}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Revenue Pending</div>
          <div class="kpi-value" style="color:var(--warning); font-size:21px;">${UI.formatIDR(pendingRev)}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Total Transaksi</div>
          <div class="kpi-value">${st.bookings.length}</div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div>
            <span class="eyebrow">Ledger</span>
            <h2 class="card-title">Daftar Transaksi Operasional</h2>
          </div>
        </div>
        <div class="table-wrap" style="border:none; border-radius:0; box-shadow:none;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Tanggal</th>
                <th>Penumpang</th>
                <th>Metode Bayar</th>
                <th>Status</th>
                <th>Nominal</th>
              </tr>
            </thead>
            <tbody id="rep-tbody"></tbody>
          </table>
        </div>
        <div id="rep-pagination"></div>
      </div>
    `;

    function draw() {
      const list = st.bookings;
      const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
      if (currentPage > totalPages) currentPage = totalPages;
      const paged = list.slice((currentPage - 1) * pageSize, currentPage * pageSize);

      document.getElementById('rep-tbody').innerHTML = paged.map(b => `
        <tr>
          <td class="mono"><strong>${b.id}</strong></td>
          <td>${UI.formatDate(b.travelDate)}</td>
          <td>${b.passengers.length} pax</td>
          <td>${b.paymentMethod}</td>
          <td>${UI.statusBadge(b.paymentStatus)}</td>
          <td><strong>${UI.formatIDR(b.totalAmount)}</strong></td>
        </tr>
      `).join('');

      const pagEl = document.getElementById('rep-pagination');
      pagEl.innerHTML = UI.renderPagination(list.length, currentPage, pageSize);
      UI.bindPagination(pagEl, list.length, pageSize, (p) => { currentPage = p; draw(); });
    }

    document.getElementById('btn-export-report').addEventListener('click', () => {
      UI.showToast('Laporan operasional CSV berhasil diekspor.', 'success');
    });
    draw();
  }
})();
