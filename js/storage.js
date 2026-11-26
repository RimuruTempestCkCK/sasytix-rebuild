window.SasyTix = window.SasyTix || {};

(function () {
  const STORAGE_KEY = 'sasytix_rebuild_state_v1';

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function getInitialState() {
    const mock = window.SasyTix.MOCK_DATA;
    return {
      users: clone(mock.users),
      routes: clone(mock.routes),
      operators: clone(mock.operators),
      schedules: clone(mock.schedules),
      bookings: clone(mock.bookings),
      admins: clone(mock.admins),
      monthlyTrend: clone(mock.monthlyTrend),
      currentUserId: 'usr-buyer-1',
      draftBooking: null,
      searchQuery: {
        origin: 'Batam',
        destination: 'Singapura',
        departureDate: '2026-11-27',
        returnDate: '2026-11-29',
        paxCount: 1,
        tripType: 'one_way'
      }
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const fresh = getInitialState();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
        return fresh;
      }
      return JSON.parse(raw);
    } catch (err) {
      console.error('Failed to read LocalStorage state, resetting:', err);
      const fresh = getInitialState();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
      return fresh;
    }
  }

  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function resetDemoData() {
    const fresh = getInitialState();
    saveState(fresh);
    return fresh;
  }

  function getCurrentUser(state) {
    const s = state || loadState();
    return s.users.find(u => u.id === s.currentUserId) || null;
  }

  function getRouteById(id, state) {
    const s = state || loadState();
    return s.routes.find(r => r.id === id) || null;
  }

  function getOperatorById(id, state) {
    const s = state || loadState();
    return s.operators.find(o => o.id === id) || null;
  }

  function getScheduleById(id, state) {
    const s = state || loadState();
    return s.schedules.find(sc => sc.id === id) || null;
  }

  window.SasyTix.Storage = {
    loadState,
    saveState,
    resetDemoData,
    getCurrentUser,
    getRouteById,
    getOperatorById,
    getScheduleById
  };
})();
