(function () {
  const { Storage, UI } = window.SasyTix;

  document.addEventListener('DOMContentLoaded', () => {
    UI.renderDemoBar();
    UI.renderPublicHeader('search');
    UI.renderPublicFooter();

    const state = Storage.loadState();
    const draft = state.draftBooking;
    const mount = document.getElementById('confirm-content-mount');

    if (!draft || !draft.scheduleId || !draft.passengers?.length) {
      mount.innerHTML = `
        <div class="empty-state">
          <h1 style="font-size:1.25rem; font-weight:700; margin-bottom:8px;">Belum ada data pemesanan aktif</h1>
          <p class="text-sm text-muted" style="margin-bottom:16px;">Silakan pilih jadwal feri terlebih dahulu untuk melanjutkan konfirmasi.</p>
          <a href="search.html" class="btn btn--primary">Cari Jadwal Feri</a>
        </div>
      `;
      return;
    }

    const sch = Storage.getScheduleById(draft.scheduleId, state);
    const route = Storage.getRouteById(sch.routeId, state);
    const op = Storage.getOperatorById(sch.operatorId, state);
    const paxCount = draft.passengers.length;
    const ticketSubtotal = sch.price * paxCount;
    const portFee = 65000 * paxCount;
    const serviceFee = 15000;
    const totalAmount = ticketSubtotal + portFee + serviceFee;
    const previewRef = draft.bookingRef || ('STX-2611-' + String(Math.floor(1000 + Math.random() * 9000)));
    draft.bookingRef = previewRef;
    Storage.saveState(state);

    mount.innerHTML = `
      <div class="checkout-grid">
        <div style="display:flex; flex-direction:column; gap:20px;">
          <div class="card">
            <div class="card-header">
              <div>
                <span class="text-xs text-muted">Booking Reference</span>
                <h1 class="card-title font-mono" style="font-size:1.25rem;">${previewRef}</h1>
              </div>
              <span class="badge badge--warning">Menunggu Konfirmasi</span>
            </div>
            <div class="card-body">
              <h2 style="font-size:1rem; font-weight:700; margin-bottom:8px;">Detail Pelayaran</h2>
              <p><strong>${route.originCity} → ${route.destinationCity}</strong> (${op ? op.name : sch.vessel})</p>
              <p class="text-sm text-muted">${UI.formatDate(sch.date)} · Berangkat ${sch.departureTime} · Tiba ${sch.arrivalTime}</p>
              <p class="text-sm text-muted" style="margin-top:4px;">${route.originTerminal} → ${route.destinationTerminal}</p>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h2 class="card-title">Daftar Penumpang (${paxCount})</h2>
              <a href="passengers.html" class="btn btn--outline btn--sm">Ubah Data</a>
            </div>
            <div class="table-wrap" style="border:none; border-radius:0;">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Nama</th>
                    <th>Paspor</th>
                    <th>Kebangsaan</th>
                    <th>Kontak</th>
                  </tr>
                </thead>
                <tbody>
                  ${draft.passengers.map(p => `
                    <tr>
                      <td><strong>${p.fullName}</strong><div class="text-xs text-muted">${p.gender} · ${p.dob}</div></td>
                      <td class="font-mono">${p.passportNumber}<div class="text-xs text-muted">Exp: ${p.passportExpiry}</div></td>
                      <td>${p.nationality}</td>
                      <td class="text-sm">${p.email}<div class="text-xs text-muted">${p.phone}</div></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <aside class="summary-sticky">
          <div class="card">
            <div class="card-header"><h2 class="card-title">Ringkasan Pembayaran</h2></div>
            <div class="card-body" style="display:flex; flex-direction:column; gap:10px;">
              <div style="display:flex; justify-content:space-between;" class="text-sm">
                <span class="text-muted">Harga Tiket (${paxCount}x)</span>
                <span>${UI.formatIDR(ticketSubtotal)}</span>
              </div>
              <div style="display:flex; justify-content:space-between;" class="text-sm">
                <span class="text-muted">Seaport Tax &amp; Terminal Fee</span>
                <span>${UI.formatIDR(portFee)}</span>
              </div>
              <div style="display:flex; justify-content:space-between;" class="text-sm">
                <span class="text-muted">Biaya Layanan Platform</span>
                <span>${UI.formatIDR(serviceFee)}</span>
              </div>
              <div style="display:flex; justify-content:space-between; font-size:1.15rem; font-weight:800; padding-top:10px; border-top:1px solid var(--color-border);">
                <span>Total Tagihan</span>
                <span style="color:var(--color-primary);">${UI.formatIDR(totalAmount)}</span>
              </div>
              <button type="button" id="btn-proceed-payment" class="btn btn--primary btn--lg btn--block" style="margin-top:12px;">
                Lanjut ke Pembayaran
              </button>
            </div>
          </div>
        </aside>
      </div>
    `;

    document.getElementById('btn-proceed-payment')?.addEventListener('click', () => {
      const st = Storage.loadState();
      const user = Storage.getCurrentUser(st);
      const newBooking = {
        id: previewRef,
        userId: user ? user.id : 'usr-buyer-1',
        scheduleId: sch.id,
        routeId: route.id,
        tripType: draft.tripType || 'one_way',
        travelDate: sch.date,
        passengers: draft.passengers,
        ticketSubtotal,
        portFee,
        serviceFee,
        totalAmount,
        bookingStatus: 'Pending Payment',
        paymentStatus: 'Pending',
        paymentMethod: 'QRIS',
        paymentProofRef: '',
        rejectionNote: '',
        ticketIssued: false,
        ticketCode: '',
        createdAt: new Date().toISOString()
      };
      st.bookings.unshift(newBooking);
      const targetSch = st.schedules.find(s => s.id === sch.id);
      if (targetSch) targetSch.booked += paxCount;
      st.draftBooking = null;
      Storage.saveState(st);
      window.location.href = `payment.html?bookingId=${encodeURIComponent(newBooking.id)}`;
    });
  });
})();
