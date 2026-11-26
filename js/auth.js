window.SasyTix = window.SasyTix || {};

(function () {
  function login(email, password) {
    const state = window.SasyTix.Storage.loadState();
    const user = state.users.find(
      u => u.email.toLowerCase() === String(email).trim().toLowerCase() && u.password === password
    );
    if (!user) {
      return { ok: false, message: 'Email atau kata sandi demo tidak cocok.' };
    }
    state.currentUserId = user.id;
    window.SasyTix.Storage.saveState(state);
    return { ok: true, user };
  }

  function register({ name, email, phone, password }) {
    const state = window.SasyTix.Storage.loadState();
    if (state.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, message: 'Email sudah terdaftar di simulasi.' };
    }
    const newUser = {
      id: 'usr-' + Date.now(),
      name,
      email,
      phone,
      password,
      role: 'buyer',
      status: 'pending_activation',
      savedPassengers: [],
      notifications: { email: true, whatsapp: true, promo: true }
    };
    state.users.push(newUser);
    state.currentUserId = newUser.id;
    window.SasyTix.Storage.saveState(state);
    return { ok: true, user: newUser };
  }

  function logout() {
    const state = window.SasyTix.Storage.loadState();
    state.currentUserId = null;
    window.SasyTix.Storage.saveState(state);
  }

  window.SasyTix.Auth = { login, register, logout };
})();
