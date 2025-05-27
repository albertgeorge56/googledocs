import express, { Request, Response } from "express";
import "dotenv/config";
import env from "./config/env.config";
import sequelize from "./config/db.config";
import routes from "./routes";

const app = express();
app.use(express.json());

app.use(routes);

const port = env.PORT || 8080;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ DB connected");
    await sequelize.sync();
    console.log("✅ DB synced");
  } catch (error) {
    console.error("❌ DB error:", error);
  }
})();

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript server");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
