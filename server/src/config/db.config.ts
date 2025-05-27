import { Sequelize } from "sequelize-typescript";
import path from "path";
import env from "./env.config";
import User from "../db/models/user.model";
import RefreshToken from "../db/models/refresh-token.model";
import UserRole from "../db/models/user-role.model";
import Role from "../db/models/role.model";
import DocumentUser from "../db/models/document-user.model";
import Document from "../db/models/document.model";
import pg from "pg";

export const sequelize = new Sequelize(env.DB_URL, {
  dialect: "postgres",
  dialectModule: pg,
  models: [User, RefreshToken, Role, Document, DocumentUser, UserRole],
  define: {
    schema: "public", // 👈 Explicitly set schema to avoid internal fallback
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: console.log,
});

export default sequelize;
