(function () {
  const { Storage, UI, Auth } = window.SasyTix;

  document.addEventListener('DOMContentLoaded', () => {
    UI.renderPublicHeader('profile');
    UI.renderPublicFooter();
    UI.initPasswordToggles();

    const state = Storage.loadState();
    const user = Storage.getCurrentUser(state) || state.users[0];

    document.getElementById('prof-name').value = user.name || '';
    document.getElementById('prof-email').value = user.email || '';
    document.getElementById('prof-phone').value = user.phone || '';

    const savedMount = document.getElementById('saved-passengers-mount');
    const savedList = user.savedPassengers || [];
    savedMount.innerHTML = savedList.length
      ? savedList.map(p => `
          <div style="padding:10px; border:1px solid var(--color-border); border-radius:var(--radius-md); margin-bottom:8px;">
            <strong>${p.fullName}</strong>
            <div class="text-xs text-muted font-mono">Paspor: ${p.passportNumber} · Exp ${p.passportExpiry}</div>
          </div>
        `).join('')
      : '<p class="text-sm text-muted">Belum ada data penumpang tersimpan.</p>';

    document.getElementById('profile-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const st = Storage.loadState();
      const u = Storage.getCurrentUser(st) || st.users[0];
      u.name = document.getElementById('prof-name').value.trim();
      u.email = document.getElementById('prof-email').value.trim();
      u.phone = document.getElementById('prof-phone').value.trim();
      Storage.saveState(st);
      UI.renderPublicHeader('profile');
      UI.showToast('Profil berhasil diperbarui.', 'success');
    });

    document.getElementById('password-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      UI.showToast('Kata sandi simulasi berhasil diperbarui.', 'success');
      e.target.reset();
    });

    document.getElementById('btn-logout')?.addEventListener('click', () => {
      Auth.logout();
      window.location.href = 'login.html';
    });
  });
})();
