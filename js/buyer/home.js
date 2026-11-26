(function () {
  const { Storage, UI, Icons } = window.SasyTix;

  document.addEventListener('DOMContentLoaded', () => {
    UI.renderDemoBar();
    UI.renderPublicHeader('home');
    UI.renderPublicFooter();

    const state = Storage.loadState();
    initSearchWidget(state);
    renderFeaturedRoutes(state);
    renderFeaturedSchedules(state);
    initFaq();
  });

  function initSearchWidget(state) {
    const tripBtns = document.querySelectorAll('.trip-toggle-btn');
    const returnGroup = document.getElementById('return-date-group');
    const originEl = document.getElementById('search-origin');
    const destEl = document.getElementById('search-destination');
    const dateEl = document.getElementById('search-date');
    const returnEl = document.getElementById('search-return-date');
    const paxEl = document.getElementById('search-pax');
    const form = document.getElementById('home-search-form');

    let tripType = state.searchQuery?.tripType || 'one_way';

    function syncReturnVisibility() {
      if (returnGroup) {
        returnGroup.style.display = tripType === 'round_trip' ? 'flex' : 'none';
      }
      tripBtns.forEach(b => {
        b.classList.toggle('is-active', b.getAttribute('data-trip') === tripType);
      });
    }

    tripBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tripType = btn.getAttribute('data-trip');
        syncReturnVisibility();
      });
    });

    if (originEl && destEl) {
      originEl.addEventListener('change', () => {
        if (originEl.value === 'Batam' && destEl.value === 'Batam') {
          destEl.value = 'Singapura';
        } else if (originEl.value !== 'Batam') {
          destEl.value = 'Batam';
        }
      });
    }

    syncReturnVisibility();

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (originEl.value === destEl.value) {
          UI.showToast('Pelabuhan asal dan tujuan tidak boleh sama.', 'warning');
          return;
        }
        const query = {
          origin: originEl.value,
          destination: destEl.value,
          departureDate: dateEl.value,
          returnDate: returnEl.value,
          paxCount: Number(paxEl.value) || 1,
          tripType
        };
        const st = Storage.loadState();
        st.searchQuery = query;
        Storage.saveState(st);

        const params = new URLSearchParams({
          origin: query.origin,
          destination: query.destination,
          date: query.departureDate,
          pax: String(query.paxCount),
          tripType: query.tripType
        });
        window.location.href = `pages/buyer/search.html?${params.toString()}`;
      });
    }
  }

  function renderFeaturedRoutes(state) {
    const container = document.getElementById('home-routes-grid');
    if (!container) return;

    const corridors = [
      { origin: 'Batam', dest: 'Singapura', duration: '45–50 mnt', price: 425000, desc: 'Batam Centre / Nongsapura → HarbourFront / Tanah Merah' },
      { origin: 'Singapura', dest: 'Batam', duration: '45–50 mnt', price: 450000, desc: 'HarbourFront / Tanah Merah → Batam Centre / Nongsapura' },
      { origin: 'Batam', dest: 'Malaysia', duration: '90–105 mnt', price: 480000, desc: 'Harbour Bay / Batam Centre → Puteri Harbour / Stulang Laut' },
      { origin: 'Malaysia', dest: 'Batam', duration: '90–105 mnt', price: 495000, desc: 'Puteri Harbour / Stulang Laut → Harbour Bay / Batam Centre' }
    ];

    container.innerHTML = corridors.map(c => `
      <article class="route-card">
        <div style="display:flex; align-items:center; justify-content:space-between;">
          <span class="badge badge--primary">${c.duration}</span>
          ${Icons.icon('ship', 18)}
        </div>
        <h3 style="font-size:1.125rem; font-weight:700;">${c.origin} → ${c.dest}</h3>
        <p class="text-sm text-muted">${c.desc}</p>
        <div style="margin-top:auto; padding-top:12px; border-top:1px solid var(--color-border); display:flex; align-items:center; justify-content:space-between;">
          <div>
            <span class="text-xs text-muted" style="display:block;">Mulai dari</span>
            <strong>${UI.formatIDR(c.price)}</strong>
          </div>
          <a href="pages/buyer/search.html?origin=${encodeURIComponent(c.origin)}&destination=${encodeURIComponent(c.dest)}" class="btn btn--outline btn--sm">Cari</a>
        </div>
      </article>
    `).join('');
  }

  function renderFeaturedSchedules(state) {
    const container = document.getElementById('home-schedules-list');
    if (!container) return;

    const activeSchedules = state.schedules.filter(s => s.status === 'active').slice(0, 4);
    container.innerHTML = activeSchedules.map(sch => {
      const route = Storage.getRouteById(sch.routeId, state);
      const op = Storage.getOperatorById(sch.operatorId, state);
      const seatsLeft = Math.max(0, sch.quota - sch.booked);
      return `
        <article class="schedule-card">
          <div class="operator-badge">
            <img src="${op ? op.logo : ''}" alt="${op ? op.name : 'Ferry'}" class="operator-logo">
            <div>
              <strong style="display:block;">${op ? op.name : sch.vessel}</strong>
              <span class="text-xs text-muted">${sch.vessel}</span>
            </div>
          </div>
          <div class="schedule-timeline">
            <div class="timeline-point">
              <strong>${sch.departureTime}</strong>
              <span>${route ? route.originCity : ''} · ${route ? route.originTerminal.split(' ')[0] : ''}</span>
            </div>
            <div class="timeline-line">${route ? route.durationMinutes : 50} mnt</div>
            <div class="timeline-point">
              <strong>${sch.arrivalTime}</strong>
              <span>${route ? route.destinationCity : ''} · ${route ? route.destinationTerminal.split(' ')[0] : ''}</span>
            </div>
          </div>
          <div>
            <strong style="font-size:1.125rem; color:var(--color-primary); display:block;">${UI.formatIDR(sch.price)}</strong>
            <span class="text-xs text-muted">Sisa ${seatsLeft} kursi · ${UI.formatDate(sch.date)}</span>
          </div>
          <div>
            <button type="button" class="btn btn--primary btn-select-schedule" data-schedule-id="${sch.id}">Pilih Jadwal</button>
          </div>
        </article>
      `;
    }).join('');

    container.querySelectorAll('.btn-select-schedule').forEach(btn => {
      btn.addEventListener('click', () => {
        const schId = btn.getAttribute('data-schedule-id');
        const st = Storage.loadState();
        st.draftBooking = {
          scheduleId: schId,
          paxCount: 1,
          tripType: 'one_way',
          passengers: []
        };
        Storage.saveState(st);
        window.location.href = 'pages/buyer/passengers.html';
      });
    });
  }

  function initFaq() {
    document.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        if (item) item.classList.toggle('is-open');
      });
    });
  }
})();
