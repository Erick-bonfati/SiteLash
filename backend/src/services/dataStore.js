const dataManager = require('../utils/dataManager');

// Carrega dados em memória uma única vez e mantém coerência com os arquivos JSON.
const state = dataManager.loadData();

const getAdmins = () => state.admins;
const getProducts = () => state.products;
const getAppointments = () => state.appointments;

const setAdmins = (admins) => {
  state.admins = admins;
  dataManager.saveAdmins(state.admins);
  return state.admins;
};

const setProducts = (products) => {
  state.products = products;
  dataManager.saveProducts(state.products);
  return state.products;
};

const setAppointments = (appointments) => {
  state.appointments = appointments;
  dataManager.saveAppointments(state.appointments);
  return state.appointments;
};

const generateId = (collection) => dataManager.generateId(collection);

module.exports = {
  state,
  getAdmins,
  getProducts,
  getAppointments,
  setAdmins,
  setProducts,
  setAppointments,
  generateId
};
