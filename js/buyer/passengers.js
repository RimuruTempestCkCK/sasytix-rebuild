(function () {
  const { Storage, UI } = window.SasyTix;

  document.addEventListener('DOMContentLoaded', () => {
    UI.renderDemoBar();
    UI.renderPublicHeader('search');
    UI.renderPublicFooter();

    const state = Storage.loadState();
    let draft = state.draftBooking;
    if (!draft || !draft.scheduleId) {
      const fallbackSch = state.schedules[0];
      draft = {
        scheduleId: fallbackSch.id,
        paxCount: 1,
        tripType: 'one_way',
        passengers: []
      };
      state.draftBooking = draft;
      Storage.saveState(state);
    }

    const schedule = Storage.getScheduleById(draft.scheduleId, state);
    const route = Storage.getRouteById(schedule.routeId, state);
    const op = Storage.getOperatorById(schedule.operatorId, state);

    renderSummary(schedule, route, op, draft.paxCount);
    renderPassengerForms(draft.paxCount, draft.passengers);

    document.getElementById('btn-autofill-passenger')?.addEventListener('click', () => {
      const user = Storage.getCurrentUser(Storage.loadState());
      const saved = user?.savedPassengers?.[0] || {
        fullName: user?.name || 'Rina Kusuma',
        gender: 'Female',
        dob: '1995-04-12',
        nationality: 'Indonesia',
        passportNumber: 'C8842190',
        passportExpiry: '2030-04-12',
        email: user?.email || 'buyer@demo.com',
        phone: user?.phone || '+62 812-7700-1122'
      };
      fillPassengerBlock(0, saved);
      UI.showToast('Data penumpang pertama diisi dari profil tersimpan.', 'info');
    });

    document.getElementById('passenger-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const passengers = [];
      let valid = true;

      for (let i = 0; i < draft.paxCount; i++) {
        const p = {
          fullName: val(`p-${i}-name`),
          gender: val(`p-${i}-gender`),
          dob: val(`p-${i}-dob`),
          nationality: val(`p-${i}-nationality`),
          passportNumber: val(`p-${i}-passport`).toUpperCase(),
          passportExpiry: val(`p-${i}-expiry`),
          email: val(`p-${i}-email`),
          phone: val(`p-${i}-phone`),
          seat: `A${10 + i}`
        };

        if (!p.fullName || !p.dob || !p.passportNumber || !p.passportExpiry || !p.email || !p.phone) {
          valid = false;
        }
        passengers.push(p);
      }

      if (!valid) {
        UI.showToast('Mohon lengkapi seluruh field data penumpang dan paspor.', 'error');
        return;
      }

      const st = Storage.loadState();
      st.draftBooking.passengers = passengers;
      Storage.saveState(st);
      window.location.href = 'confirm.html';
    });
  });

  function val(id) {
    return (document.getElementById(id)?.value || '').trim();
  }

  function fillPassengerBlock(i, data) {
    const map = {
      name: data.fullName,
      gender: data.gender,
      dob: data.dob,
      nationality: data.nationality,
      passport: data.passportNumber,
      expiry: data.passportExpiry,
      email: data.email,
      phone: data.phone
    };
    Object.entries(map).forEach(([k, v]) => {
      const el = document.getElementById(`p-${i}-${k}`);
      if (el && v) el.value = v;
    });
  }

  function renderPassengerForms(count, existing) {
    const container = document.getElementById('passengers-fields-container');
    let html = '';
    for (let i = 0; i < count; i++) {
      const p = existing[i] || {};
      html += `
        <fieldset style="border:1px solid var(--color-border); border-radius:var(--radius-md); padding:var(--space-5);">
          <legend style="font-weight:700; padding-inline:8px; color:var(--color-primary);">Penumpang ${i + 1}</legend>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:16px;">
            <div class="form-group">
              <label class="form-label" for="p-${i}-name">Nama Lengkap (Sesuai Paspor) *</label>
              <input type="text" id="p-${i}-name" class="form-control" value="${p.fullName || ''}" placeholder="Contoh: Rina Kusuma" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="p-${i}-gender">Jenis Kelamin *</label>
              <select id="p-${i}-gender" class="form-control">
                <option value="Female" ${p.gender === 'Female' ? 'selected' : ''}>Perempuan</option>
                <option value="Male" ${p.gender === 'Male' ? 'selected' : ''}>Laki-laki</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="p-${i}-dob">Tanggal Lahir *</label>
              <input type="date" id="p-${i}-dob" class="form-control" value="${p.dob || ''}" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="p-${i}-nationality">Kewarganegaraan *</label>
              <input type="text" id="p-${i}-nationality" class="form-control" value="${p.nationality || 'Indonesia'}" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="p-${i}-passport">Nomor Paspor *</label>
              <input type="text" id="p-${i}-passport" class="form-control font-mono" value="${p.passportNumber || ''}" placeholder="Contoh: C8842190" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="p-${i}-expiry">Kedaluwarsa Paspor *</label>
              <input type="date" id="p-${i}-expiry" class="form-control" value="${p.passportExpiry || ''}" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="p-${i}-email">Email *</label>
              <input type="email" id="p-${i}-email" class="form-control" value="${p.email || ''}" placeholder="email@domain.com" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="p-${i}-phone">Nomor Telepon / WhatsApp *</label>
              <input type="tel" id="p-${i}-phone" class="form-control" value="${p.phone || ''}" placeholder="+62 812..." required>
            </div>
          </div>
        </fieldset>
      `;
    }
    container.innerHTML = html;
  }

  function renderSummary(sch, route, op, pax) {
    const subtotal = sch.price * pax;
    const portFee = 65000 * pax;
    const serviceFee = 15000;
    const total = subtotal + portFee + serviceFee;

    document.getElementById('trip-summary-mount').innerHTML = `
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Ringkasan Perjalanan</h2>
        </div>
        <div class="card-body" style="display:flex; flex-direction:column; gap:14px;">
          <div>
            <span class="badge badge--primary">${op ? op.name : sch.vessel}</span>
            <h3 style="font-size:1.1rem; font-weight:700; margin-top:8px;">${route.originCity} → ${route.destinationCity}</h3>
            <p class="text-sm text-muted">${UI.formatDate(sch.date)} · ${sch.departureTime} – ${sch.arrivalTime}</p>
          </div>
          <div class="text-sm">
            <div><strong>Asal:</strong> ${route.originTerminal}</div>
            <div><strong>Tujuan:</strong> ${route.destinationTerminal}</div>
            <div><strong>Penumpang:</strong> ${pax} orang</div>
          </div>
          <hr style="border:none; border-top:1px solid var(--color-border);">
          <div style="display:flex; flex-direction:column; gap:8px;" class="text-sm">
            <div style="display:flex; justify-content:space-between;">
              <span class="text-muted">Tiket (${pax}x)</span>
              <span>${UI.formatIDR(subtotal)}</span>
            </div>
            <div style="display:flex; justify-content:space-between;">
              <span class="text-muted">Seaport Tax &amp; Terminal Fee</span>
              <span>${UI.formatIDR(portFee)}</span>
            </div>
            <div style="display:flex; justify-content:space-between;">
              <span class="text-muted">Biaya Layanan</span>
              <span>${UI.formatIDR(serviceFee)}</span>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:1.1rem; font-weight:800; padding-top:8px; border-top:1px solid var(--color-border);">
              <span>Total</span>
              <span style="color:var(--color-primary);">${UI.formatIDR(total)}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }
})();
