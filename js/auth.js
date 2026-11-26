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

  function loginWithGoogle({ name, email, avatar } = {}) {
    const state = window.SasyTix.Storage.loadState();
    const cleanEmail = String(email || '').trim().toLowerCase();
    let user = state.users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      user = {
        id: 'usr-google-' + Date.now(),
        name: name || 'Pengguna Google',
        email: cleanEmail || `google.user.${Date.now()}@gmail.com`,
        phone: '0812' + Math.floor(10000000 + Math.random() * 90000000),
        password: '',
        role: 'buyer',
        status: 'active',
        provider: 'google',
        avatar: avatar || null,
        savedPassengers: [],
        notifications: { email: true, whatsapp: true, promo: true }
      };
      state.users.push(user);
    } else {
      user.status = 'active';
      user.provider = user.provider || 'google';
      if (avatar && !user.avatar) user.avatar = avatar;
    }
    state.currentUserId = user.id;
    window.SasyTix.Storage.saveState(state);
    return { ok: true, user };
  }

  function logout() {
    const state = window.SasyTix.Storage.loadState();
    state.currentUserId = null;
    window.SasyTix.Storage.saveState(state);
  }

  window.SasyTix.Auth = { login, register, loginWithGoogle, logout };
})();
