const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    "mydatabase", "zaidoon", "fabric@&7739898633", {
    host: "localhost",
    dialect: "mysql",
    logging: false,
});

sequelize.authenticate()
    .then(() => console.log("✅ Connected to MySQL successfully!"))
    .catch(err => console.error("❌ Unable to connect to MySQL:", err));

module.exports = sequelize;
