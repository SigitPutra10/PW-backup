'use strict';

const argon2 = require('argon2');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await argon2.hash('123456');
    await queryInterface.bulkInsert('users', [{
      name: 'admin',
      email: 'admin@gmail.com',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
