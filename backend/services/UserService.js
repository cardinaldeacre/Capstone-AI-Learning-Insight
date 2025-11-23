const knex = require('../config/database');
const bcrypt = require('bcrypt');

const UserService = {
	getAll: async () => {},

	getById: async id => {},

	create: async (name, email, password, role) => {
		const existingUser = await knex('users').where({email}).first();
		if (existingUser) {
			throw new Error('Email sudah terdaftar');
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const [newUser] = await knex('users')
			.insert({name, email, password: hashedPassword, role})
			.returning(['id', 'name', 'email', 'role', 'created_at']);

		delete newUser.password;
		return newUser;
	},

	findUserByEmail: async email => {
		return knex('users').select('id', 'name', 'password', 'role').where({email}).first();
	},

	update: async (id, data) => {},

	del: async id => {},
};

module.exports = UserService;
