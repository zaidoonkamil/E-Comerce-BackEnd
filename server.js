const express = require("express");
const sequelize = require("./config/db");
const usersRouter = require("./routes/user");
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/category');
const orderRoutes = require("./routes/order");
const adsRoutes = require("./routes/ads");
const path = require('path');

const app = express();
app.use(express.json());
app.use("/uploads", express.static("./" + "uploads"));

sequelize.sync({ force: false })
    .then(() => console.log("✅ Database & User table synced!"))
    .catch(err => console.error("❌ Error syncing database:", err));

app.use("/", usersRouter);
app.use("/", productRoutes); 
app.use("/", categoryRoutes); 
app.use("/", orderRoutes);
app.use("/", adsRoutes);

app.listen( 3000 , () => {
    console.log(`🚀 Server running on http://localhost:3000`);
});
