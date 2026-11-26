(function () {
  const { Storage, UI, Icons } = window.SasyTix;

  document.addEventListener('DOMContentLoaded', () => {
    UI.renderPublicHeader('search');
    UI.renderPublicFooter();

    const state = Storage.loadState();
    const params = new URLSearchParams(window.location.search);

    const originEl = document.getElementById('f-origin');
    const destEl = document.getElementById('f-destination');
    const dateEl = document.getElementById('f-date');
    const opEl = document.getElementById('f-operator');
    const paxEl = document.getElementById('f-pax');

    state.operators.forEach(op => {
      const opt = document.createElement('option');
      opt.value = op.id;
      opt.textContent = op.name;
      opEl.appendChild(opt);
    });

    originEl.value = params.get('origin') || state.searchQuery?.origin || '';
    destEl.value = params.get('destination') || state.searchQuery?.destination || '';
    dateEl.value = params.get('date') || '';
    paxEl.value = params.get('pax') || String(state.searchQuery?.paxCount || 1);

    function renderResults() {
      const st = Storage.loadState();
      const o = originEl.value;
      const d = destEl.value;
      const dt = dateEl.value;
      const opId = opEl.value;
      const pax = Number(paxEl.value) || 1;

      const filtered = st.schedules.filter(sch => {
        if (sch.status !== 'active') return false;
        const route = Storage.getRouteById(sch.routeId, st);
        if (!route) return false;
        if (o && route.originCity !== o) return false;
        if (d && route.destinationCity !== d) return false;
        if (dt && sch.date !== dt) return false;
        if (opId && sch.operatorId !== opId) return false;
        return (sch.quota - sch.booked) >= pax;
      });

      const summary = document.getElementById('results-summary');
      const list = document.getElementById('search-results-list');

      summary.textContent = `Menampilkan ${filtered.length} jadwal tersedia untuk ${pax} penumpang.`;

      if (filtered.length === 0) {
        list.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon">${Icons.icon('ship', 24)}</div>
            <h2 style="font-size:1.125rem; font-weight:700; margin-bottom:6px;">Jadwal tidak ditemukan</h2>
            <p class="text-sm text-muted" style="margin-bottom:16px;">Coba ubah tanggal atau reset filter untuk melihat semua jadwal aktif.</p>
            <button type="button" class="btn btn--outline" id="btn-clear-filters">Tampilkan Semua Jadwal</button>
          </div>
        `;
        document.getElementById('btn-clear-filters')?.addEventListener('click', () => {
          originEl.value = '';
          destEl.value = '';
          dateEl.value = '';
          opEl.value = '';
          renderResults();
        });
        return;
      }

      list.innerHTML = filtered.map(sch => {
        const route = Storage.getRouteById(sch.routeId, st);
        const op = Storage.getOperatorById(sch.operatorId, st);
        const seatsLeft = Math.max(0, sch.quota - sch.booked);
        return `
          <article class="schedule-card">
            <div class="operator-badge">
              <img src="../../${op ? op.logo : ''}" alt="${op ? op.name : ''}" class="operator-logo">
              <div>
                <strong style="display:block;">${op ? op.name : sch.vessel}</strong>
                <span class="text-xs text-muted">${sch.vessel}</span>
                <div style="display:flex; flex-wrap:wrap; gap:4px; margin-top:6px;">
                  ${(sch.facilities || []).slice(0, 3).map(f => `<span class="badge badge--neutral">${f}</span>`).join('')}
                </div>
              </div>
            </div>

            <div class="schedule-timeline">
              <div class="timeline-point">
                <strong>${sch.departureTime}</strong>
                <span>${route.originCity}</span>
                <div class="text-xs text-muted">${route.originTerminal}</div>
              </div>
              <div class="timeline-line">${route.durationMinutes} mnt · ${UI.formatDate(sch.date)}</div>
              <div class="timeline-point">
                <strong>${sch.arrivalTime}</strong>
                <span>${route.destinationCity}</span>
                <div class="text-xs text-muted">${route.destinationTerminal}</div>
              </div>
            </div>

            <div>
              <strong style="font-size:1.25rem; color:var(--color-primary); display:block;">${UI.formatIDR(sch.price)}</strong>
              <span class="text-xs text-muted">per orang · Sisa ${seatsLeft} kuota</span>
            </div>

            <div>
              <button type="button" class="btn btn--primary btn-choose" data-id="${sch.id}">Pilih Perjalanan</button>
            </div>
          </article>
        `;
      }).join('');

      list.querySelectorAll('.btn-choose').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          const cur = Storage.loadState();
          cur.draftBooking = {
            scheduleId: id,
            paxCount: Number(paxEl.value) || 1,
            tripType: params.get('tripType') || 'one_way',
            passengers: []
          };
          Storage.saveState(cur);
          window.location.href = 'passengers.html';
        });
      });
    }

    document.getElementById('filter-search-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      renderResults();
    });

    renderResults();
  });
})();
