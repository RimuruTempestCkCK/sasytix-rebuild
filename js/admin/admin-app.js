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
    // Passenger estimation based on 1.32 ratio
    const paxData = state.monthlyTrend.map(m => Math.round(m.bookings * 1.32));

    const lineChartHtml = UI.renderLineChart({
      id: 'admin-booking-line-chart',
      labels: months,
      series: [
        { name: 'Total Booking', data: bookingData, color: '#1D4ED8', unit: ' booking', showArea: true },
        { name: 'Penumpang (Pax)', data: paxData, color: '#0EA5E9', unit: ' pax', dashed: true, showArea: false }
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
        <div class="page-hero-actions">
          <a href="payments.html" class="btn btn--outline">${icon('creditCard', 14)} Verifikasi Pembayaran</a>
          <a href="bookings.html" class="btn btn--primary">${icon('fileText', 14)} Kelola Booking</a>
        </div>
      </section>

      <div class="kpi-grid">
        <div class="kpi-card">
          <div>
            <div class="kpi-header">
              <span class="kpi-label">Total Booking</span>
              <span class="kpi-icon-badge kpi-icon-badge--blue">${icon('ship', 20)}</span>
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
              <span class="kpi-icon-badge kpi-icon-badge--amber">${icon('clock', 20)}</span>
            </div>
            <div class="kpi-value" style="color:var(--color-warning);">${pendingPay}</div>
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
              <span class="kpi-icon-badge kpi-icon-badge--green">${icon('checkCircle', 20)}</span>
            </div>
            <div class="kpi-value">${verifiedPay} <span class="text-sm text-muted" style="font-weight:500;">/ ${rejectedPay}</span></div>
          </div>
          <div class="kpi-meta">
            <span class="kpi-trend kpi-trend--up">${icon('checkCircle', 12)} 85% Rate</span>
            <span>Status checkout tervalidasi</span>
          </div>
        </div>

        <div class="kpi-card">
          <div>
            <div class="kpi-header">
              <span class="kpi-label">Revenue Terverifikasi</span>
              <span class="kpi-icon-badge kpi-icon-badge--teal">${icon('creditCard', 20)}</span>
            </div>
            <div class="kpi-value" style="font-size:1.35rem; color:var(--color-secondary);">${UI.formatIDR(totalRev)}</div>
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
                <span class="legend-item"><span class="legend-dot" style="background:#1D4ED8;"></span> Booking</span>
                <span class="legend-item"><span class="legend-dot" style="background:#0EA5E9;"></span> Penumpang</span>
              </div>
              <div class="chart-tab-group">
                <button type="button" class="chart-tab-btn is-active" id="tab-admin-line">${icon('lineChart', 14)} Line</button>
                <button type="button" class="chart-tab-btn" id="tab-admin-bar">${icon('barChart', 14)} Bar</button>
              </div>
            </div>
          </div>
          <div class="chart-body" style="padding:0;">
            <div id="admin-chart-line-view">
              ${lineChartHtml}
            </div>
            <div id="admin-chart-bar-view" style="display:none;">
              <div class="chart-bars">
                ${state.monthlyTrend.map(m => `
                  <div class="chart-bar-col">
                    <div class="chart-bar chart-bar--teal" style="height:${Math.round((m.bookings / maxTrend) * 160)}px;" title="${m.bookings} booking"></div>
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
              <h2 class="card-title">Status Keberangkatan Terdekat</h2>
            </div>
            <span class="badge badge--info">${state.schedules.length} Total</span>
          </div>
          <div class="card-body" style="display:flex; flex-direction:column; gap:12px; padding:var(--space-5) var(--space-6);">
            ${state.schedules.slice(0, 4).map(sch => {
              const r = Storage.getRouteById(sch.routeId, state);
              const pct = Math.round((sch.booked / sch.quota) * 100);
              return `
                <div style="padding-bottom:12px; border-bottom:1px solid var(--color-border);">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                    <strong class="text-sm" style="color:var(--color-primary);">${r ? `${r.originCity} → ${r.destinationCity}` : sch.id}</strong>
                    <span class="badge badge--${pct > 80 ? 'warning' : 'primary'}" style="font-size:0.75rem;">${sch.booked}/${sch.quota} kursi</span>
                  </div>
                  <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.75rem; color:var(--color-text-secondary); margin-bottom:6px;">
                    <span>${icon('clock', 12)} ${sch.departureTime} WIB</span>
                    <span>${icon('ship', 12)} ${sch.vessel}</span>
                  </div>
                  <div class="progress-track" style="height:6px;">
                    <div class="progress-fill" style="width:${pct}%; background:${pct > 80 ? 'var(--color-warning)' : 'var(--color-secondary)'};"></div>
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
        <div class="table-wrap" style="border:none; border-radius:0;">
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
              ${bookings.slice(0, 5).map(b => {
                const r = Storage.getRouteById(b.routeId, state);
                return `
                  <tr>
                    <td class="font-mono"><strong>${b.id}</strong></td>
                    <td>${r ? `${r.originCity} → ${r.destinationCity}` : '-'}</td>
                    <td>${UI.formatDate(b.travelDate)}</td>
                    <td>${b.passengers.length} pax</td>
                    <td>${UI.formatIDR(b.totalAmount)}</td>
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

  function renderBookings(root) {
    const state = Storage.loadState();
    root.innerHTML = `
      <div class="filter-bar">
        <input type="search" id="bk-search" class="form-control" style="max-width:260px;" placeholder="Cari Booking ID / Nama...">
        <select id="bk-route" class="form-control" style="max-width:220px;">
          <option value="">Semua Rute</option>
          ${state.routes.map(r => `<option value="${r.id}">${r.originCity} → ${r.destinationCity} (${r.originTerminal.split(' ')[0]})</option>`).join('')}
        </select>
        <select id="bk-status" class="form-control" style="max-width:190px;">
          <option value="">Semua Status</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Pending Payment">Pending Payment</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>
      <div class="table-wrap">
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
      <div class="modal-backdrop" id="bk-detail-modal">
        <div class="modal">
          <div class="modal-header">
            <h2 class="modal-title">Detail Booking</h2>
            <button type="button" class="btn btn--ghost btn--sm" id="bk-modal-close">Tutup</button>
          </div>
          <div class="modal-body" id="bk-modal-body"></div>
        </div>
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

      document.getElementById('bk-tbody').innerHTML = list.map(b => {
        const r = Storage.getRouteById(b.routeId, st);
        return `
          <tr>
            <td class="font-mono"><strong>${b.id}</strong></td>
            <td>${b.passengers[0]?.fullName || '-'} <span class="text-xs text-muted">(${b.passengers.length} pax)</span></td>
            <td>${r ? `${r.originCity} → ${r.destinationCity}` : '-'}<div class="text-xs text-muted">${UI.formatDate(b.travelDate)}</div></td>
            <td>${UI.formatIDR(b.totalAmount)}</td>
            <td>${UI.statusBadge(b.bookingStatus)}</td>
            <td>${UI.statusBadge(b.paymentStatus)}</td>
            <td><button type="button" class="btn btn--outline btn--sm btn-view-bk" data-id="${b.id}">Detail</button></td>
          </tr>
        `;
      }).join('') || '<tr><td colspan="7" class="text-muted">Tidak ada booking yang cocok.</td></tr>';

      document.querySelectorAll('.btn-view-bk').forEach(btn => {
        btn.addEventListener('click', () => {
          const b = st.bookings.find(x => x.id === btn.getAttribute('data-id'));
          const r = Storage.getRouteById(b.routeId, st);
          document.getElementById('bk-modal-body').innerHTML = `
            <p><strong>Booking ID:</strong> <span class="font-mono">${b.id}</span></p>
            <p><strong>Rute:</strong> ${r ? `${r.originCity} (${r.originTerminal}) → ${r.destinationCity} (${r.destinationTerminal})` : '-'}</p>
            <p><strong>Metode Bayar:</strong> ${b.paymentMethod} (${b.paymentProofRef || 'Belum ada bukti'})</p>
            <hr style="border:none; border-top:1px solid var(--color-border); margin-block:12px;">
            <strong>Penumpang:</strong>
            <ul style="margin-top:6px; display:grid; gap:6px;">
              ${b.passengers.map(p => `<li class="text-sm">${p.fullName} · Paspor <span class="font-mono">${p.passportNumber}</span> · ${p.nationality}</li>`).join('')}
            </ul>
          `;
          document.getElementById('bk-detail-modal').classList.add('is-open');
        });
      });
    }

    ['bk-search', 'bk-route', 'bk-status'].forEach(id => {
      document.getElementById(id).addEventListener('input', draw);
      document.getElementById(id).addEventListener('change', draw);
    });
    document.getElementById('bk-modal-close').addEventListener('click', () => {
      document.getElementById('bk-detail-modal').classList.remove('is-open');
    });
    draw();
  }

  function renderPayments(root) {
    function draw() {
      const st = Storage.loadState();
      root.innerHTML = `
        <div class="table-wrap">
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
            <tbody>
              ${st.bookings.map(b => `
                <tr>
                  <td class="font-mono"><strong>${b.id}</strong><div class="text-xs text-muted">${b.passengers[0]?.fullName || ''}</div></td>
                  <td>${b.paymentMethod}<div class="text-xs font-mono text-muted">${b.paymentProofRef || 'Menunggu bukti'}</div></td>
                  <td><strong>${UI.formatIDR(b.totalAmount)}</strong></td>
                  <td>${UI.statusBadge(b.paymentStatus)}${b.ticketIssued ? ' <span class="badge badge--primary">Tiket Terbit</span>' : ''}</td>
                  <td>
                    <div style="display:flex; gap:6px; flex-wrap:wrap;">
                      <button type="button" class="btn btn--secondary btn--sm btn-approve-pay" data-id="${b.id}">Setujui</button>
                      <button type="button" class="btn btn--outline btn--sm btn-reject-pay" data-id="${b.id}">Tolak</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;

      root.querySelectorAll('.btn-approve-pay').forEach(btn => {
        btn.addEventListener('click', () => {
          const cur = Storage.loadState();
          const b = cur.bookings.find(x => x.id === btn.getAttribute('data-id'));
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
        });
      });

      root.querySelectorAll('.btn-reject-pay').forEach(btn => {
        btn.addEventListener('click', () => {
          const reason = window.prompt('Masukkan catatan penolakan pembayaran:', 'Nominal bukti transfer tidak sesuai.');
          if (reason === null) return;
          const cur = Storage.loadState();
          const b = cur.bookings.find(x => x.id === btn.getAttribute('data-id'));
          if (b) {
            b.paymentStatus = 'Rejected';
            b.bookingStatus = 'Cancelled';
            b.ticketIssued = false;
            b.rejectionNote = reason;
            Storage.saveState(cur);
            UI.showToast(`Pembayaran ${b.id} ditolak.`, 'warning');
            draw();
          }
        });
      });
    }
    draw();
  }

  function renderSchedules(root) {
    function draw() {
      const st = Storage.loadState();
      root.innerHTML = `
        <div class="section-header" style="margin-bottom:16px;">
          <h1 style="font-size:1.25rem; font-weight:700;">Daftar Jadwal Kapal</h1>
          <button type="button" class="btn btn--primary btn--sm" id="btn-add-schedule">+ Tambah Jadwal</button>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Rute</th>
                <th>Operator / Kapal</th>
                <th>Tanggal &amp; Jam</th>
                <th>Harga</th>
                <th>Kuota</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              ${st.schedules.map(sch => {
                const r = Storage.getRouteById(sch.routeId, st);
                const op = Storage.getOperatorById(sch.operatorId, st);
                return `
                  <tr>
                    <td class="font-mono">${sch.id}</td>
                    <td>${r ? `${r.originCity} → ${r.destinationCity}` : '-'}</td>
                    <td>${op ? op.name : ''}<div class="text-xs text-muted">${sch.vessel}</div></td>
                    <td>${UI.formatDate(sch.date)} · ${sch.departureTime}</td>
                    <td>${UI.formatIDR(sch.price)}</td>
                    <td>${sch.booked} / ${sch.quota}</td>
                    <td>
                      <div style="display:flex; gap:6px; flex-wrap:wrap;">
                        <button type="button" class="btn btn--outline btn--sm btn-edit-sch" data-id="${sch.id}">Edit</button>
                        <button type="button" class="btn btn--outline btn--sm btn-del-sch" data-id="${sch.id}">Hapus</button>
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>

        <div class="modal-backdrop" id="sch-modal">
          <div class="modal">
            <div class="modal-header">
              <h2 class="modal-title" id="sch-modal-title">Tambah Jadwal Baru</h2>
              <button type="button" class="btn btn--ghost btn--sm" id="sch-modal-close">Tutup</button>
            </div>
            <form id="sch-form">
              <input type="hidden" id="sch-edit-id" value="">
              <div class="modal-body" style="display:grid; gap:12px;">
                <div class="form-group">
                  <label class="form-label" for="sch-route">Rute</label>
                  <select id="sch-route" class="form-control" required>
                    ${st.routes.map(r => `<option value="${r.id}">${r.originCity} (${r.originTerminal}) → ${r.destinationCity}</option>`).join('')}
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label" for="sch-op">Operator</label>
                  <select id="sch-op" class="form-control" required>
                    ${st.operators.map(o => `<option value="${o.id}">${o.name}</option>`).join('')}
                  </select>
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                  <div class="form-group">
                    <label class="form-label" for="sch-date">Tanggal</label>
                    <input type="date" id="sch-date" class="form-control" value="2026-11-28" required>
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="sch-time">Jam Berangkat</label>
                    <input type="time" id="sch-time" class="form-control" value="09:00" required>
                  </div>
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                  <div class="form-group">
                    <label class="form-label" for="sch-price">Harga (IDR)</label>
                    <input type="number" id="sch-price" class="form-control" value="440000" required>
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="sch-quota">Kuota Kursi</label>
                    <input type="number" id="sch-quota" class="form-control" value="40" required>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="submit" class="btn btn--primary">Simpan Jadwal</button>
              </div>
            </form>
          </div>
        </div>
      `;

      const modal = document.getElementById('sch-modal');
      document.getElementById('btn-add-schedule').addEventListener('click', () => {
        document.getElementById('sch-modal-title').textContent = 'Tambah Jadwal Baru';
        document.getElementById('sch-edit-id').value = '';
        modal.classList.add('is-open');
      });

      root.querySelectorAll('.btn-edit-sch').forEach(btn => {
        btn.addEventListener('click', () => {
          const cur = Storage.loadState();
          const sch = cur.schedules.find(s => s.id === btn.getAttribute('data-id'));
          if (!sch) return;
          document.getElementById('sch-modal-title').textContent = `Edit Jadwal ${sch.id}`;
          document.getElementById('sch-edit-id').value = sch.id;
          document.getElementById('sch-route').value = sch.routeId;
          document.getElementById('sch-op').value = sch.operatorId;
          document.getElementById('sch-date').value = sch.date;
          document.getElementById('sch-time').value = sch.departureTime;
          document.getElementById('sch-price').value = sch.price;
          document.getElementById('sch-quota').value = sch.quota;
          modal.classList.add('is-open');
        });
      });

      document.getElementById('sch-modal-close').addEventListener('click', () => {
        modal.classList.remove('is-open');
      });

      document.getElementById('sch-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const cur = Storage.loadState();
        const editId = document.getElementById('sch-edit-id').value;
        const op = Storage.getOperatorById(document.getElementById('sch-op').value, cur);
        const payload = {
          routeId: document.getElementById('sch-route').value,
          operatorId: op.id,
          vessel: op.vessel,
          date: document.getElementById('sch-date').value,
          departureTime: document.getElementById('sch-time').value,
          price: Number(document.getElementById('sch-price').value) || 440000,
          quota: Number(document.getElementById('sch-quota').value) || 40
        };

        if (editId) {
          const idx = cur.schedules.findIndex(s => s.id === editId);
          if (idx !== -1) cur.schedules[idx] = { ...cur.schedules[idx], ...payload };
          UI.showToast(`Jadwal ${editId} berhasil diperbarui.`, 'success');
        } else {
          cur.schedules.unshift({
            id: 'SCH-' + String(Math.floor(1100 + Math.random() * 8800)),
            ...payload,
            arrivalTime: '10:00',
            booked: 0,
            facilities: ['Air Conditioning', 'Luggage 20kg'],
            status: 'active'
          });
          UI.showToast('Jadwal baru berhasil ditambahkan.', 'success');
        }
        Storage.saveState(cur);
        draw();
      });

      root.querySelectorAll('.btn-del-sch').forEach(btn => {
        btn.addEventListener('click', () => {
          const cur = Storage.loadState();
          cur.schedules = cur.schedules.filter(s => s.id !== btn.getAttribute('data-id'));
          Storage.saveState(cur);
          UI.showToast('Jadwal dihapus.', 'info');
          draw();
        });
      });
    }
    draw();
  }

  function renderRoutes(root) {
    function draw() {
      const st = Storage.loadState();
      root.innerHTML = `
        <div class="section-header" style="margin-bottom:16px;">
          <h1 style="font-size:1.25rem; font-weight:700;">Manajemen Rute &amp; Terminal</h1>
          <button type="button" class="btn btn--primary btn--sm" id="btn-add-route">+ Tambah Rute</button>
        </div>
        <div class="table-wrap">
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
            <tbody>
              ${st.routes.map(r => `
                <tr>
                  <td><strong>${r.originCity} → ${r.destinationCity}</strong></td>
                  <td class="text-sm">${r.originTerminal}</td>
                  <td class="text-sm">${r.destinationTerminal}</td>
                  <td>${r.durationMinutes} mnt</td>
                  <td>${UI.statusBadge(r.status)}</td>
                  <td>
                    <div style="display:flex; gap:6px; flex-wrap:wrap;">
                      <button type="button" class="btn btn--outline btn--sm btn-edit-rt" data-id="${r.id}">Edit</button>
                      <button type="button" class="btn btn--outline btn--sm btn-toggle-rt" data-id="${r.id}">${r.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="modal-backdrop" id="rt-modal">
          <div class="modal">
            <div class="modal-header">
              <h2 class="modal-title" id="rt-modal-title">Tambah Rute Baru</h2>
              <button type="button" class="btn btn--ghost btn--sm" id="rt-modal-close">Tutup</button>
            </div>
            <form id="rt-form">
              <input type="hidden" id="rt-edit-id" value="">
              <div class="modal-body" style="display:grid; gap:12px;">
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                  <div class="form-group">
                    <label class="form-label" for="rt-origin-city">Kota Asal</label>
                    <input type="text" id="rt-origin-city" class="form-control" placeholder="Batam" required>
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="rt-dest-city">Kota Tujuan</label>
                    <input type="text" id="rt-dest-city" class="form-control" placeholder="Singapura" required>
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label" for="rt-origin-term">Terminal Asal</label>
                  <input type="text" id="rt-origin-term" class="form-control" required>
                </div>
                <div class="form-group">
                  <label class="form-label" for="rt-dest-term">Terminal Tujuan</label>
                  <input type="text" id="rt-dest-term" class="form-control" required>
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                  <div class="form-group">
                    <label class="form-label" for="rt-dur">Estimasi Durasi (menit)</label>
                    <input type="number" id="rt-dur" class="form-control" value="50" required>
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="rt-status">Status Rute</label>
                    <select id="rt-status" class="form-control">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="submit" class="btn btn--primary">Simpan Rute</button>
              </div>
            </form>
          </div>
        </div>
      `;

      const modal = document.getElementById('rt-modal');
      document.getElementById('btn-add-route').addEventListener('click', () => {
        document.getElementById('rt-modal-title').textContent = 'Tambah Rute Baru';
        document.getElementById('rt-edit-id').value = '';
        document.getElementById('rt-form').reset();
        modal.classList.add('is-open');
      });

      root.querySelectorAll('.btn-edit-rt').forEach(btn => {
        btn.addEventListener('click', () => {
          const cur = Storage.loadState();
          const rt = cur.routes.find(x => x.id === btn.getAttribute('data-id'));
          if (!rt) return;
          document.getElementById('rt-modal-title').textContent = 'Edit Rute';
          document.getElementById('rt-edit-id').value = rt.id;
          document.getElementById('rt-origin-city').value = rt.originCity;
          document.getElementById('rt-dest-city').value = rt.destinationCity;
          document.getElementById('rt-origin-term').value = rt.originTerminal;
          document.getElementById('rt-dest-term').value = rt.destinationTerminal;
          document.getElementById('rt-dur').value = rt.durationMinutes;
          document.getElementById('rt-status').value = rt.status;
          modal.classList.add('is-open');
        });
      });

      document.getElementById('rt-modal-close').addEventListener('click', () => {
        modal.classList.remove('is-open');
      });

      document.getElementById('rt-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const cur = Storage.loadState();
        const editId = document.getElementById('rt-edit-id').value;
        const payload = {
          originCity: document.getElementById('rt-origin-city').value.trim(),
          destinationCity: document.getElementById('rt-dest-city').value.trim(),
          originTerminal: document.getElementById('rt-origin-term').value.trim(),
          destinationTerminal: document.getElementById('rt-dest-term').value.trim(),
          durationMinutes: Number(document.getElementById('rt-dur').value) || 50,
          status: document.getElementById('rt-status').value
        };
        if (editId) {
          const idx = cur.routes.findIndex(x => x.id === editId);
          if (idx !== -1) cur.routes[idx] = { ...cur.routes[idx], ...payload };
          UI.showToast('Rute berhasil diperbarui.', 'success');
        } else {
          cur.routes.push({
            id: 'rt-' + Date.now(),
            ...payload,
            originCountry: payload.originCity,
            destinationCountry: payload.destinationCity,
            basePrice: 450000,
            corridor: `${payload.originCity} - ${payload.destinationCity}`
          });
          UI.showToast('Rute baru berhasil ditambahkan.', 'success');
        }
        Storage.saveState(cur);
        draw();
      });

      root.querySelectorAll('.btn-toggle-rt').forEach(btn => {
        btn.addEventListener('click', () => {
          const cur = Storage.loadState();
          const rt = cur.routes.find(x => x.id === btn.getAttribute('data-id'));
          if (rt) {
            rt.status = rt.status === 'active' ? 'inactive' : 'active';
            Storage.saveState(cur);
            UI.showToast(`Status rute diperbarui.`, 'info');
            draw();
          }
        });
      });
    }
    draw();
  }

  function renderPassengers(root) {
    const st = Storage.loadState();
    const rows = [];
    st.bookings.forEach(b => {
      const r = Storage.getRouteById(b.routeId, st);
      b.passengers.forEach(p => {
        rows.push({ bookingId: b.id, route: r ? `${r.originCity} → ${r.destinationCity}` : '-', date: b.travelDate, ...p });
      });
    });

    root.innerHTML = `
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Nama Penumpang</th>
              <th>Nomor Paspor</th>
              <th>Kebangsaan</th>
              <th>Booking ID</th>
              <th>Rute &amp; Tanggal</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map(p => `
              <tr>
                <td><strong>${p.fullName}</strong><div class="text-xs text-muted">${p.email}</div></td>
                <td class="font-mono">${p.passportNumber}</td>
                <td>${p.nationality}</td>
                <td class="font-mono">${p.bookingId}</td>
                <td>${p.route}<div class="text-xs text-muted">${UI.formatDate(p.date)}</div></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderReports(root) {
    const st = Storage.loadState();
    const verifiedRev = st.bookings.filter(b => b.paymentStatus === 'Verified').reduce((s, b) => s + b.totalAmount, 0);
    const pendingRev = st.bookings.filter(b => b.paymentStatus !== 'Verified' && b.paymentStatus !== 'Rejected').reduce((s, b) => s + b.totalAmount, 0);

    root.innerHTML = `
      <div class="section-header" style="margin-bottom:16px;">
        <h1 style="font-size:1.25rem; font-weight:700;">Laporan Operasional</h1>
        <button type="button" class="btn btn--primary btn--sm" id="btn-export-report">Ekspor CSV (Simulasi)</button>
      </div>
      <div class="kpi-grid" style="grid-template-columns:repeat(3, 1fr);">
        <div class="kpi-card">
          <div class="kpi-label">Revenue Terverifikasi</div>
          <div class="kpi-value" style="font-size:1.35rem;">${UI.formatIDR(verifiedRev)}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Revenue Pending</div>
          <div class="kpi-value" style="font-size:1.35rem; color:var(--color-warning);">${UI.formatIDR(pendingRev)}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Total Transaksi</div>
          <div class="kpi-value">${st.bookings.length}</div>
        </div>
      </div>
      <div class="table-wrap">
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
          <tbody>
            ${st.bookings.map(b => `
              <tr>
                <td class="font-mono">${b.id}</td>
                <td>${UI.formatDate(b.travelDate)}</td>
                <td>${b.passengers.length} pax</td>
                <td>${b.paymentMethod}</td>
                <td>${UI.statusBadge(b.paymentStatus)}</td>
                <td><strong>${UI.formatIDR(b.totalAmount)}</strong></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    document.getElementById('btn-export-report').addEventListener('click', () => {
      UI.showToast('Laporan operasional CSV simulasi berhasil diunduh.', 'success');
    });
  }
})();
