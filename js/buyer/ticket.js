(function () {
  const { Storage, UI, Icons } = window.SasyTix;

  document.addEventListener('DOMContentLoaded', () => {
    UI.renderDemoBar();
    UI.renderPublicHeader('ticket');
    UI.renderPublicFooter();

    const params = new URLSearchParams(window.location.search);
    const state = Storage.loadState();
    const bookingId = params.get('bookingId');

    const booking = bookingId
      ? state.bookings.find(b => b.id === bookingId)
      : state.bookings.find(b => b.ticketIssued) || state.bookings[0];

    const mount = document.getElementById('ticket-detail-mount');

    if (!booking) {
      mount.innerHTML = `<div class="empty-state"><h1>Belum ada tiket tersedia</h1><a href="search.html" class="btn btn--primary" style="margin-top:12px;">Cari Jadwal</a></div>`;
      return;
    }

    const route = Storage.getRouteById(booking.routeId, state);
    const sch = Storage.getScheduleById(booking.scheduleId, state);
    const op = sch ? Storage.getOperatorById(sch.operatorId, state) : null;
    const primaryPax = booking.passengers[0] || {};

    mount.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; max-width:820px; margin:0 auto 20px;">
        <div>
          <span class="eyebrow">E-Boarding Pass</span>
          <h1 style="font-size:1.5rem; font-weight:800;">Tiket Perjalanan Feri</h1>
        </div>
        <div style="display:flex; gap:10px;">
          <a href="bookings.html" class="btn btn--outline btn--sm">Kembali ke My Booking</a>
          <button type="button" class="btn btn--primary btn--sm" id="btn-print-ticket">${Icons.icon('download', 15)} Cetak / Simpan PDF</button>
        </div>
      </div>

      <article class="boarding-pass">
        <div class="boarding-pass-head">
          <div>
            <span class="text-xs" style="opacity:0.8; text-transform:uppercase; letter-spacing:0.08em;">Sasy.Tix Maritime Boarding Pass</span>
            <h2 style="font-size:1.35rem; font-weight:800; margin-top:2px;">${route ? `${route.originCity} → ${route.destinationCity}` : '-'}</h2>
          </div>
          <div style="text-align:right;">
            <div class="text-xs" style="opacity:0.8;">Booking Reference</div>
            <div class="font-mono" style="font-size:1.15rem; font-weight:800;">${booking.id}</div>
          </div>
        </div>

        <div class="boarding-pass-body">
          <div class="boarding-pass-main">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:20px;">
              <div>
                <span class="text-xs text-muted">Operator &amp; Kapal</span>
                <div style="font-weight:700;">${op ? op.name : ''} · ${sch ? sch.vessel : ''}</div>
              </div>
              ${UI.statusBadge(booking.ticketIssued ? 'Confirmed' : booking.paymentStatus)}
            </div>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(160px, 1fr)); gap:16px; margin-bottom:20px;">
              <div>
                <span class="text-xs text-muted">Penumpang Utama</span>
                <div style="font-weight:700;">${primaryPax.fullName || '-'}</div>
                <div class="text-xs text-muted font-mono">Paspor: ${primaryPax.passportNumber || '-'}</div>
              </div>
              <div>
                <span class="text-xs text-muted">Tanggal &amp; Jam Berangkat</span>
                <div style="font-weight:700;">${UI.formatDate(booking.travelDate)}</div>
                <div class="text-sm font-mono">${sch ? `${sch.departureTime} → ${sch.arrivalTime}` : '-'}</div>
              </div>
              <div>
                <span class="text-xs text-muted">Kursi / Dek</span>
                <div style="font-weight:700;">${booking.passengers.map(p => p.seat || 'Free').join(', ')}</div>
                <div class="text-xs text-muted">${booking.passengers.length} Penumpang</div>
              </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; padding:12px; background:var(--color-surface-alt); border-radius:var(--radius-md); margin-bottom:16px;">
              <div>
                <span class="text-xs text-muted">Terminal Keberangkatan</span>
                <div class="text-sm" style="font-weight:600;">${route ? route.originTerminal : '-'}</div>
              </div>
              <div>
                <span class="text-xs text-muted">Terminal Kedatangan</span>
                <div class="text-sm" style="font-weight:600;">${route ? route.destinationTerminal : '-'}</div>
              </div>
            </div>

            <div class="text-xs text-muted">
              <strong>Instruksi Check-in:</strong> Harap tiba di terminal keberangkatan minimal 60 menit sebelum waktu berlayar. Tunjukkan boarding pass ini beserta paspor asli di loket check-in operator.
            </div>
          </div>

          <div class="boarding-pass-stub">
            ${UI.generateDummyQR(booking.ticketCode || booking.id)}
            <div class="font-mono text-xs" style="font-weight:700; color:var(--color-primary);">${booking.ticketCode || ('PENDING-' + booking.id)}</div>
            <p class="text-xs text-muted">Pindai di gerbang boarding terminal (Simulasi QR)</p>
          </div>
        </div>
      </article>
    `;

    document.getElementById('btn-print-ticket')?.addEventListener('click', () => {
      window.print();
    });
  });
})();
