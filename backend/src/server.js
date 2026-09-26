require("dotenv").config();

const app = require("./app");
const sequelize = require("./config/database");

require("./models");

const createAdmin = require("./seeders/adminSeeder");

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // الاتصال بقاعدة البيانات
    await sequelize.authenticate();

    console.log("✅ Database Connected");

    // تشغيل السيرفر مباشرة
    app.get("/api/health", (req, res) => {
      res.status(200).json({
        status: "ok",
        message: "ZYA backend is running",
      });
    });

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    // عمليات الخلفية
    sequelize
      .sync()
      .then(() => {
        console.log("✅ Database Synced");
        return createAdmin();
      })
      .then(() => {
        console.log("✅ Admin Ready");
      })
      .catch((error) => {
        console.error("❌ Background DB Error:", error);
      });
  } catch (error) {
    console.error("❌ Database Connection Error:", error);
    process.exit(1);
  }
}

startServer();
