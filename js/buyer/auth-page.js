(function () {
  const { UI, Auth } = window.SasyTix;

  document.addEventListener('DOMContentLoaded', () => {
    UI.renderDemoBar();
    UI.renderPublicHeader('home');
    UI.renderPublicFooter();

    const params = new URLSearchParams(window.location.search);
    let mode = params.get('mode') || 'login';

    const tabs = document.querySelectorAll('#auth-mode-tabs button');
    const mount = document.getElementById('auth-form-mount');

    function setMode(m) {
      mode = m;
      tabs.forEach(t => {
        t.className = t.getAttribute('data-mode') === mode ? 'btn btn--primary btn--sm' : 'btn btn--outline btn--sm';
      });
      renderForm();
    }

    tabs.forEach(t => {
      t.addEventListener('click', () => setMode(t.getAttribute('data-mode')));
    });

    function renderForm() {
      if (mode === 'login') {
        mount.innerHTML = `
          <h1 style="font-size:1.35rem; font-weight:800; margin-bottom:6px;">Masuk ke Sasy.Tix</h1>
          <p class="text-sm text-muted" style="margin-bottom:16px;">Gunakan akun demo atau kredensial simulasi Anda.</p>
          <form id="form-login" style="display:grid; gap:14px;">
            <div class="form-group">
              <label class="form-label" for="l-email">Email</label>
              <input type="email" id="l-email" class="form-control" value="buyer@demo.com" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="l-pass">Password</label>
              <input type="password" id="l-pass" class="form-control" value="demo123" required>
            </div>
            <button type="submit" class="btn btn--primary btn--block">Masuk</button>
          </form>
          <hr style="border:none; border-top:1px solid var(--color-border); margin-block:18px;">
          <div class="text-xs text-muted" style="margin-bottom:8px;">Login Cepat Demo Role (Password: demo123):</div>
          <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px;">
            <button type="button" class="btn btn--outline btn--sm quick-login" data-email="buyer@demo.com">Buyer</button>
            <button type="button" class="btn btn--outline btn--sm quick-login" data-email="admin@demo.com">Admin</button>
            <button type="button" class="btn btn--outline btn--sm quick-login" data-email="owner@demo.com">Owner</button>
          </div>
        `;
        document.getElementById('form-login')?.addEventListener('submit', (e) => {
          e.preventDefault();
          const res = Auth.login(document.getElementById('l-email').value, document.getElementById('l-pass').value);
          if (!res.ok) {
            UI.showToast(res.message, 'error');
            return;
          }
          redirectByRole(res.user.role);
        });
        mount.querySelectorAll('.quick-login').forEach(btn => {
          btn.addEventListener('click', () => {
            const res = Auth.login(btn.getAttribute('data-email'), 'demo123');
            if (res.ok) redirectByRole(res.user.role);
          });
        });
      } else if (mode === 'register') {
        mount.innerHTML = `
          <h1 style="font-size:1.35rem; font-weight:800; margin-bottom:6px;">Buat Akun Penumpang</h1>
          <p class="text-sm text-muted" style="margin-bottom:16px;">Simulasi pendaftaran akun pembeli tiket feri.</p>
          <form id="form-register" style="display:grid; gap:14px;">
            <div class="form-group">
              <label class="form-label" for="r-name">Nama Lengkap</label>
              <input type="text" id="r-name" class="form-control" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="r-email">Email</label>
              <input type="email" id="r-email" class="form-control" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="r-phone">Nomor WhatsApp</label>
              <input type="tel" id="r-phone" class="form-control" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="r-pass">Password</label>
              <input type="password" id="r-pass" class="form-control" required>
            </div>
            <button type="submit" class="btn btn--primary btn--block">Daftar &amp; Kirim OTP</button>
          </form>
        `;
        document.getElementById('form-register')?.addEventListener('submit', (e) => {
          e.preventDefault();
          const res = Auth.register({
            name: document.getElementById('r-name').value.trim(),
            email: document.getElementById('r-email').value.trim(),
            phone: document.getElementById('r-phone').value.trim(),
            password: document.getElementById('r-pass').value
          });
          if (!res.ok) {
            UI.showToast(res.message, 'error');
            return;
          }
          UI.showToast('Akun dibuat! Lanjutkan verifikasi OTP simulasi (kode: 123456).', 'success');
          setMode('otp');
        });
      } else if (mode === 'forgot') {
        mount.innerHTML = `
          <h1 style="font-size:1.35rem; font-weight:800; margin-bottom:6px;">Lupa Kata Sandi</h1>
          <p class="text-sm text-muted" style="margin-bottom:16px;">Masukkan email Anda untuk simulasi tautan reset kata sandi.</p>
          <form id="form-forgot" style="display:grid; gap:14px;">
            <div class="form-group">
              <label class="form-label" for="fg-email">Email Terdaftar</label>
              <input type="email" id="fg-email" class="form-control" value="buyer@demo.com" required>
            </div>
            <button type="submit" class="btn btn--primary btn--block">Kirim Instruksi Reset (Simulasi)</button>
          </form>
        `;
        document.getElementById('form-forgot')?.addEventListener('submit', (e) => {
          e.preventDefault();
          UI.showToast('Instruksi reset simulasi dikirim. Silakan atur ulang kata sandi.', 'info');
          setMode('reset');
        });
      } else if (mode === 'reset') {
        mount.innerHTML = `
          <h1 style="font-size:1.35rem; font-weight:800; margin-bottom:6px;">Reset Kata Sandi</h1>
          <form id="form-reset" style="display:grid; gap:14px;">
            <div class="form-group">
              <label class="form-label" for="rs-p1">Kata Sandi Baru</label>
              <input type="password" id="rs-p1" class="form-control" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="rs-p2">Konfirmasi Kata Sandi Baru</label>
              <input type="password" id="rs-p2" class="form-control" required>
            </div>
            <button type="submit" class="btn btn--primary btn--block">Simpan Kata Sandi Baru</button>
          </form>
        `;
        document.getElementById('form-reset')?.addEventListener('submit', (e) => {
          e.preventDefault();
          UI.showToast('Kata sandi simulasi berhasil direset.', 'success');
          setMode('login');
        });
      } else if (mode === 'otp') {
        mount.innerHTML = `
          <h1 style="font-size:1.35rem; font-weight:800; margin-bottom:6px;">Verifikasi OTP (Simulasi)</h1>
          <p class="text-sm text-muted" style="margin-bottom:16px;">Masukkan 6 digit kode OTP simulasi (contoh: <strong class="font-mono">123456</strong>).</p>
          <form id="form-otp" style="display:grid; gap:14px;">
            <div class="form-group">
              <label class="form-label" for="otp-code">Kode OTP</label>
              <input type="text" id="otp-code" class="form-control font-mono" value="123456" maxlength="6" required>
            </div>
            <button type="submit" class="btn btn--primary btn--block">Verifikasi OTP</button>
          </form>
        `;
        document.getElementById('form-otp')?.addEventListener('submit', (e) => {
          e.preventDefault();
          UI.showToast('OTP valid! Melanjutkan ke aktivasi akun.', 'success');
          setMode('activate');
        });
      } else if (mode === 'activate') {
        mount.innerHTML = `
          <div style="text-align:center; padding-block:12px;">
            <span class="badge badge--success" style="margin-bottom:12px;">Akun Aktif</span>
            <h1 style="font-size:1.35rem; font-weight:800; margin-bottom:8px;">Aktivasi Akun Berhasil</h1>
            <p class="text-sm text-muted" style="margin-bottom:20px;">Akun simulasi Anda siap digunakan untuk memesan tiket feri.</p>
            <a href="../../index.html" class="btn btn--primary btn--block">Mulai Cari Jadwal</a>
          </div>
        `;
      }
    }

    function redirectByRole(role) {
      if (role === 'admin') {
        window.location.href = '../admin/dashboard.html';
      } else if (role === 'owner') {
        window.location.href = '../owner/dashboard.html';
      } else {
        window.location.href = '../../index.html';
      }
    }

    setMode(mode);
  });
})();
