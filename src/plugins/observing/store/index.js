// Stellarium Web - Copyright (c) 2018 - Noctua Software Ltd
//
// This program is licensed under the terms of the GNU AGPL v3, or
// alternatively under a commercial licence.
//
// The terms of the AGPL v3 license can be found in the main directory of this
// repository.

// Modo visual/local: sin backend, sin Parse
// Todos los datos se mantienen solo en memoria

// Simula la carga de datos de una "tabla" en memoria
var loadParseTable = function (commit, tableName, fieldIncludes) {
  // Usamos datos vacíos o de ejemplo
  let mockData = [];
  if (tableName === 'Observation') {
    mockData = [];
  } else if (tableName === 'Location') {
    mockData = [];
  }
  commit('setParseTable', { tableName: tableName, newValue: mockData });
  return Promise.resolve();
}

const moduleStore = {
  namespaced: true,
  state: {
    showObservingPanel: false,

    noctuaSky: {
      loginStatus: 'loggedOut',
      userName: 'loggedOut',
      lastSavedLocationId: undefined,
      lastUsedObservingSetup: {
        'id': 'eyes_observation',
        'state': {}
      },
      Observation: [],
      Location: []
    }
  },
  mutations: {
    toggleBool (state, varName) {
      state[varName] = !state[varName]
    },
    setLoginStatus (state, newValue) {
      // Modo visual: no hay usuario real
      state.noctuaSky.userName = 'demoUser';
      state.noctuaSky.loginStatus = newValue;
    },
    setParseTable (state, {tableName, newValue}) {
      state.noctuaSky[tableName] = newValue
    },
    setLastSavedLocationId (state, newValue) {
      state.noctuaSky.lastSavedLocationId = newValue
    },
    setLastUsedObservingSetup (state, newValue) {
      state.noctuaSky.lastUsedObservingSetup = newValue
    }
  },
  actions: {
    initLoginStatus ({ dispatch, commit, state }) {
      // Simula usuario logueado
      commit('setLoginStatus', 'loggedIn');
      return dispatch('loadUserData');
    },
    signIn ({ dispatch, commit, state }, data) {
      // Simula inicio de sesión exitoso
      commit('setLoginStatus', 'loggedIn');
      return dispatch('loadUserData');
    },
    signUp ({ dispatch, commit, state }, data) {
      // Simula registro exitoso
      commit('setLoginStatus', 'loggedIn');
      return dispatch('loadUserData');
    },
    signOut ({ commit, state }) {
      // Simula logout
      commit('setLoginStatus', 'loggedOut');
    },
    loadUserData ({ commit, state }) {
      // Simula carga de datos
      return Promise.all([
        loadParseTable(commit, 'Location')
      ]).then(() => loadParseTable(commit, 'Observation'));
    },
    addObservation ({ dispatch, commit, state }, data) {
      // Simula agregar una observación localmente
      const newObs = {
        ...data,
        id: Date.now(),
        owner: 'demoUser',
      };
      state.noctuaSky.Observation.push(newObs);
      commit('setLastSavedLocationId', data.locationRef);
      commit('setLastUsedObservingSetup', data.observingSetup);
      return Promise.resolve(newObs);
    },
    deleteObservations ({ dispatch, commit, state }, data) {
      // Simula borrado local de observaciones
      state.noctuaSky.Observation = state.noctuaSky.Observation.filter(obs => !data.includes(obs.id));
      commit('setParseTable', { tableName: 'Observation', newValue: state.noctuaSky.Observation });
      return Promise.resolve();
    },
    addLocation ({ dispatch, commit, state }, data) {
      // Simula agregar una ubicación localmente
      const newLoc = {
        ...data,
        id: Date.now(),
        owner: 'demoUser',
      };
      state.noctuaSky.Location.push(newLoc);
      commit('setParseTable', { tableName: 'Location', newValue: state.noctuaSky.Location });
      return Promise.resolve(newLoc);
    }
  }
}

export default moduleStore
