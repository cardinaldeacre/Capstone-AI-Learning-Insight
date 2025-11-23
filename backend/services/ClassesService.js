const knex = require('../config/database'); // Pastikan path config DB benar

// Ganti 'classes' dengan nama tabel yang sesuai di databasemu
const TABLE_NAME = 'classes'; 

exports.create = async (data) => {
  // Biasanya return ID dari data yang baru dibuat
  const [id] = await knex(TABLE_NAME).insert(data);
  return { id, ...data };
};

exports.findAll = async () => {
  return await knex(TABLE_NAME).select('*');
};

exports.findById = async (id) => {
  return await knex(TABLE_NAME).where({ id }).first();
};

exports.update = async (id, data) => {
  return await knex(TABLE_NAME).where({ id }).update(data);
};

exports.delete = async (id) => {
  return await knex(TABLE_NAME).where({ id }).del();
};