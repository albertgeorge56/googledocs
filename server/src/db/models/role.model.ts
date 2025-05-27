import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";
import RoleEnum from "../../types/enums/role-enum";
import User from "./user.model";
import UserRole from "./user-role.model";

@Table({ tableName: "roles", underscored: true, timestamps: true })
export default class Role extends Model {
  @Column(DataType.ENUM(...Object.values(RoleEnum)))
  name!: RoleEnum;

  @BelongsToMany(() => User, () => UserRole)
  users!: User[];

  @HasMany(() => UserRole, {
    onDelete: "CASCADE",
  })
  roleUsers!: UserRole[];
}
