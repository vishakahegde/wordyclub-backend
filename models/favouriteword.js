"use strict";
module.exports = (sequelize, DataTypes) => {
  const favouriteWord = sequelize.define(
    "favouriteWord",
    {
      favouriteWord: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {}
  );
  favouriteWord.associate = function (models) {
    favouriteWord.belongsTo(models.user);
  };
  return favouriteWord;
};
