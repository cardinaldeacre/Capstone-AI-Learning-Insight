const knex = require('../config/database');
const bcrypt = require('bcrypt');

const UserService = {
	getAll: async () => {},

	getById: async id => {},

	create: async (name, email, password, role) => {
		const hashedPassword = await bcrypt.hash();
	},

	update: async (id, data) => {},

	del: async id => {},
};

module.exports = UserService;
