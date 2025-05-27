import {
  Table,
  DataType,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  Default,
} from "sequelize-typescript";
import User from "./user.model";
import Role from "./role.model";

@Table({
  tableName: "user_role",
  underscored: true,
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ["user_id", "role_id"],
    },
  ],
})
export default class UserRole extends Model {
  @ForeignKey(() => User)
  @Column
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @ForeignKey(() => Role)
  @Column
  roleId!: number;

  @BelongsTo(() => Role)
  role!: Role;
}
