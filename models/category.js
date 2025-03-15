const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Category = sequelize.define("category", {
    images: {
        type: DataTypes.JSON,
        allowNull: false
      },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true
});

module.exports = Category;
