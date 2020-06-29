"use strict";
module.exports = (sequelize, DataTypes) => {
  const searchHistory = sequelize.define(
    "searchHistory",
    {
      searchWord: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {}
  );
  searchHistory.associate = function (models) {
    searchHistory.belongsTo(models.user);
  };
  return searchHistory;
};
