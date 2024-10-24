// Example migration file
module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('SpecialDates', {
          id: {
              type: Sequelize.INTEGER,
              autoIncrement: true,
              primaryKey: true,
          },
          name: {
              type: Sequelize.STRING,
              allowNull: false,
          },
          startDate: {
              type: Sequelize.DATE,
              allowNull: false,
          },
          endDate: {
              type: Sequelize.DATE,
              allowNull: false,
          },
          multiplier: {
              type: Sequelize.FLOAT,
              allowNull: false,
          }
      });
  },
  down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('SpecialDates');
  }
};