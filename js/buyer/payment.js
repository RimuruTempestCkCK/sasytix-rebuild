(function () {
  const { Storage, UI } = window.SasyTix;

  document.addEventListener('DOMContentLoaded', () => {
    UI.renderDemoBar();
    UI.renderPublicHeader('bookings');
    UI.renderPublicFooter();

    const params = new URLSearchParams(window.location.search);
    const state = Storage.loadState();
    const bookingId = params.get('bookingId') || state.bookings[0]?.id;
    const booking = state.bookings.find(b => b.id === bookingId);
    const mount = document.getElementById('payment-content-mount');

    if (!booking) {
      mount.innerHTML = `<div class="empty-state"><h1>Booking tidak ditemukan</h1><a href="bookings.html" class="btn btn--primary" style="margin-top:12px;">Ke My Booking</a></div>`;
      return;
    }

    const methods = [
      { id: 'QRIS', title: 'QRIS', desc: 'Scan QRIS dari semua aplikasi e-wallet & m-banking' },
      { id: 'Virtual Account', title: 'Virtual Account', desc: 'BCA / Mandiri / BNI Virtual Account otomatis' },
      { id: 'E-Wallet', title: 'E-Wallet', desc: 'GoPay, OVO, Dana, ShopeePay' },
      { id: 'Bank Transfer', title: 'Bank Transfer', desc: 'Transfer manual ke rekening PT Pesisir Antar Indo' },
      { id: 'Credit / Debit Card', title: 'Credit / Debit Card', desc: 'Visa / Mastercard (Simulasi UI)' }
    ];

    let selectedMethod = booking.paymentMethod || 'QRIS';

    function render() {
      const st = Storage.loadState();
      const b = st.bookings.find(x => x.id === booking.id);
      const route = Storage.getRouteById(b.routeId, st);

      mount.innerHTML = `
        <div class="checkout-grid">
          <div class="card">
            <div class="card-header">
              <div>
                <span class="text-xs text-muted">Simulasi Pembayaran (Tanpa Transaksi Uang Sungguhan)</span>
                <h1 class="card-title" style="font-size:1.25rem;">Invoice ${b.id}</h1>
              </div>
              ${UI.statusBadge(b.paymentStatus)}
            </div>
            <div class="card-body" style="display:flex; flex-direction:column; gap:18px;">
              <div>
                <h2 style="font-size:1rem; font-weight:700; margin-bottom:10px;">Pilih Metode Pembayaran</h2>
                <div style="display:grid; gap:10px;">
                  ${methods.map(m => `
                    <label style="display:flex; align-items:center; gap:12px; padding:12px 14px; border:1px solid ${selectedMethod === m.id ? 'var(--color-primary)' : 'var(--color-border)'}; border-radius:var(--radius-md); cursor:pointer; background:${selectedMethod === m.id ? 'var(--color-primary-soft)' : 'var(--color-surface)'};">
                      <input type="radio" name="pay-method" value="${m.id}" ${selectedMethod === m.id ? 'checked' : ''}>
                      <div>
                        <strong style="display:block;">${m.title}</strong>
                        <span class="text-xs text-muted">${m.desc}</span>
                      </div>
                    </label>
                  `).join('')}
                </div>
              </div>

              <div class="card" style="background:var(--color-surface-alt);">
                <div class="card-body" style="display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:16px;">
                  <div>
                    <div class="text-xs text-muted">Kode Pembayaran / Referensi Simulasi</div>
                    <div class="font-mono" style="font-size:1.1rem; font-weight:700; margin-top:4px;">${selectedMethod.toUpperCase().replace(/\s+/g, '')}-${b.id}</div>
                    <p class="text-xs text-muted" style="margin-top:4px;">Total tagihan tepat: <strong>${UI.formatIDR(b.totalAmount)}</strong></p>
                  </div>
                  ${selectedMethod === 'QRIS' ? UI.generateDummyQR(b.id) : ''}
                </div>
              </div>

              <div style="display:flex; flex-wrap:wrap; gap:10px;">
                <button type="button" class="btn btn--primary" id="btn-submit-payment">Kirim Bukti Bayar (Simulasi)</button>
                <a href="bookings.html" class="btn btn--outline">Lihat My Booking</a>
                ${b.ticketIssued ? `<a href="ticket.html?bookingId=${encodeURIComponent(b.id)}" class="btn btn--secondary">Buka Boarding Pass</a>` : ''}
              </div>

              <div style="padding-top:14px; border-top:1px solid var(--color-border);">
                <div class="text-xs text-muted" style="margin-bottom:8px;">Simulasi Perubahan Status Pembayaran (Untuk Pengujian Prototype):</div>
                <div style="display:flex; flex-wrap:wrap; gap:8px;">
                  <button type="button" class="btn btn--outline btn--sm sim-status-btn" data-status="Pending">Pending</button>
                  <button type="button" class="btn btn--outline btn--sm sim-status-btn" data-status="Payment Submitted">Payment Submitted</button>
                  <button type="button" class="btn btn--outline btn--sm sim-status-btn" data-status="Verified">Verified (Terbitkan Tiket)</button>
                  <button type="button" class="btn btn--outline btn--sm sim-status-btn" data-status="Rejected">Rejected</button>
                  <button type="button" class="btn btn--outline btn--sm sim-status-btn" data-status="Expired">Expired</button>
                </div>
              </div>
            </div>
          </div>

          <aside class="summary-sticky">
            <div class="card">
              <div class="card-header"><h2 class="card-title">Ringkasan Tagihan</h2></div>
              <div class="card-body" style="display:flex; flex-direction:column; gap:8px;">
                <div class="text-sm"><strong>Rute:</strong> ${route ? `${route.originCity} → ${route.destinationCity}` : '-'}</div>
                <div class="text-sm"><strong>Tanggal:</strong> ${UI.formatDate(b.travelDate)}</div>
                <div class="text-sm"><strong>Penumpang:</strong> ${b.passengers.length} orang</div>
                <div class="text-sm"><strong>Status Booking:</strong> ${UI.statusBadge(b.bookingStatus)}</div>
                <hr style="border:none; border-top:1px solid var(--color-border); margin-block:6px;">
                <div style="display:flex; justify-content:space-between; font-size:1.15rem; font-weight:800;">
                  <span>Total</span>
                  <span style="color:var(--color-primary);">${UI.formatIDR(b.totalAmount)}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      `;

      mount.querySelectorAll('input[name="pay-method"]').forEach(radio => {
        radio.addEventListener('change', () => {
          selectedMethod = radio.value;
          render();
        });
      });

      document.getElementById('btn-submit-payment')?.addEventListener('click', () => {
        updatePaymentStatus('Payment Submitted');
      });

      mount.querySelectorAll('.sim-status-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          updatePaymentStatus(btn.getAttribute('data-status'));
        });
      });
    }

    function updatePaymentStatus(newStatus) {
      const st = Storage.loadState();
      const target = st.bookings.find(x => x.id === booking.id);
      if (!target) return;
      target.paymentMethod = selectedMethod;
      target.paymentStatus = newStatus;
      target.paymentProofRef = `${selectedMethod.toUpperCase().slice(0, 4)}-${Date.now().toString().slice(-6)}`;

      if (newStatus === 'Verified') {
        target.bookingStatus = 'Confirmed';
        target.ticketIssued = true;
        target.ticketCode = target.ticketCode || ('BP-' + target.id);
      } else if (newStatus === 'Rejected' || newStatus === 'Expired') {
        target.bookingStatus = 'Cancelled';
        target.ticketIssued = false;
      } else {
        target.bookingStatus = 'Pending Payment';
      }

      Storage.saveState(st);
      UI.showToast(`Status pembayaran diperbarui menjadi ${newStatus}.`, newStatus === 'Verified' ? 'success' : 'info');
      render();
    }

    render();
  });
})();
