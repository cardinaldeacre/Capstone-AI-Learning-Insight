const fs = require('fs');
const path = require('path');

// Ambil nama service dari argumen terminal
const name = process.argv[2];
if (!name) {
	console.error('Namanya jangan lupa!');
	process.exit(1);
}

// Pastikan folder services ada
const servicesDir = path.join(__dirname, 'services');
if (!fs.existsSync(servicesDir)) {
	fs.mkdirSync(servicesDir);
}

// Nama service
const fileName = `${name}Service.js`;
const filePath = path.join(servicesDir, fileName);

// Template isi service
const template = `
const knex = require('../config/database');

const ${name}Service = {
  getAll: async () => {
  },

  getById: async (id) => {
  },

  create: async (data) => {
  },

  update: async (id, data) => {
  },

  delete: async (id) => {
  }
};

module.exports = ${name}Service;
`;

// Cek jika file sudah ada
if (fs.existsSync(filePath)) {
	console.error(`Udah dipake namanya, Ganti!`);
	process.exit(1);
}

// Tulis file baru
fs.writeFileSync(filePath, template.trim());
console.log(`${fileName} Service berhasil dibuat`);
