import {
  Table,
  Column,
  DataType,
  Model,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import PermissionEnum from "../../types/enums/permission-enum";
import User from "./user.model";
import Document from "./document.model";

@Table({
  tableName: "document_user",
  underscored: true,
  timestamps: true,
  indexes: [{ unique: true, fields: ["user_id", "document_id"] }],
})
export default class DocumentUser extends Model {
  @Column(DataType.ENUM(...Object.values(PermissionEnum)))
  permission!: PermissionEnum;

  @ForeignKey(() => User)
  @Column
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @ForeignKey(() => Document)
  @Column
  documentId!: number;

  @BelongsTo(() => Document)
  document!: Document;
}
