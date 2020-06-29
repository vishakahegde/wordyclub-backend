"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "favouriteWords",
      [
        {
          favouriteWord: "Alcohol",
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          favouriteWord: "Human",
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("favouriteWords", null, {});
  },
};
