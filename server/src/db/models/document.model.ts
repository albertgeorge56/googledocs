import {
  Table,
  DataType,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  Default,
  DefaultScope,
  HasMany,
} from "sequelize-typescript";
import User from "./user.model";
import DocumentUser from "./document-user.model";

@DefaultScope(() => ({
  include: [
    {
      model: DocumentUser,
      include: [{ model: User, attributes: ["email"] }],
    },
  ],
}))
@Table({
  tableName: "documents",
  underscored: true,
  timestamps: true,
})
export default class Document extends Model {
  @Column
  title!: string;

  @Column(DataType.JSON)
  content!: string;

  @ForeignKey(() => User)
  @Column
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @HasMany(() => DocumentUser, {
    onDelete: "CASCADE",
  })
  users!: DocumentUser[];

  @Default(false)
  @Column
  isPublic!: boolean;
}
