module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("searchHistories", "userId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
    await queryInterface.addColumn("favouriteWords", "userId", {
      type: Sequelize.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("searchHistories", "userId");
    await queryInterface.removeColumn("favouriteWords", "userId");
  },
};
