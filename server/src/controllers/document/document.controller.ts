import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import DocumentService from "../../services/document.services";
import Document from "../../db/models/document.model";
import { where } from "sequelize";
import DocumentUser from "../../db/models/document-user.model";

export default class DocumentController {
  static getOne = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) return res.sendStatus(401);
    const { id } = req.params;
    const document = await DocumentService.findDocumentById(
      parseInt(id),
      parseInt(req.user.id)
    );
    if (document == null) return res.sendStatus(404);
    return res.status(200).json(document);
  });
  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const documents = await Document.findAll({
      where: { userId: req.user?.id },
    });
    const documentUsers = await DocumentUser.findAll({
      where: {
        userId: req.user?.id,
      },
      include: {
        model: Document,
      },
    });
    const sharedDocuments = documentUsers.map(
      (documentUser) => documentUser.document
    );
    documents.push(...sharedDocuments);
    return res.status(200).json(documents);
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) return res.sendStatus(401);
    const { id } = req.params;
    const { title, content, isPublic } = req.body;
    const document = await DocumentService.findDocumentById(
      parseInt(id),
      parseInt(req.user.id)
    );
    if (document == null) return res.sendStatus(404);
    if (title !== null && title !== undefined) document.title = title;
    if (content !== null && content !== undefined) document.content = content;
    if (isPublic !== null && isPublic !== undefined)
      document.isPublic = isPublic;
    await document.save();
    return res.sendStatus(200);
  });
  static create = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) return res.sendStatus(401);
    const document = await Document.create({
      userId: req.user?.id,
    });
    return res.status(201).json(document);
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await Document.destroy({ where: { id, userId: req.user?.id } });
    return res.sendStatus(200);
  });
}
