import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import Document from "../../db/models/document.model";
import User from "../../db/models/user.model";
import DocumentUser from "../../db/models/document-user.model";

export default class ShareController {
  static create = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const document = await Document.findByPk(id);
    if (!document) return res.sendStatus(400);
    if (!req.user?.id || document.userId !== parseInt(req.user?.id))
      return res.sendStatus(400);
    const { email, permission } = req.body;
    const sharedUser = await User.findOne({ where: { email } });
    if (!sharedUser) return res.sendStatus(400);
    const documentUser = await DocumentUser.create({
      userId: sharedUser.id,
      documentId: id,
      permission,
    });
    const mail = {
      from: "georgeynr@gmail.com",
      to: sharedUser.email,
      subject: `${req.user.email} shared a document with you.`,
      text: `Click the following link to view and edit the document: http://localhost:3000/document/${id}`,
    };
    return res.status(201).json(documentUser);
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    const { documentId, userId } = req.params;
    const document = await Document.findOne({
      where: { userId, id: documentId },
    });
    if (!document) return res.sendStatus(400);
    const query = { where: { documentId, userId } };
    const documentUser = await DocumentUser.findOne(query);
    if (!documentUser) return res.sendStatus(400);
    documentUser.destroy();
    return res.sendStatus(200);
  });
}
