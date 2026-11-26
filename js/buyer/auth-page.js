(function () {
  const { UI, Auth } = window.SasyTix;

  document.addEventListener('DOMContentLoaded', () => {
    UI.renderPublicHeader('auth');
    UI.renderPublicFooter();

    const params = new URLSearchParams(window.location.search);
    const bodyPage = document.body.getAttribute('data-auth-page');
    let mode = params.get('mode') || bodyPage || 'login';

    const tabsContainer = document.getElementById('auth-mode-tabs');
    const mount = document.getElementById('auth-form-mount');
    const googleModal = document.getElementById('google-auth-modal');

    function setMode(newMode, updateUrl = true) {
      mode = newMode;
      if (updateUrl && window.history && window.history.replaceState) {
        const url = new URL(window.location);
        url.searchParams.set('mode', mode);
        window.history.replaceState({}, '', url);
      }

      if (tabsContainer) {
        const tabBtns = tabsContainer.querySelectorAll('.auth-tab-btn');
        tabBtns.forEach(btn => {
          const btnMode = btn.getAttribute('data-mode');
          btn.classList.toggle('is-active', btnMode === mode);
        });
      }

      renderForm();
    }

    if (tabsContainer) {
      tabsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.auth-tab-btn');
        if (btn) {
          const m = btn.getAttribute('data-mode');
          if (m) setMode(m);
        }
      });
    }

    function openGoogleModal() {
      if (!googleModal) return;
      renderGoogleAccountsList();
      googleModal.classList.add('is-open');
      googleModal.setAttribute('aria-hidden', 'false');
    }

    function closeGoogleModal() {
      if (!googleModal) return;
      googleModal.classList.remove('is-open');
      googleModal.setAttribute('aria-hidden', 'true');
    }

    const closeBtn = document.getElementById('close-google-modal');
    const cancelBtn = document.getElementById('cancel-google-modal');
    if (closeBtn) closeBtn.addEventListener('click', closeGoogleModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeGoogleModal);
    if (googleModal) {
      googleModal.addEventListener('click', (e) => {
        if (e.target === googleModal) closeGoogleModal();
      });
    }

    function renderGoogleAccountsList() {
      const listEl = document.getElementById('google-accounts-list');
      if (!listEl) return;

      listEl.innerHTML = `
        <button type="button" class="google-account-item" data-name="Rina Kusuma" data-email="rina.kusuma@gmail.com" data-avatar="RK">
          <div class="google-account-avatar">RK</div>
          <div class="google-account-info">
            <div class="google-account-name">Rina Kusuma</div>
            <div class="google-account-email">rina.kusuma@gmail.com</div>
          </div>
          <span class="google-account-badge">Akun Utama</span>
        </button>

        <button type="button" class="google-account-item" data-name="Budi Pratama" data-email="budi.pratama@gmail.com" data-avatar="BP">
          <div class="google-account-avatar avatar--purple">BP</div>
          <div class="google-account-info">
            <div class="google-account-name">Budi Pratama</div>
            <div class="google-account-email">budi.pratama@gmail.com</div>
          </div>
          <span class="google-account-badge">Google User</span>
        </button>

        <button type="button" class="google-account-item" data-name="Dewi Lestari" data-email="dewi.lestari@gmail.com" data-avatar="DL">
          <div class="google-account-avatar avatar--emerald">DL</div>
          <div class="google-account-info">
            <div class="google-account-name">Dewi Lestari</div>
            <div class="google-account-email">dewi.lestari@gmail.com</div>
          </div>
          <span class="google-account-badge">Wisatawan</span>
        </button>

        <div style="margin-top:12px; padding-top:12px; border-top:1px solid var(--color-border);">
          <details style="font-size:0.85rem;">
            <summary style="cursor:pointer; color:var(--color-primary); font-weight:600; padding:4px 0;">
              + Gunakan Akun Google Lainnya (Kustom)
            </summary>
            <form id="custom-google-form" style="display:grid; gap:10px; margin-top:10px;">
              <input type="text" id="cg-name" class="form-control form-control--sm" placeholder="Nama Akun Google" required>
              <input type="email" id="cg-email" class="form-control form-control--sm" placeholder="email.anda@gmail.com" required>
              <button type="submit" class="btn btn--primary btn--sm">Pilih Akun Ini</button>
            </form>
          </details>
        </div>
      `;

      listEl.querySelectorAll('.google-account-item').forEach(item => {
        item.addEventListener('click', () => {
          const name = item.getAttribute('data-name');
          const email = item.getAttribute('data-email');
          const avatar = item.getAttribute('data-avatar');
          executeGoogleLogin({ name, email, avatar });
        });
      });

      const customForm = document.getElementById('custom-google-form');
      if (customForm) {
        customForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const name = document.getElementById('cg-name').value.trim();
          const email = document.getElementById('cg-email').value.trim();
          const avatar = name.split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase() || 'GU';
          executeGoogleLogin({ name, email, avatar });
        });
      }
    }

    function executeGoogleLogin({ name, email, avatar }) {
      const res = Auth.loginWithGoogle({ name, email, avatar });
      closeGoogleModal();
      if (res.ok) {
        UI.showToast(`Berhasil masuk sebagai ${res.user.name} via Google (Simulasi)!`, 'success');
        setTimeout(() => {
          const redirectUrl = params.get('redirect');
          if (redirectUrl) {
            window.location.href = redirectUrl;
          } else {
            redirectByRole(res.user.role);
          }
        }, 700);
      } else {
        UI.showToast('Gagal masuk dengan simulasi Google.', 'error');
      }
    }

    const googleSvg = `
      <svg viewBox="0 0 24 24" width="20" height="20" style="flex-shrink:0;">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
      </svg>
    `;

    function renderForm() {
      if (!mount) return;

      if (mode === 'login') {
        mount.innerHTML = `
          <h1 class="auth-title">Masuk ke Sasy.Tix</h1>
          <p class="auth-subtitle">Kelola pemesanan tiket feri Batam, Singapura, dan Johor dengan mudah.</p>

          <button type="button" class="btn-google-auth" id="btn-google-trigger">
            ${googleSvg}
            <span>Masuk dengan Google (Simulasi)</span>
          </button>

          <div class="auth-divider">
            <span>atau masuk dengan email</span>
          </div>

          <form id="form-login" style="display:grid; gap:14px;">
            <div class="form-group">
              <label class="form-label" for="l-email">Alamat Email</label>
              <input type="email" id="l-email" class="form-control" value="buyer@demo.com" placeholder="nama@email.com" required autocomplete="username">
            </div>
            <div class="form-group">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                <label class="form-label" for="l-pass" style="margin-bottom:0;">Kata Sandi</label>
                <a href="javascript:void(0)" id="link-forgot-pass" class="text-xs" style="color:var(--color-primary); font-weight:600;">Lupa sandi?</a>
              </div>
              <input type="password" id="l-pass" class="form-control" value="demo123" placeholder="Masukkan kata sandi" required autocomplete="current-password">
            </div>
            <button type="submit" class="btn btn--primary btn--block btn--lg">Masuk Sekarang</button>
          </form>

          <div class="auth-footer-link">
            Belum punya akun? <a href="javascript:void(0)" id="link-go-register">Daftar Akun Baru</a>
          </div>

          <div class="auth-demo-box">
            <div class="text-xs text-muted" style="margin-bottom:8px; font-weight:600;">⚡ Login Cepat Demo (Sandi: demo123):</div>
            <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px;">
              <button type="button" class="btn btn--outline btn--sm quick-login" data-email="buyer@demo.com">Buyer</button>
              <button type="button" class="btn btn--outline btn--sm quick-login" data-email="admin@demo.com">Admin</button>
              <button type="button" class="btn btn--outline btn--sm quick-login" data-email="owner@demo.com">Owner</button>
            </div>
          </div>
        `;

        document.getElementById('btn-google-trigger')?.addEventListener('click', openGoogleModal);

        document.getElementById('form-login')?.addEventListener('submit', (e) => {
          e.preventDefault();
          const email = document.getElementById('l-email').value;
          const pass = document.getElementById('l-pass').value;
          const res = Auth.login(email, pass);
          if (!res.ok) {
            UI.showToast(res.message, 'error');
            return;
          }
          UI.showToast(`Login berhasil! Selamat datang, ${res.user.name}.`, 'success');
          setTimeout(() => {
            const redirectUrl = params.get('redirect');
            if (redirectUrl) {
              window.location.href = redirectUrl;
            } else {
              redirectByRole(res.user.role);
            }
          }, 500);
        });

        document.getElementById('link-forgot-pass')?.addEventListener('click', () => setMode('forgot'));
        document.getElementById('link-go-register')?.addEventListener('click', () => setMode('register'));

        mount.querySelectorAll('.quick-login').forEach(btn => {
          btn.addEventListener('click', () => {
            const res = Auth.login(btn.getAttribute('data-email'), 'demo123');
            if (res.ok) {
              UI.showToast(`Masuk sebagai ${res.user.name} (${res.user.role})`, 'success');
              setTimeout(() => redirectByRole(res.user.role), 400);
            }
          });
        });

      } else if (mode === 'register') {
        mount.innerHTML = `
          <h1 class="auth-title">Buat Akun Baru</h1>
          <p class="auth-subtitle">Daftar untuk kemudahan pemesanan dan riwayat tiket feri Anda.</p>

          <button type="button" class="btn-google-auth" id="btn-google-trigger">
            ${googleSvg}
            <span>Daftar dengan Google (Simulasi)</span>
          </button>

          <div class="auth-divider">
            <span>atau daftar dengan email</span>
          </div>

          <form id="form-register" style="display:grid; gap:14px;">
            <div class="form-group">
              <label class="form-label" for="r-name">Nama Lengkap</label>
              <input type="text" id="r-name" class="form-control" placeholder="Contoh: Rina Kusuma" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="r-email">Alamat Email</label>
              <input type="email" id="r-email" class="form-control" placeholder="nama@email.com" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="r-phone">Nomor WhatsApp / HP</label>
              <input type="tel" id="r-phone" class="form-control" placeholder="08123456789" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="r-pass">Kata Sandi</label>
              <input type="password" id="r-pass" class="form-control" placeholder="Minimal 6 karakter" required>
            </div>
            <button type="submit" class="btn btn--primary btn--block btn--lg">Daftar &amp; Kirim OTP</button>
          </form>

          <div class="auth-footer-link">
            Sudah punya akun? <a href="javascript:void(0)" id="link-go-login">Masuk di sini</a>
          </div>
        `;

        document.getElementById('btn-google-trigger')?.addEventListener('click', openGoogleModal);

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
          UI.showToast('Akun berhasil dibuat! Silakan verifikasi OTP simulasi (kode: 123456).', 'success');
          setMode('otp');
        });

        document.getElementById('link-go-login')?.addEventListener('click', () => setMode('login'));

      } else if (mode === 'forgot') {
        mount.innerHTML = `
          <h1 class="auth-title">Lupa Kata Sandi</h1>
          <p class="auth-subtitle">Masukkan email Anda untuk simulasi tautan reset kata sandi.</p>

          <form id="form-forgot" style="display:grid; gap:14px;">
            <div class="form-group">
              <label class="form-label" for="fg-email">Email Terdaftar</label>
              <input type="email" id="fg-email" class="form-control" value="buyer@demo.com" required>
            </div>
            <button type="submit" class="btn btn--primary btn--block btn--lg">Kirim Instruksi Reset (Simulasi)</button>
          </form>

          <div class="auth-footer-link">
            Kembali ke <a href="javascript:void(0)" id="link-back-login">Halaman Masuk</a>
          </div>
        `;

        document.getElementById('form-forgot')?.addEventListener('submit', (e) => {
          e.preventDefault();
          UI.showToast('Instruksi reset simulasi dikirim. Silakan atur ulang kata sandi.', 'info');
          setMode('reset');
        });

        document.getElementById('link-back-login')?.addEventListener('click', () => setMode('login'));

      } else if (mode === 'reset') {
        mount.innerHTML = `
          <h1 class="auth-title">Reset Kata Sandi</h1>
          <p class="auth-subtitle">Buat kata sandi baru untuk akun simulasi Anda.</p>

          <form id="form-reset" style="display:grid; gap:14px;">
            <div class="form-group">
              <label class="form-label" for="rs-p1">Kata Sandi Baru</label>
              <input type="password" id="rs-p1" class="form-control" placeholder="Kata sandi baru" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="rs-p2">Konfirmasi Kata Sandi Baru</label>
              <input type="password" id="rs-p2" class="form-control" placeholder="Ulangi kata sandi" required>
            </div>
            <button type="submit" class="btn btn--primary btn--block btn--lg">Simpan Kata Sandi Baru</button>
          </form>

          <div class="auth-footer-link">
            Batal dan kembali ke <a href="javascript:void(0)" id="link-back-login">Masuk</a>
          </div>
        `;

        document.getElementById('form-reset')?.addEventListener('submit', (e) => {
          e.preventDefault();
          const p1 = document.getElementById('rs-p1').value;
          const p2 = document.getElementById('rs-p2').value;
          if (p1 !== p2) {
            UI.showToast('Konfirmasi kata sandi tidak cocok.', 'error');
            return;
          }
          UI.showToast('Kata sandi simulasi berhasil direset. Silakan login kembali.', 'success');
          setMode('login');
        });

        document.getElementById('link-back-login')?.addEventListener('click', () => setMode('login'));

      } else if (mode === 'otp') {
        mount.innerHTML = `
          <h1 class="auth-title">Verifikasi OTP (Simulasi)</h1>
          <p class="auth-subtitle">Masukkan 6 digit kode OTP simulasi (kode uji: <strong class="font-mono" style="color:var(--color-primary);">123456</strong>).</p>

          <form id="form-otp" style="display:grid; gap:14px;">
            <div class="form-group">
              <label class="form-label" for="otp-code">Kode OTP</label>
              <input type="text" id="otp-code" class="form-control font-mono" value="123456" maxlength="6" style="text-align:center; font-size:1.4rem; letter-spacing:6px; font-weight:700;" required>
            </div>
            <button type="submit" class="btn btn--primary btn--block btn--lg">Verifikasi OTP</button>
          </form>

          <div class="auth-footer-link">
            Tidak menerima kode? <a href="javascript:void(0)" onclick="window.SasyTix.UI.showToast('Kode OTP baru dikirim: 123456', 'info')">Kirim Ulang OTP</a>
          </div>
        `;

        document.getElementById('form-otp')?.addEventListener('submit', (e) => {
          e.preventDefault();
          UI.showToast('OTP valid! Akun Anda aktif.', 'success');
          setMode('activate');
        });

      } else if (mode === 'activate') {
        mount.innerHTML = `
          <div style="text-align:center; padding-block:16px;">
            <div style="width:54px; height:54px; background:#dcfce7; color:#16a34a; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; margin-bottom:14px;">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h1 class="auth-title" style="margin-bottom:6px;">Aktivasi Akun Berhasil!</h1>
            <p class="auth-subtitle" style="margin-bottom:24px;">Akun simulasi Anda sudah aktif. Anda dapat langsung memesan tiket feri rute Batam, Singapura, dan Malaysia.</p>
            <div style="display:grid; gap:10px;">
              <a href="../../index.html" class="btn btn--primary btn--block btn--lg">Mulai Cari Tiket</a>
              <a href="profile.html" class="btn btn--outline btn--block">Lihat Profil Saya</a>
            </div>
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

    setMode(mode, false);
  });
})();
