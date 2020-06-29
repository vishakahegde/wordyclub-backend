"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "searchHistories",
      [
        {
          searchWord: "Alcohol",
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          searchWord: "Human",
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          searchWord: "Rubber",
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          searchWord: "Bottle",
          userId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          searchWord: "Pen",
          userId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("searchHistories", null, {});
  },
};
