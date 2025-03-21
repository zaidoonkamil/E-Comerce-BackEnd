const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Category = require("./category");

const Products = sequelize.define("Products", {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.STRING,
      allowNull: false
    },
    images: {
      type: DataTypes.JSON,
      allowNull: false
    },
  //   categoryId: {
  //     type: DataTypes.INTEGER,
  //     allowNull: false,
  //     references: {
  //         model: "Categories",
  //         key: "id"
  //     }
  // },
   rating: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    }
  }, {
      timestamps: true,
});
  

Category.hasMany(Products, { foreignKey: "categoryId" });
Products.belongsTo(Category, { foreignKey: "categoryId" });

module.exports = Products;