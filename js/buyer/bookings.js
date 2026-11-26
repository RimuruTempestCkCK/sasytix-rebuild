(function () {
  const { Storage, UI, Icons } = window.SasyTix;

  document.addEventListener('DOMContentLoaded', () => {
    UI.renderDemoBar();
    UI.renderPublicHeader('bookings');
    UI.renderPublicFooter();

    let currentFilter = 'all';
    const tabs = document.querySelectorAll('#booking-filter-tabs button');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        currentFilter = tab.getAttribute('data-filter');
        tabs.forEach(t => {
          t.className = t === tab ? 'btn btn--primary btn--sm' : 'btn btn--outline btn--sm';
        });
        renderBookings();
      });
    });

    function renderBookings() {
      const state = Storage.loadState();
      const user = Storage.getCurrentUser(state);
      const listEl = document.getElementById('my-bookings-list');

      let items = state.bookings;
      if (user && user.role === 'buyer') {
        items = items.filter(b => b.userId === user.id || b.userId === 'usr-buyer-1');
      }

      if (currentFilter === 'upcoming') {
        items = items.filter(b => b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Pending Payment');
      } else if (currentFilter === 'completed') {
        items = items.filter(b => b.bookingStatus === 'Completed');
      } else if (currentFilter === 'cancelled') {
        items = items.filter(b => b.bookingStatus === 'Cancelled');
      }

      if (!items.length) {
        listEl.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon">${Icons.icon('ticket', 24)}</div>
            <h2 style="font-size:1.1rem; font-weight:700; margin-bottom:6px;">Belum ada booking pada kategori ini</h2>
            <p class="text-sm text-muted" style="margin-bottom:16px;">Cari jadwal keberangkatan feri dan buat pemesanan baru.</p>
            <a href="search.html" class="btn btn--primary">Cari Jadwal</a>
          </div>
        `;
        return;
      }

      listEl.innerHTML = items.map(b => {
        const route = Storage.getRouteById(b.routeId, state);
        const sch = Storage.getScheduleById(b.scheduleId, state);
        return `
          <article class="card">
            <div class="card-body" style="display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:16px;">
              <div>
                <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap; margin-bottom:6px;">
                  <span class="font-mono" style="font-weight:700; color:var(--color-primary);">${b.id}</span>
                  ${UI.statusBadge(b.bookingStatus)}
                  ${UI.statusBadge(b.paymentStatus)}
                </div>
                <h2 style="font-size:1.1rem; font-weight:700;">${route ? `${route.originCity} → ${route.destinationCity}` : '-'}</h2>
                <p class="text-sm text-muted">
                  ${UI.formatDate(b.travelDate)} ${sch ? `· ${sch.departureTime}` : ''} · ${b.passengers.length} Penumpang
                </p>
                ${b.rejectionNote ? `<p class="text-xs" style="color:var(--color-error); margin-top:4px;">Catatan Admin: ${b.rejectionNote}</p>` : ''}
              </div>

              <div style="text-align:right; display:flex; flex-direction:column; align-items:flex-end; gap:10px;">
                <div>
                  <span class="text-xs text-muted" style="display:block;">Total Pembayaran</span>
                  <strong style="font-size:1.125rem; color:var(--color-primary);">${UI.formatIDR(b.totalAmount)}</strong>
                </div>
                <div style="display:flex; flex-wrap:wrap; gap:8px;">
                  <a href="payment.html?bookingId=${encodeURIComponent(b.id)}" class="btn btn--outline btn--sm">Detail / Bayar</a>
                  ${b.ticketIssued ? `
                    <a href="ticket.html?bookingId=${encodeURIComponent(b.id)}" class="btn btn--secondary btn--sm">Lihat Tiket</a>
                    <button type="button" class="btn btn--primary btn--sm btn-dl-sim" data-id="${b.id}">${Icons.icon('download', 14)} Unduh Tiket</button>
                  ` : ''}
                </div>
              </div>
            </div>
          </article>
        `;
      }).join('');

      listEl.querySelectorAll('.btn-dl-sim').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          UI.showToast(`Simulasi unduh e-ticket PDF untuk ${id} berhasil.`, 'success');
        });
      });
    }

    renderBookings();
  });
})();
