const knex = require('../config/database');
const bcrypt = require('bcrypt');

const UserService = {
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

	getAllUsers: async role => {
		let query = knex('users').select('users.id', 'users.name', 'users.email', 'users.role');
		if (role) {
			if (Array.isArray(role)) {
				query = query.whereIn('users.role', role);
			} else if (typeof role === 'string' && role.includes(',')) {
				query = query.whereIn('users.role', role.split(','));
			} else {
				query = query.where('users.role', role);
			}
		}

		return query;
	},

	findUserByEmail: async email => {
		return knex('users').select('id', 'name', 'password', 'role').where({email}).first();
	},

	updateUser: async (id, data) => {
		const allowedFields = ['name', 'email', 'role'];
		const updateData = {};

		// Masukkan hanya field yg diizinkan
		for (const key of allowedFields) {
			if (data[key] !== undefined && data[key] !== null) {
				updateData[key] = data[key];
			}
		}

		// Kalau ada password baru, hash dan tambahkan ke updateData
		if (data.password) {
			updateData.password = await bcrypt.hash(data.password, 10);
		}

		// Eksekusi update
		const [updatedUser] = await knex('users')
			.where({id})
			.update(updateData)
			.returning(['id', 'name', 'email', 'role']);

		return updatedUser;
	},

	deleteUser: async id => {
		return knex('users').where({id}).del();
	},
};

module.exports = UserService;
