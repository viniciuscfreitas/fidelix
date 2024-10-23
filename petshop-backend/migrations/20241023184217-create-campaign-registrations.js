// migration file: YYYYMMDDHHMMSS-create-campaign-registrations.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('CampaignRegistrations', {
          id: {
              type: Sequelize.INTEGER,
              autoIncrement: true,
              primaryKey: true,
          },
          customerId: {
              type: Sequelize.INTEGER,
              allowNull: false,
          },
          campaignName: {
              type: Sequelize.STRING,
              allowNull: false,
          },
          registeredAt: {
              type: Sequelize.DATE,
              allowNull: false,
          },
          createdAt: {
              type: Sequelize.DATE,
              allowNull: false,
              defaultValue: Sequelize.NOW,
          },
          updatedAt: {
              type: Sequelize.DATE,
              allowNull: false,
              defaultValue: Sequelize.NOW,
          }
      });
  },
  down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('CampaignRegistrations');
  }
};
