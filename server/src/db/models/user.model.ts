import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  BelongsToMany,
  Scopes,
} from "sequelize-typescript";
import RefreshToken from "./refresh-token.model";
import Role from "./role.model";
import UserRole from "./user-role.model";
import DocumentUser from "./document-user.model";

@Scopes(() => ({
  withRoles: {
    include: [
      {
        model: UserRole,
        attributes: ["createdAt", "updatedAt"],
        include: [Role],
      },
    ],
  },
}))
@Table({ tableName: "users", timestamps: true, underscored: true })
export default class User extends Model {
  @Column
  email!: string;

  @Column
  password!: string;

  @Column(DataType.BOOLEAN)
  isVerified!: boolean;

  @Column
  verificationToken!: string;

  @Column
  passwordResetToken!: string;

  @HasMany(() => RefreshToken, {
    onDelete: "CASCADE",
  })
  refreshTokens!: RefreshToken[];

  @BelongsToMany(() => Role, () => UserRole)
  roles!: Role[];

  @HasMany(() => UserRole, {
    onDelete: "CASCADE",
  })
  userRoles!: UserRole[];

  @HasMany(() => DocumentUser, {
    onDelete: "CASCADE",
  })
  sharedDocuments!: DocumentUser[];
}
